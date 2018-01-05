import Vue from 'vue'

const barLineComposeChart = resolve => {
    require(['./barLineComposeChart.vue'], resolve)
}

const chartContainer = resolve => {
    require(['./chartContainer.vue'], resolve)
}

Vue.component('barLineComposeChart', barLineComposeChart)
Vue.component('chartContainer', chartContainer)
