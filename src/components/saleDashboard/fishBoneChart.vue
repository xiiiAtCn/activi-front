<template>
    <div class="chart-conatiner">
        <svg/>
    </div>
</template>
<script>
import * as d3 from "d3"
import { mixin, ComputedType } from "./mixin"

let testData = {
    title: '产品质量低下',
    spines: [
        {
            title: '人',
            spines: [
                {
                    title: '新人培训',
                    spines: []
                },
                {
                    title: '产品意识淡薄',
                    spines: []
                },
                {
                    title: '技术水平差',
                    spines: [
                        {
                            title: '培训次数少',
                            spines: []
                        }
                    ]
                },
            ]
        },
        {
            title: '环',
            spines: [
                {
                    title: '场所温度高',
                    spines: []
                }
            ]
        }
    ]
}
 
export default {
    mixins: [mixin],
    props: {
        chartData: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    data() {
        return {
            width: 100,
            height: 70,
            spinesDistance: '10px',
            mainSpines: null
        } 
    },
    computed: {
        mainSpinesPoint () {
            return [
                {
                    x: this.percentPaddingLeft,
                    y: (this.height - this.percentPaddingTop - this.percentPaddingBottom) / 2
                },
                {
                    x: this.width - this.percentPaddingRight,
                    y: (this.height - this.percentPaddingTop - this.percentPaddingBottom) / 2
                }
            ]
        },
        line() {
            return d3.line()
                .x(d => d.x)
                .y(d => d.y)
        }
    },
    mounted () {
        // 绘制主刺
        this.mainSpines = this.svg.append('g')
            .attr('class', 'fish')
            .append('path')
            .datum(this.mainSpinesPoint)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", this.computedLength('10px', ComputedType.height))
            .attr("d", this.line)

        // 添加按钮
        this.svg.append('g')
            .attr('class', 'button')
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.computedLength('50px', ComputedType.width)) 
            .attr('height', this.computedLength('30px', ComputedType.height)) 
            .attr('fill', 'steelblue')
            .on('click', this.addSpines)
            .text('添加')
    },
    methods: {
        // 添加刺没有parent则为主刺
        addSpines (parent) {
            if (!parent) {
                parent = this.mainSpines
            }
            
        }
    }
}
</script>
<style scoped>
.chart-conatiner {
    min-width: 300px;
    min-height: 210px;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    padding-bottom: 70%;
    height: 0;
}
</style>