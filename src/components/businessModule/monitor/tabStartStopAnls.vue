<template lang="html">
  <div class="content">
    <div class="">
      统计分析<i class="fa fa-arrow-right" style="margin: 0 20px;"></i>echarts图表测试
    </div>
    <div id="main"></div>
  </div>
</template>
<script>
/* eslint-disable */

// 导入echarts
import echarts from 'echarts'
// 方便AJAX，按个人喜好添加，然后对应修改下方获取数据的代码
import $ from 'jquery'
// 皮肤引入 import theme-name from theme-folder
export default {
    data() {
            return {
                // 初始化空对象
                chart: null,
                // 初始化图表配置
                opinion: ['比例一', '比例二', '比例三', '比例四', '比例五'],
                opinionData: [{
                    value: 26,
                    name: '比例一'
                }, {
                    value: 31,
                    name: '比例二'
                }, {
                    value: 18,
                    name: '比例三'
                }, {
                    value: 28,
                    name: '比例四'
                }, {
                    value: 21,
                    name: '比例五'
                }]
            }
        },
        methods: {
            // 绘图
            drawGraph(id) {
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id))
                    // 皮肤添加同一般使用方式
                this.chart.showLoading()
                    // 返回到data中
                var that = this
                    // ajax 请求数据
                $.ajax({
                        // 方式
                        type: "GET",
                        // 是否异步
                        async: true,
                        // 路径||API
                        url: "xxx",
                        //返回数据形式为json
                        dataType: "json",
                        // 加载成功
                        success: function(result) {
                            // 更新初始数据
                            that.opinionData = result
                        },
                        // 加载错误
                        error: function(errorMsg) {
                            // alert("请求数据失败!");
                            console.log(errorMsg)
                        }
                    })
                    // set
                this.chart.setOption({
                    title: {
                        text: '测试饼状图',
                        subtext: '子标题',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: this.opinion // 别忘了this
                    },
//                     toolbox: {
//                         show: true,
//                         feature: {
//                             mark: {
//                                 show: true
//                             },
//                             dataView: {
//                                 show: true,
//                                 readOnly: false
//                             },
//                             magicType: {
//                                 show: true,
//                                 type: ['pie']
//                             },
//                             restore: {
//                                 show: true
//                             },
//                             saveAsImage: {
//                                 show: true
//                             }
//                         }
//                     },
                    calculable: true,
                    series: [{
                        name: '种类',
                        type: 'pie',
                        // 内圆半径，外圆半径
                        radius: [30, 100],
                        // 位置，左右，上下
                        center: ['50%', '50%'],
                        roseType: 'area',
                        data: this.opinionData, // 别忘了this


                    }]
                })
                this.chart.hideLoading()
            }
        },
        // keypoint：执行方法
        // “将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。”
        mounted() {
            this.$nextTick(function() {
                this.drawGraph('main')
            })
        }
}
</script>

<style lang="css" scoped>
.content {
  padding: 20px;
}


#main {
  /*需要制定具体高度，以px为单位*/
  height: 400px;
}
</style>
