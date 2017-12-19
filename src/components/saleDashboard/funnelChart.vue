<template>
    <div class="chart-conatiner">
        <svg>
            <text class="info"></text>
        </svg>
    </div>
</template>
<script>
import * as d3 from 'd3' 
import {mixin, ComputedType} from './mixin'

export default {
    mixins: [mixin],
    props: {
        // 图形数据
        chartData: {
            type: Array,
            default () {
                return []
            }
        },
        maxValue: {
            type: Number,
            default: null
        },
        rectHeight: {
            type: String,
            default: '15%'
        },
        rectStep: {
            type: String,
            default: '20%'
        },
        rectClick: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            // 图形颜色
            colors: d3.interpolateViridis,
            // todo 能否设定？
            width: 100,
            height: 50
        }
    },
    computed: {
        percentRectHeight () {
            return this.computedLength(this.rectHeight, ComputedType.height)
        },
        percentRectStep () {
            return this.computedLength(this.rectStep, ComputedType.height)
        },
        // 数据中的最大值
        dataMaxValue () {
            return this.maxValue ? this.maxValue : d3.max(this.chartData, d => d.value)
        },
        // 每个矩形的间距
        span () {
            return this.percentRectStep - this.percentRectHeight
        },
        // 数据和
        sumValue () {
            return d3.sum(this.chartData, d => d.value)
        },
        // 横向比例尺
        xScale () {
            return d3.scaleLinear()
                .domain([0, this.dataMaxValue])
                .range([0, this.width - this.percentPaddingLeft - this.percentPaddingRight])
        }
    },
    methods: {
        getRectY (i) {
            return this.percentPaddingTop + i * this.percentRectStep
        },
        getRectX (d) {
            return this.width / 2 - this.xScale(d.value / 2)
        },
        getRectColor (d) {
            return this.colors(1 - d.value / this.dataMaxValue)
        },
        getTextY (i) {
            // debugger
            return this.getRectY(i) + this.percentRectHeight / 2 - 2
            // return this.getRectY(i)
        },
        draw () {
            let vue = this
            let groupUpdate = this.svg.selectAll('g')
                .data(this.chartData)
            let groupEnter = groupUpdate.enter()
            let groupExit = groupUpdate.exit()

            // enter部分添加事件
            groupEnter = groupEnter.append('g')
                .on('mouseover', function (d, i) {
                    d3.select(this)
                        .select('rect')
                        .transition()
                        .duration(500)
                        .attr('x', vue.width / 2 - vue.xScale(d.value / 2) - 10)
                        .attr('width', vue.xScale(d.value) + 20)
                        .attr('height', vue.percentRectHeight + vue.span)
                        .attr('y', vue.percentPaddingTop + i * vue.percentRectStep - vue.span / 2)
                })
                .on('mouseout', function (d, i) {
                    d3.select(this)
                        .select('rect')
                        .transition()
                        .duration(500)
                        .attr('x', vue.width / 2 - vue.xScale(d.value / 2))
                        .attr('width', vue.xScale(d.value))
                        .attr('height', vue.percentRectHeight)
                        .attr('y', vue.percentPaddingTop + i * vue.percentRectStep)
                })
                .on('click', function (d, i) {
                    vue.rectClick(d)
                })
            // enter部分添加图形与文字
            groupEnter.each(function (d, i) {
                d3.select(this)
                    .append('rect')
                    .attr('y', vue.getRectY(i))         
                    .attr('height', vue.percentRectHeight)
                    .attr('fill', vue.getRectColor(d))
                    .attr('x', vue.width / 2)       // 用于动画
                    .attr('width', 0)               // 用于动画
                    .transition()
                    .duration(500)
                    .attr('x', vue.getRectX(d))
                    .attr('width', vue.xScale(d.value))
                
                d3.select(this)
                    .append('text')
                    .attr('y', vue.getTextY(i))
                    .attr('x', vue.width / 2)
                    .attr('fill', 'white')
                    .style('text-anchor', 'middle')
                    .style('dominant-baseline', 'middle')
                    .style('font-size', '3')
                    .text(d.text)
            })
            // updata部分直接更改
            groupUpdate.each(function (d, i) {
                d3.select(this)
                    .select('rect')
                    .attr('fill', vue.getRectColor(d))
                    .transition()
                    .duration(500)
                    .attr('x', vue.getRectX(d))
                    .attr('width', vue.xScale(d.value))
                
                d3.select(this)
                    .select('text')
                    .attr('y', vue.getTextY(i))
                    .attr('x', vue.width / 2)
                    .attr('fill', 'white')
                    .style('text-anchor', 'middle')
                    .style('dominant-baseline', 'middle')
                    .text(d.text)
            })
            // exit部分先缩小再删除
            groupExit.each(function (d, i) {
                d3.select(this)
                    .select('rect')
                    .transition()
                    .duration(500)
                    .attr('x', vue.width / 2)
                    .attr('width', 0)
                    .on('end', () => {
                        groupExit.remove()
                    })
            })

            if (this.chartData.length === 0) {
                this.svg.selectAll('text.info')
                    .attr('y', this.height / 2)
                    .attr('x', this.width / 2)
                    .attr('fill', 'black')
                    .style('text-anchor', 'middle')
                    .style('dominant-baseline', 'middle')
                    .text('暂无数据')
                return 
            } else {
                this.svg.selectAll('text.info')
                    .text('')
            }
        }
    }
}
</script>
<style scoped>
.chart-conatiner {
    min-width: 300px;
    min-height: 150px;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    padding-bottom: 50%;
    height: 0;
}
</style>

