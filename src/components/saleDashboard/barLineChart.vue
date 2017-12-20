<template>
    <div class="chart-conatiner">
        <svg />
    </div>
</template>
<script>
import * as d3 from "d3"
import { mixin, ComputedType } from "./mixin"

export default {
    mixins: [mixin],
    props: {
        chartData: {
            type: Array,
            default () {
                return [];
            }
        },
        xAxisKey: {
            type: String,
            default: "axis"
        },
        stackKeys: {
            type: Array,
            defaultt() {
                return ["stack"];
            }
        },
        paddingTop: {
            type: String,
            default: "10%"
        },
        paddingBottom: {
            type: String,
            default: "10%"
        },
        labelWidth: {
            type: String,
            default: "30px"
        },
        labelHeight: {
            type: String,
            default: "10px"
        },
        labelStep: {
            type: String,
            default: "15px"
        },
        barClick: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            // 图形宽高比
            width: 500,
            height: 300,
            // 颜色
            colors: d3.schemeCategory10,
            dataColor: {},
            // 过渡效果
            transition: d3
                .transition()
                .duration(2000)
                .ease(d3.easeCircleInOut),
            // 堆栈图group
            stackGroupsUpdate: null,
            stackGroupsEnter: null,
            stackGroupsExit: null,
            // 折线
            lineGroup: null,
            chartLine: null,
            tooltip: null
        };
    },
    computed: {
        percentLabelWidth() {
            return this.computedLength(this.labelWidth, ComputedType.width);
        },
        percentLabelHeight() {
            return this.computedLength(this.labelHeight, ComputedType.height);
        },
        percentLabelStep() {
            return this.computedLength(this.labelStep, ComputedType.height);
        },
        // x轴长度
        xAxisLength() {
            return this.width - this.percentPaddingLeft - this.percentPaddingRight;
        },
        // y轴长度
        yAxisLength() {
            return this.height - this.percentPaddingTop - this.percentPaddingBottom;
        },
        // 堆栈数据
        stackData() {
            return d3
                .stack()
                .keys(this.stackKeys)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone)(this.chartData);
        },
        xScale() {
            return d3
                .scaleBand()
                .domain(this.chartData.map(d => d[this.xAxisKey]))
                .range([0, this.xAxisLength])
                .paddingOuter(0.5)
                .paddingInner(0.2);
        },
        yScaleBar() {
            return d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(this.stackData[this.stackData.length - 1], d => d[1])
                ])
                .range([0, this.yAxisLength]);
        },
        yScaleLine() {
            return d3
                .scaleLinear()
                .domain([0, 1])
                .range([0, this.yAxisLength]);
        },
        yScaleBarDraw() {
            return d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(this.stackData[this.stackData.length - 1], d => d[1])
                ])
                .range([this.yAxisLength, 0]);
        },
        yScaleLineDraw() {
            return d3
                .scaleLinear()
                .domain([0, 1])
                .range([this.yAxisLength, 0]);
        },
        xAxis() {
            return d3.axisBottom().scale(this.xScale);
        },
        // 堆栈图纵坐标
        yAxisBar() {
            return d3.axisLeft().scale(this.yScaleBarDraw);
        },
        // 折线图纵坐标
        yAxisLine() {
            return d3.axisRight()
                .scale(this.yScaleLineDraw)
                .tickFormat(d3.format(".0%"));
        },
        line() {
            return d3.line()
                .x(d => this.xScale(d[this.xAxisKey]) + this.percentPaddingLeft + this.xScale.bandwidth() / 2)
                .y(d => this.height - this.percentPaddingBottom - this.yScaleLine(d.line))
        }
    },
    methods: {
        // 绘制图形
        draw() {
            if (this.chartData && this.chartData.length > 0) {
                this.drawStackGroup();
                this.drawStackBar();
                // this.drawLine()
                this.drawLengend();
                this.drawAxis();
            }
        },
        // 绘制坐标轴 没有添加 有更新
        drawAxis() {
            let currAxisBar = this.svg.selectAll("g.yAxisBar"),
                currAxisLine = this.svg.selectAll("g.yAxisLine"),
                currXaxis = this.svg.selectAll("g.xAxis");

            if (currAxisBar.empty()) {
                this.svg
                    .append("g")
                    .attr("class", "axis yAxisBar")
                    .attr(
                        "transform",
                        `translate(${this.percentPaddingLeft}, ${this.percentPaddingTop})`
                    )
                    .call(this.yAxisBar);
            } else {
                currAxisBar
                    .attr("class", "axis yAxisBar")
                    .attr(
                        "transform",
                        `translate(${this.percentPaddingLeft}, ${this.percentPaddingTop})`
                    );
            }

            if (currAxisLine.empty()) {
                this.svg
                    .append("g")
                    .attr("class", "axis yAxisLine")
                    .attr(
                        "transform",
                        `translate(${this.width - this.percentPaddingRight}, ${this
              .percentPaddingTop})`
                    )
                    .call(this.yAxisLine);
            } else {
                currAxisLine
                    .attr("class", "axis yAxisLine")
                    .attr(
                        "transform",
                        `translate(${this.width - this.percentPaddingRight}, ${this
              .percentPaddingTop})`
                    );
            }

            if (currXaxis.empty()) {
                this.svg
                    .append("g")
                    .attr("class", "axis xAxis")
                    .attr(
                        "transform",
                        `translate(${this.percentPaddingLeft}, ${this.height -
              this.percentPaddingBottom})`
                    )
                    .call(this.xAxis);
            } else {
                currXaxis.attr(
                    "transform",
                    `translate(${this.percentPaddingLeft}, ${this.height -
            this.percentPaddingBottom})`
                );
            }
        },
        // 绘制堆栈图group
        drawStackGroup() {
            let tempColorObj = {}
            this.stackKeys.forEach((key, index) => {
                tempColorObj[key] = this.colors[index]
            })
            this.dataColor = tempColorObj
            // update部分
            this.stackGroupsUpdate = this.svg
                .selectAll("g.bar-container")
                .data(this.stackData);

            // enter部分
            this.stackGroupsEnter = this.stackGroupsUpdate
                .enter()
                .append("g")
                .attr("class", (d, i) => `bar-container index-${i}`)
                .style("fill", (d, i) => this.dataColor[d.key])

            // exit部分
            this.stackGroupsExit = this.stackGroupsUpdate.exit();
        },
        // 绘制堆栈图
        drawStackBar() {
            let vue = this;

            // enter部分
            this.stackGroupsEnter
                .selectAll("rect.bar")
                .data(d => d)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("width", d => this.xScale.bandwidth())
                .attr("height", 0)
                .attr("y", this.height - this.percentPaddingBottom)
                .attr(
                    "x",
                    d => this.xScale(d.data[this.xAxisKey]) + this.percentPaddingLeft
                )
                .on("mouseover", function (d) {
                    let parent = d3.select(this.parentNode)
                    let self = d3.select(this)
                    vue.stackMouseover(parent, self, d)
                    let content = []
                    for (let i of vue.stackKeys) {
                        content.push({
                            label: i,
                            value: d.data[i],
                            color: vue.dataColor[i]
                        })
                    }
                    vue.drawToolTip(d.data.month, content)
                })
                .on('mousemove', function (d) {
                    vue.updateToolTip()
                })
                .on("mouseout", function (d) {
                    let parent = d3.select(this.parentNode);
                    let self = d3.select(this);
                    vue.stackMouseout(parent, self, d)
                    vue.hideToolTip()
                })
                .on("click", function (d, i) {
                    vue.barClick(i);
                })
                .transition(this.transition)
                .attr(
                    "y",
                    d => this.height - this.percentPaddingBottom - this.yScaleBar(d[1])
                )
                .attr("height", d => this.yScaleBar(d[1]) - this.yScaleBar(d[0]));
        },
        // 绘制图例
        drawLengend() {
            let vue = this

            // 绘制图例图标
            let stackLabelRects = this.stackGroupsEnter
                .append("rect")
                .attr("class", "labelRect")
                .attr("x", this.percentPaddingLeft + 20)
                .attr(
                    "y",
                    (d, i) => this.percentPaddingTop + this.percentLabelStep * i + 10
                )
                .attr("width", this.percentLabelWidth)
                .attr("height", this.percentLabelHeight)
                .on("mouseover", function () {
                    vue.labelRectMouseover(this);
                    vue.stackMouseoverByLegend(arguments[1]);
                })
                .on("mouseout", function () {
                    vue.labelRectMouseout(this);
                    vue.stackMouseoutByLegend();
                });

            // 绘制说明文字
            this.stackGroupsEnter
                .append("text")
                .attr("class", "labelText")
                .attr("x", this.percentPaddingLeft + 20 + this.percentLabelWidth + 10)
                .attr(
                    "y",
                    (d, i) =>
                    this.percentPaddingTop +
                    this.percentLabelStep * i +
                    this.percentLabelWidth / 2 +
                    2
                )
                .text(d => d.key)
                .style("text-anchor", "start")
                .style("dominant-baseline", "middle");

            // let lineLabelRect = this.lineGroup.append('rect')
            //     .attr('class', 'line-label-rect')
            //     .attr('x', this.percentPaddingLeft + 20)
            //     .attr('y', stackLabelRects.nodes()[stackLabelRects.size() - 1].y.baseVal.value + this.percentLabelStep)
            //     .attr('width', this.percentLabelWidth)
            //     .attr('height', this.percentLabelHeight)
            //     .on('mouseover', function () {
            //         vue.labelRectMouseover(this)
            //         vue.lineMouseover()
            //     })
            //     .on('mouseout', function () {
            //         vue.labelRectMouseout(this)
            //         vue.lineMouseout()
            //     })
            // this.lineGroup.append('text')
            //     .attr('class', 'line-label-text')
            //     .attr('x', this.percentPaddingLeft + 20 + this.percentLabelWidth + 10)
            //     .attr('y', lineLabelRect.node().y.baseVal.value + this.percentLabelWidth / 2 - 5)
            //     .text('line')
            //     .style('text-anchor', 'start')
            //     .style('dominant-baseline', 'middle')
        },
        // 绘制折线图
        drawLine() {
            let vue = this;
            this.lineGroup = this.svg
                .append("g")
                .attr("class", "line-conatiner")
                .attr("fill", "red");

            this.chartLine = this.lineGroup
                .append("path")
                .datum(this.chartData)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("d", this.line)
                .on("mouseover", () => {
                    this.lineMouseover();
                })
                .on("mouseout", () => {
                    this.lineMouseout();
                });

            let length = this.chartLine.node().getTotalLength();

            this.chartLine
                .attr("stroke-dasharray", `0, ${length}`)
                .transition()
                .duration(2500)
                .attr("stroke-dasharray", `${length}, 0`);

            // 折线文字数据
            this.lineGroup
                .selectAll("text .line-text")
                .data(this.chartData)
                .enter()
                .append("text")
                .attr("class", "line-text")
                .attr(
                    "x",
                    d =>
                    this.xScale(d[this.xAxisKey]) +
                    this.percentPaddingLeft +
                    this.xScale.bandwidth() / 2 +
                    20
                )
                .attr(
                    "y",
                    d => this.height - this.percentPaddingBottom - this.yScaleLine(d.line)
                )
                .text(d => d3.format(".0%")(d.line))
                .attr("fill", "black");
        },
        // 提示mouseover
        labelRectMouseover(rect) {
            d3.select(rect)
                .transition()
                .duration(500)
                .attr("width", this.percentLabelWidth + 5)
                .attr("height", this.percentLabelHeight + 3);
        },
        // 提示mouseout
        labelRectMouseout(rect) {
            d3.select(rect)
                .transition()
                .duration(500)
                .attr("width", this.percentLabelWidth)
                .attr("height", this.percentLabelHeight);
        },
        // 图例mouseover
        stackMouseoverByLegend(index) {
            let currGroup = d3.select(this.stackGroupsEnter.nodes()[index]);
            let currColor = currGroup.style("fill");

            currGroup
                .transition()
                .duration(500)
                .style("fill", d3.color(currColor).brighter());
        },
        // 图例mouseout
        stackMouseoutByLegend() {
            this.stackGroupsEnter
                .transition()
                .duration(500)
                .style("fill", (d, i) => this.colors[i]);
        },
        lineMouseover() {
            this.chartLine
                .transition()
                .duration(500)
                .attr("stroke-width", 5);
        },
        lineMouseout() {
            this.chartLine
                .transition()
                .duration(500)
                .attr("stroke-width", 3);
        },
        // 堆栈图
        stackMouseover(parentNode, self, data) {
            let vue = this;
            let currIndex = null;
            parentNode.selectAll("rect.bar").each(function (d, i) {
                if (this === self.node()) {
                    currIndex = i;
                }
            });
            if (currIndex === null) {
                throw new Error(`找不到当前bar: ${self}`);
            }
            this.svg.selectAll(".bar-container").each(function (d, index) {
                d3.select(this)
                    .selectAll("rect.bar")
                    .filter((d, i) => i === currIndex)
                    .interrupt()

                d3.select(this)
                    .selectAll("rect.bar")
                    .filter((d, i) => i === currIndex)
                    .transition(vue.transition)
                    .attr("y", d => vue.height - vue.percentPaddingBottom -vue.yScaleBar(d[1]) - (index + 1) * 10)
                    .attr("height", d => d[0] === d[1] ? 0 : vue.yScaleBar(d[1]) - vue.yScaleBar(d[0]) + 10)
            });
        },
        stackMouseout(parentNode, self) {
            let vue = this;
            let currIndex = null;
            parentNode.selectAll("rect.bar").each(function (d, i) {
                if (this === self.node()) {
                    currIndex = i;
                }
            });
            if (currIndex === null) {
                throw new Error(`找不到当前bar: ${self}`);
            }
            this.svg.selectAll(".bar-container").each(function (data, index) {
                d3
                    .select(this)
                    .selectAll("rect.bar")
                    .filter((d, i) => i === currIndex)
                    .interrupt();

                d3
                    .select(this)
                    .selectAll("rect.bar")
                    .filter((d, i) => i === currIndex)
                    .transition(vue.transition)
                    .attr(
                        "y",
                        d => vue.height - vue.percentPaddingBottom - vue.yScaleBar(d[1])
                    )
                    .attr("height", d => vue.yScaleBar(d[1]) - vue.yScaleBar(d[0]));
            })
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
                .select('div.tooltip')
                .style('opacity', 0)
        }
    },
    mounted() {
        // todo 判断有没有
        this.tooltip = d3.select("body")  
            .append("div")  
            .attr("class","tooltip")  
            .style("opacity",0.0)
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