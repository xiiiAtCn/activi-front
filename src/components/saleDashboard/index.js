import Vue from 'vue'

const numberBox = resolve => {
    require(['./numberBox.vue'], resolve)
}

// 柱状图 折线图
const barLineChart = resolve => {
    require(['./barLineChart.vue'], resolve)
}

// 漏斗图
const funnelChart = resolve => {
    require(['./funnelChart.vue'], resolve)
}

const saleDashboard = resolve => {
    require(['./m-saleDashboard.vue'], resolve)
}

Vue.component('barLineChart', barLineChart)
Vue.component('funnelChart', funnelChart)
Vue.component('saleDashboard', saleDashboard)
Vue.component('numberBox', numberBox)

