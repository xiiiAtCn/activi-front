<template lang="html">
  <div class="content">
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

var dataTest = [];
var now = +new Date();
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;
for (var i = 0; i < 10; i++) {
    dataTest.push(randomData());
}

export default {
    data() {
            return {
                // 初始化空对象
                chart: null,
                // 初始化图表配置
//                 opinion: ['比例一', '比例二', '比例三', '比例四', '比例五'],
//                 opinionData: [{
//                     value: 26,
//                     name: '比例一'
//                 }, {
//                     value: 31,
//                     name: '比例二'
//                 }, {
//                     value: 18,
//                     name: '比例三'
//                 }, {
//                     value: 28,
//                     name: '比例四'
//                 }, {
//                     value: 21,
//                     name: '比例五'
//                 }]
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
                            text: '实时曲线-示意图'
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter: function (params) {
                                params = params[0];
                                var date = new Date(params.name);
                                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                            },
                            axisPointer: {
                                animation: false
                            }
                        },
                        xAxis: {
                            type: 'time',
                            splitLine: {
                                show: false
                            }
                        },
                        yAxis: {
                            type: 'value',
                            boundaryGap: [0, '100%'],
                            splitLine: {
                                show: false
                            }
                        },
                        series: [{
                            name: '模拟数据',
                            type: 'line',
                            showSymbol: false,
                            hoverAnimation: false,
                            data: dataTest
                        }]
                })
                this.chart.hideLoading();
                let _chart = this.chart;
                setInterval(function () {

                  for (var i = 0; i < 1; i++) {
                    dataTest.shift();
                    dataTest.push(randomData());
                  }

                  _chart.setOption({
                    series: [{
                      data: dataTest
                    }]
                  });
                }, 1000);
            }
        },
        // keypoint：执行方法
        // “将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。”
        mounted() {
            this.$nextTick(function() {
                this.drawGraph('main')
            });
        }
}
function randomData() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
        name: now.toString(),
        value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round(value)
        ]
    }
}

</script>

<style lang="css">
.content {
  padding: 20px;
}


#main {
  /*需要制定具体高度，以px为单位*/
  height: 400px;
}
</style>
