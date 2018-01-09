import Vue from 'vue'

const barLineComposeChart = resolve => {
    require(['./barLineComposeChart.vue'], resolve)
}

const chartContainer = resolve => {
    require(['./chartContainer.vue'], resolve)
}

const composedChartWithSearch = resolve => {
    require(['./chartWithSearch.vue'], resolve)
}

Vue.component('barLineComposeChart', barLineComposeChart)
Vue.component('chartContainer', chartContainer)
Vue.component('composedChartWithSearch', composedChartWithSearch)
