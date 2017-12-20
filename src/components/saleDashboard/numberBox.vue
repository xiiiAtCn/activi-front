<template>
    <div class="chart-conatiner">
        <svg/>
    </div>
</template>

<script>
import * as d3 from "d3";
import { mixin, ComputedType } from "./mixin";

export default {
    mixins: [mixin],
    props: {
        chartData: {
            type: Array,
            default () {
                return [];
            }
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 定义图形宽高比
            width: 60,
            height: 10,
            // 边框宽度
            rectStrokeWidth: "2px",
            // group
            boxGroupUpdate: null,
            enterBoxGroups: null,
            // 动画时间、缓动函数
            transition: d3.transition()
                .duration(2500)
                .ease(d3.easeCircleInOut)
        };
    },
    computed: {
        // 图形个数
        length() {
            return this.chartData.length;
        },
        // 每个图形宽度
        step() {
            return this.computedLength((this.svg.node().clientWidth || this.svg.node().parentNode.clientWidth) / this.length + "px", ComputedType.width)
        },
        // group
        boxGroupEnter() {
            return this.boxGroupUpdate.enter();
        },
        boxGroupExit() {
            return this.boxGroupUpdate.exit();
        },
        sortedChartData() {
            return this.chartData.sort((a, b) => a.index - b.index);
        }
    },
    watch: {
        show (newVal) {
            if (newVal === true) {
                this.draw()
            }
        }
    },
    methods: {
        draw(newVal, oldVal) {
            if (this.chartData && this.chartData.length > 0 && this.show) {
                this.drawGroups();
                this.drawRects();
                this.drawTexts();
                this.drawNumber(oldVal);
            }
        },
        // 处理g部分
        drawGroups() {
            // 更新 更新部分
            this.boxGroupUpdate = this.svg.selectAll("g").data(this.sortedChartData);
            // enter部分添加g
            this.enterBoxGroups = this.boxGroupEnter.append("g");
            // exit部分删除
            this.boxGroupExit.remove();
        },
        // 处理rect部分
        drawRects() {
            // update部分重新绘制坐标
            this.boxGroupUpdate
                .select("rect")
                .transition(this.transition)
                .attr("x", (d, i) => i * this.step)
                .attr("y", 0)
                .attr("height", this.step)
                .attr("width", this.step);

            // enter部分
            this.enterBoxGroups
                .append("rect")
                .attr("x", (d, i) => i * this.step)
                .attr("y", 0)
                .attr("height", this.step)
                .attr("width", this.step)
                .attr("stroke", "gray")
                .attr(
                    "stroke-width",
                    this.computedLength(this.rectStrokeWidth, ComputedType.width)
                )
                .attr("fill", "white")
                .attr("opacity", 0)
                .transition(this.transition)
                .attr("opacity", 1);
        },
        // 处理text部分
        drawTexts() {
            // update部分
            this.boxGroupUpdate
                .select("text.text")
                .transition(this.transition)
                .attr("x", (d, i) => (i + 0.5) * this.step)
                .attr("y", (d, i) => 0.5 * this.step - 2)

            // enter部分
            this.enterBoxGroups
                .append("text")
                .attr("class", "text")
                .attr("x", (d, i) => (i + 0.5) * this.step)
                .attr("y", (d, i) => 0.5 * this.step - 2)
                .style("text-anchor", "middle")
                .style("dominant-baseline", "initial")
                .attr("font-size", "1")
                .text(d => d.text)
                .attr("opacity", 0)
                .transition(this.transition)
                .attr("opacity", 1)
        },
        // number部分
        drawNumber(oldVal) {
            let vue = this;

            // update部分
            this.boxGroupUpdate
                .select("text.number")
                .transition(this.transition)
                .tween("text", function (d, i) {
                    return vue.numberAnimate(this, oldVal ? oldVal[i].value : 0, d.value);
                })
                .attr("x", (d, i) => (i + 0.5) * this.step)
                .attr("y", (d, i) => 0.5 * this.step + 1)

            // enter部分
            this.enterBoxGroups
                .append("text")
                .attr("class", "number")
                .attr("x", (d, i) => (i + 0.5) * this.step)
                .attr("y", (d, i) => 0.5 * this.step + 1)
                .style("text-anchor", "middle")
                .style("dominant-baseline", "initial")
                .attr("font-size", "2")
                .text(0)
                .transition(this.transition)
                .tween("text", function (d, i) {
                    return vue.numberAnimate(this, 0, d.value);
                });
        },
        // number动画
        numberAnimate(node, oldNumber, newNumber) {
            return function (t) {
                d3
                    .select(node)
                    .text(
                        Math.floor(Number(oldNumber) + t * (Number(newNumber) - Number(oldNumber)))
                    );
            };
        }
    }
};

</script>
<style scoped>
.chart-conatiner {
    min-width: 300px;
    min-height: 50px;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    padding-bottom: 16.67%;
    height: 0;
}
</style>
