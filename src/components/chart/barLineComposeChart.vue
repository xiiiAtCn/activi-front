<template>
    <div class="chart-conatiner">
        <svg />
    </div>
</template>
<script>
import * as d3 from "d3"
import _ from 'lodash'
import { mixin, ComputedType } from "./mixin"

function createObj (obj) {
    let result = {...obj}
    let index = 0
    for (let i in obj) {
        result[index++] = obj[i]
    }
    result.length = index
    return result
}
const axisType = {
    x: 'x',
    y: 'y',
}
const axisScaleType = {
    value: 'value',
    category: 'category'
}
const xAxisDirection = {
    bottom: 'axisBottom',
    top: 'axisTop'
}
const yAxisDirection = {
    left: 'axisLeft',
    right: 'axisRight'
}

export default {
    mixins: [mixin],
    props: {
        chartData: {
            type: Object,
            default () {
                return {}
            }
        },
        barClick: {
            type: Function,
            default: () => {}
        },
        paddingTop: {
            type: String,
            default: '20%'
        },
        legendStep: {
            type: String,
            default: '20px'
        },
        legendHeight: {
            type: String,
            default: '10px'
        },
        legendWidth: {
            type: String,
            default: '30px'
        },
        legendInnterStep: {
            type: String,
            default: '5px'
        }
    },
    data() {
        return {
            // 图形宽高比
            width: 500,
            height: 300,
            transition: d3.transition()
                .duration(3000)
                .ease(d3.easeCircleInOut),
            seriesFilterCondition: [],
            tooltip: null
        };
    },
    computed: {
        // 标题
        title () {
            return this.chartData.title
        },
        percentLegendWidth() {
            return this.computedLength(this.legendWidth, ComputedType.width);
        },
        percentLegendHeight() {
            return this.computedLength(this.legendHeight, ComputedType.height);
        },
        percentLegendStep () {
            return this.computedLength(this.legendStep, ComputedType.width)
        },
        percentLegendInnterStep () {
            return this.computedLength(this.legendInnterStep, ComputedType.width )
        },
        // 图例
        legend () {
            return this.chartData.legend
        },
        // 每种分类对应设置及数据
        series () {
            return this.chartData.series
        },
        filterSeries () {
          return this.series.filter(item => !this.seriesFilterCondition.includes(item.name))  
        },
        // x轴设置
        xAxisOption () {
            return this.chartData.xAxis
        },
        // y轴设置
        yAxisOption () {
            return this.chartData.yAxis
        },
        // x轴长度
        xAxisLength() {
            return this.width - this.percentPaddingLeft - this.percentPaddingRight
        },
        // y轴长度
        yAxisLength() {
            return this.height - this.percentPaddingTop - this.percentPaddingBottom
        },
        // 每个x轴最大值
        xAxisMaxValue () {
            return this._getAxisMaxValue(axisType.x)
        },
        // 每个y轴的最大值
        yAxisMaxValue () {
            return this._getAxisMaxValue(axisType.y)
        },
        xAxisScale () {
            return this._getAxisScale(axisType.x)
        },
        yAxisScale () {
            return this._getAxisScale(axisType.y)
        },
        yAxisScaleDraw () {
            return this._getAxisScale(axisType.y, true)
        },
        xAxis () {
            return this._getAxis(axisType.x)
        },
        yAxis () {
            return this._getAxis(axisType.y)
        },
        colors () {
            return this.series.length > 10 ? d3.schemeCategory20c : d3.schemeCategory20c
        }
    },
    mounted() {
        let tooltip = d3.select('body').select('.tooltip')
        if (!tooltip.empty()) {
            this.tooltip = tooltip.attr("class","tooltip")  
                .style("opacity", 0.0)
                .style('display', 'none')
        } else {
            this.tooltip = d3.select('body')  
                .append("div")  
                .attr("class","tooltip")  
                .style("opacity",0.0)
                .style('display', 'none')
        }
    },
    destroyed () {
        d3.select('body').selectAll('div.tooltip').remove()
    },
    methods: {
        draw () {
            if (this.xAxisOption && this.xAxisOption.length > 0) {
                this.drawAxis()
                this.drawSeries()
                this.drawLegend()
                this.drawTitle()
            }
        },
        drawAxis () {
            // 绘制x轴
            this._drawAxis(axisType.x, this.xAxisOption)
            // 绘制y轴
            this._drawAxis(axisType.y, this.yAxisOption)
        },
        // 计算轴值域最大值
        _getAxisMaxValue (type) {
            let result = [],
                maxValue = null,
                index = null  
            
            if (type === axisType.x) {
                index = 'xAxisIndex'
            } else if (type === axisType.y) {
                index = 'yAxisIndex'
            }

            for (let item of this.series) {
                maxValue = d3.max(item.data)
                if (typeof result[item[index]] === 'undefined') {
                    result[item[index]] = maxValue
                } else if (result[item[index]] < maxValue) {
                    result[item[index]] = maxValue
                }
            }
            return result
        },
        // 计算轴比例尺
        _getAxisScale (type, exchange) {
            let result = [],
                vue = this,
                option = null,
                maxValue = null,
                axisLength = null,
                range = null

            if (type === axisType.x) {
                option = this.xAxisOption
                maxValue = this.xAxisMaxValue
                axisLength = this.xAxisLength
            } else if (type === axisType.y) {
                option = this.yAxisOption
                maxValue = this.yAxisMaxValue
                axisLength = this.yAxisLength
            }

            if (exchange) {
                range = [axisLength, 0]
            } else {
                range = [0, axisLength]
            }

            option.forEach((axis, index) => {
                if (axis.type === axisScaleType.value) {
                    result.push(d3.scaleLinear().domain([0, maxValue[index]]).range(range))
                } else if (axis.type === axisScaleType.category) {
                    let x0 = d3.scaleBand()
                        .domain(axis.data)
                        .rangeRound(range)
                        .paddingOuter(0.5)
                        .paddingInner(0.2)
                    result.push([
                        x0,
                        d3.scaleBand()
                            .domain(vue.legend.data.filter(d => {
                                let serie  = vue.filterSeries.filter(item => item.name === d)
                                return serie && serie.length > 0 && serie[0].type === 'bar'
                            }))
                            .rangeRound([0, x0.bandwidth()]).padding(0.2)
                    ])
                }
            })
            return result
        },
        // 轴
        _getAxis (type) {
            let result = [],
                option = null,
                scaleArray = null,
                firstAxis = null,
                secondAxis = null

            if (type === axisType.x) {
                option = this.xAxisOption
                scaleArray = this.xAxisScale
                firstAxis = d3.axisBottom()
                secondAxis = d3.axisTop()
            } else if (type === axisType.y) {
                option = this.yAxisOption
                scaleArray = this.yAxisScaleDraw
                firstAxis = d3.axisLeft()
                secondAxis = d3.axisRight()
            }

            option.forEach((item, index) => {
                let scale = null

                if (item.type === axisScaleType.category) {
                    scale = scaleArray[index][0]
                } else {
                    scale = scaleArray[index]
                }
                result.push(index % 2 === 0 ? 
                    firstAxis.scale(scale) : 
                    secondAxis.scale(scale))
            })
            return result
        },
        // 计算轴的各个属性值
        _drawAxis (type, option) {
            if (type === axisType.x) {
                option.forEach((item, index) => {
                    this._drawAxisForReal(this.percentPaddingLeft, 
                        index % 2 === 0 ? this.height - this.percentPaddingBottom : this.percentPaddingTop, 
                        `axis xAxis index-${index}`,
                        this.xAxis[index],
                        item.unit,
                        type)
                })
            } else if (type === axisType.y) {
                option.forEach((item, index) => {
                    this._drawAxisForReal(index % 2 === 0 ? this.percentPaddingLeft : this.width - this.percentPaddingRight, 
                        this.percentPaddingTop, 
                        `axis yAxis index-${index}`,
                        this.yAxis[index],
                        item.unit,
                        type)
                })
            }
        },
        // 绘制轴
        _drawAxisForReal (translateX, translateY, className, axisScale, unit, type) {
            d3.selectAll(`.${className.split(" ").join(".")}`).remove()
            let axis = this.svg
                .append('g')
                .attr("class", className)
                .attr("transform", `translate(${translateX}, ${translateY})`)
                .call(axisScale),
                bBox = axis.node().getBBox()

            if (type === axisType.x) {
                this.svg
                    .append('text')
                    .attr('class', className)
                    .attr("x", translateX + bBox.width + 5)
                    .attr('y', translateY)
                    .text(unit)
                    .style("text-anchor", "start")
                    .style("dominant-baseline", "text-before-edge")
                    .style('font-size', '10px')
            } else {
                this.svg
                    .append('text')
                    .attr('class', className)
                    .attr("x", translateX)
                    .attr('y', translateY - 5)
                    .text(unit)
                    .style("text-anchor", "end")
                    .style("dominant-baseline", "text-after-edge")
                    .style('font-size', '10px')
            }
        },
        // 遍历serises绘制图形
        drawSeries () {
            let lineQueue = {},
                barQueue = {}
            this.series.forEach((item, index) => {
                let xAxisOption = this.xAxisOption[item.xAxisIndex],
                    yAxisOption = this.yAxisOption[item.yAxisIndex],
                    categoryData = null,
                    categoryScale = null,
                    valueScale = null,
                    type,
                    vue = this,
                    key = `${item.xAxisIndex}-${item.yAxisIndex}`
                
                // 根据轴类型计算属性值
                if (xAxisOption.type === 'category') {
                    categoryData = xAxisOption.data
                    categoryScale = this.xAxisScale[item.xAxisIndex]
                    valueScale = this.yAxisScale[item.yAxisIndex]
                    type = axisType.x
                } else {
                    categoryData = yAxisOption.data
                    categoryScale = this.yAxisScale[item.yAxisIndex]
                    valueScale = this.xAxisScale[item.xAxisIndex]
                    type = axisType.y
                }

                // 根据图形类型分类 添加到数组中
                if (item.type === 'line') {
                    let x = null,
                        y = null   

                    if (xAxisOption.type === 'category') {
                        x = (d, i) => 
                            vue.percentPaddingLeft + 
                            vue.xAxisScale[item.xAxisIndex][0](categoryData[i]) + 
                            vue.xAxisScale[item.xAxisIndex][0].bandwidth() / 2
                        y = (d, i) => vue.height - vue.percentPaddingBottom - vue.yAxisScale[item.yAxisIndex](d)
                    } else {
                        x = (d, i) => vue.percentPaddingLeft + vue.xAxisScale[item.xAxisIndex](d)
                        y = (d, i) => 
                            vue.percentPaddingTop + 
                            vue.yAxisScale[item.yAxisIndex][0](categoryData[i]) +
                            vue.yAxisScale[item.yAxisIndex][0].bandwidth() / 2
                    }

                    let lineParams = lineQueue[key]
                    if (!lineParams) {
                        lineQueue[key] = {
                            data: [],
                            params: [x, y],
                            legend: []
                        }
                    }
                    lineQueue[key].data.push(item.data)
                    lineQueue[key].legend.push(item.name)
                } else if (item.type === 'bar') {
                    let xyAxisParams = barQueue[key]
                    // 相同xy轴的参数不存在初始化
                    if (!xyAxisParams) {
                        barQueue[key] = {
                            data: [],
                            params: [categoryData, categoryScale, valueScale, type],
                            legend: []
                        }
                    }
                    barQueue[key].data.push(item.data)
                    barQueue[key].legend.push(item.name)
                }
            })

            while (Object.keys(barQueue).length > 0) {
                let key = Object.keys(barQueue)[0],
                    param = barQueue[key]
                this.drawBar(param.data, ...param.params, param.legend)
                delete barQueue[key]
            }
            while (Object.keys(lineQueue).length > 0) {
                let key = Object.keys(lineQueue)[0],
                    param = lineQueue[key]
                this.drawLine(param.data, ...param.params, param.legend)
                delete lineQueue[key]
            }
            
        },
        removeLine (legend) {
            legend.forEach((item, index) => {
                this.svg
                    .selectAll(`g.line-container.${item}`)
                    .attr('opacity', 1)
                    .attr('opacity', 0)
                    .remove()
            })
        },
        // 绘制折线
        drawLine (data, x, y, legend) {
            let vue = this,
                line = d3.line()
                    .x(x)
                    .y(y)
                    .curve(d3.curveBasis),
                removeArr = []

            // 过滤数据
            this.seriesFilterCondition.forEach(item => {
                let index = legend.indexOf(item)
                if (index !== -1) {
                    data.splice(index, 1)
                    legend.splice(index, 1)
                    removeArr.push(item)
                }
            })
            // remove
            this.removeLine(removeArr)
            // update or enter
            legend.forEach((item, index) => {
                let lineUpdate = this.svg.selectAll(`g.line-container.${item}`).data([data[index]]),
                    lineEnter = lineUpdate.enter(),
                    lineExit = lineUpdate.exit()
                
                lineEnter.append('g')
                    .attr('class', `line-container ${item}`)
                    .append('path')
                    .attr('stroke-width', 1.5)
                    .style('fill', 'none')
                    .style('stroke', (d, i) => this.colors[this.legend.data.indexOf(item)])
                    .attr('d', line)
                    .attr("stroke-dasharray", function () {
                        return this.getTotalLength()
                    })
                    .attr('stroke-dashoffset', function () {
                        return this.getTotalLength()
                    })
                    .interrupt()
                    .transition(this.transition)
                    .attr("stroke-dashoffset", 0)
                
                lineUpdate.attr('class', `line-container ${item}`)
                    .select('path')
                    .style('stroke', (d, i) => this.colors[this.legend.data.indexOf(item)])
                    .interrupt()
                    .attr('d', line)
                    .transition(this.transition)
                    .attr("stroke-dasharray", function () {
                        return this.getTotalLength()
                    })
                    .attr("stroke-dashoffset", 0)
            })
        },
        /**
         * @argument data 柱状图数据
         * @argument categoryData 分类轴对应数据
         * @argument categoryScale 分类轴对应比例尺
         * @argument valueScale 数值轴对应比例尺
         * @argument type 分类轴类型（x||y）
         */
        drawBar (data, categoryData, categoryScale, valueScale, type, legend) {
            // 过滤数据
            this.seriesFilterCondition.forEach((item) => {
                let index = legend.indexOf(item)
                if (index !== -1) {
                    // todo 过滤数据
                    data.splice(index, 1)
                    legend.splice(index, 1)
                }
            })
            
            let vue = this
            // 先绘制group确定每个group的transition
            this.addBarGroup(categoryData, categoryScale, type)
            // 遍历group添加rect
            d3.selectAll('g.bar-container').each(function (d, i) {
                let groupValueData = [],
                    x = null,
                    y = null,
                    width = null,
                    height = null

                data.map(d => {
                    groupValueData.push(d[i])
                })

                if (type === axisType.x) {
                    x = (d, i) => categoryScale[1](legend[i])
                    y = (d, i) => vue.height - vue.percentPaddingBottom - valueScale(d)
                    width = categoryScale[1].bandwidth()
                    height = (d, i) => valueScale(d)
                } else if (tyep === axisType.y) {
                    x= (d, i) => vue.percentPaddingLeft + valueScale(d) 
                    y = (d, i) => vue.height - vue.percentPaddingBottom - categoryScale[1](legend[i])
                    width = (d, i) => valueScale(d)
                    height = categoryScale[1].bandwidth()
                }

                let rectUpdate = d3.select(this)
                        .selectAll('rect.bar')
                        .data(groupValueData),
                    rectEnter = rectUpdate.enter(),
                    rectExit = rectUpdate.exit()
                
                rectUpdate
                    .interrupt()
                    .transition(vue.transition)
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', width)
                    .attr('height', height)
                    .attr('fill', (d, i) => vue.colors[vue.legend.data.indexOf(legend[i])])
                
                rectEnter.append('rect')
                    .attr('class', 'bar')
                    .attr('x', x)
                    .attr('y', vue.height - vue.percentPaddingBottom)
                    .attr('width', width)
                    .attr('height', 0)
                    .transition(vue.transition)
                    .attr('y', y)
                    .attr('height', height)
                    .attr('fill', (d, i) => vue.colors[vue.legend.data.indexOf(legend[i])])

                rectExit.interrupt()
                    .transition(vue.transition)
                    .attr('y', vue.height - vue.percentPaddingBottom)
                    .attr('height', 0)
                    .remove()
            })
        },
        /**
         * @argument data 分类轴对应的数据
         * @argument scale 分类轴对应的比例尺
         * @argument type 分类轴对应的轴（x||y）
         * 
         * 绘制柱状图group
         */
        addBarGroup (data, scale, type) {
            let groupUpdate = this.svg
                    .selectAll('g.bar-container')
                    .data(data),
                groupEnter = groupUpdate.enter(),
                groupExit = groupUpdate.exit(),
                vue = this
            
            let translate = null,
                width = null,
                height = null,
                x = null,
                y = null

            if (type === axisType.x) {
                translate = d => `translate(${scale[0](d) + vue.percentPaddingLeft}, 0)`
                width = scale[0].bandwidth()
                height = this.height - this.percentPaddingTop - this.percentPaddingBottom
                y = this.percentPaddingTop
                x  = 0
            } else {
                translate = d => `translate(0, ${scale[0](d)})`
                width = this.width - this.percentPaddingLeft - this.percentPaddingRight
                height = scale[0].bandwidth()
                x = this.percentPaddingLeft
                y = 0
            }
            
            groupEnter.append('g')
                .attr('class', 'bar-container')
                .attr('transform', translate)
                .on('mouseover', function (data, index){
                    d3.select(this)
                        .attr('cursor', 'pointer')
                        .select('.bar-background')
                        .attr('opacity', 0.3)
                        
                    let content = [],
                        categoryData = []
                    vue.series.forEach((item, i) => {
                        categoryData.push(item.data[index])
                    })
                    vue.legend.data.forEach((item, i) => {
                        if (!vue.seriesFilterCondition.includes(item)) {
                            content.push({
                                label: item,
                                value: categoryData[i],
                                color: vue.colors[i]
                            })
                        }
                    })
                    
                    vue.drawToolTip(data, content)
                })
                .on('mousemove', function () {
                    vue.updateToolTip()  
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .select('.bar-background')
                        .attr('opacity', 0)
                    
                    vue.hideToolTip()
                })
                .on('click', function (data, index) {
                    vue.barClick(data, index)
                })
                .append('rect')
                .attr('class', 'bar-background')
                .attr('height', height)
                .attr('width', width)
                .attr('y', y)
                .attr('x', x)
                .attr('opacity', 0)
            
            groupUpdate.attr('class', 'bar-container')
                .attr('transform', translate)

            groupExit.remove()
        },
        drawLegend () {
            let vue = this
            // 清除之前的legend
            this.svg.selectAll('g.legend').remove()

            let legendGroup = this.svg.append('g')
                    .attr('class', 'legend')
                    .attr('fill', 'white')

            this.legend.data.forEach((item, index) => {
                let color = this.seriesFilterCondition.includes(item) ? 'black' : this.colors[index]
                let itemGroup = legendGroup.append('g')
                    .attr('class', 'legend-item-container')
                    .attr('fill', color)
                    .on('click', function () {
                        vue._legendClick(item, this)
                    })

                let bBox = legendGroup.node().getBBox(),
                    x = index === 0 ? 
                        this.percentPaddingLeft : 
                        this.percentPaddingLeft + bBox.width + this.percentLegendStep,
                    y = this.percentPaddingTop / 2

                itemGroup.append('rect')
                    .attr('class', 'legend-item-pic')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', this.percentLegendWidth)
                    .attr('height', this.percentLegendHeight)
                
                itemGroup.append('text')
                    .attr('class', 'legend-item-text')
                    .attr('x', x + this.percentLegendWidth + this.percentLegendInnterStep)
                    .attr('y', y)
                    .text(item)
                    .style("text-anchor", "start")
                    .style("dominant-baseline", "central")
                    .style('font-size', '5px')
            })  
        },
        _legendClick (d, self) {
            if (this.seriesFilterCondition.includes(d)) {
                this.seriesFilterCondition.splice(this.seriesFilterCondition.indexOf(d), 1)
            } else {
                this.seriesFilterCondition.push(d)
            }
            this.draw()
        },
        _getLegendType (legend) {
            return this.series.filter(item => item.name === legend)[0].type
        },
        drawToolTip (title, content) {
            let contentHtml = `<span>${title}</span>`
            for (let item of content) {
                contentHtml += `
                <div class="data-item">
                    <span class="circle" style="background-color: ${item.color}"></span>
                    <span>${item.label}:</span>
                    <span>${item.value}</span>
                </div>`
            }
            this.tooltip.html(contentHtml)
                .style('display', 'block')
                .style("left", (d3.event.pageX) + "px")  
                .style("top", (d3.event.pageY + 20) + "px")  
                .style("opacity", 0.8)
        },
        updateToolTip() {
            this.tooltip.style("left", (d3.event.pageX) + "px")  
                .style("top", (d3.event.pageY + 20) + "px")  
        },
        hideToolTip () {
            d3.select('body')
                .selectAll('div.tooltip')
                .style('opacity', 0)
                .style('display', 'none')
        },
        drawTitle () {
            let titleGroup = this.svg.selectAll('g.title-container')
            if (titleGroup.node()) {
                titleGroup.selectAll('g.title')
                    .select('text')
                    .text(this.title.text)
                titleGroup.selectAll('g.subtitle')
                    .select('text')
                    .text(this.title.subtext)
            } else {
                let container = this.svg.append('g')
                    .attr('class', 'title-container')
                container.append('g')
                    .attr('class', 'title')
                    .append('text')
                    .text(this.title.text)
                    .attr('x', this.width / 2)
                    .attr('y', 0)
                    .style("text-anchor", "middle")
                    .style("dominant-baseline", "text-before-edge")
                    .style('font-size', '10px')
                    
                container.append('g')
                    .attr('class', 'subtitle')
                    .append('text')
                    .attr('x', this.width / 2)
                    .attr('y', container.node().getBBox().height)
                    .text(this.title.subtext)
                    .style("text-anchor", "middle")
                    .style("dominant-baseline", "text-before-edge")
                    .style('font-size', '5px')
            }
        }
    },
    watch: {
        chartData (newVal, oldVal) {
            if (!_.isEqual(newVal, oldVal)) {
                if (Object.keys(oldVal).length > 0) {
                    this.removeLine(oldVal.legend.data)
                }
                this.seriesFilterCondition = []
                this.draw(newVal, oldVal)
            }
        }
    }
}
</script>
<style scoped>
.chart-conatiner {
    min-width: 300px;
    min-height: 180px;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    padding-bottom: 60%;
    height: 0;
}
</style>

<style>
.tooltip {
    position: absolute;
    height: auto;
    font-family: simsun;
    font-size: 14px;
    text-align: center;
    border-style: solid;
    border-width: 1px;
    background-color: white;
    border-radius: 10px;
    padding: 10px 10px
}
.tooltip .circle {
    display:inline-block;
    margin-right:5px;
    border-radius:10px;
    width:9px;height:9px;
    background-color:#06B800;
}
.tooltip .data-item {
    text-align: left;
}
</style>