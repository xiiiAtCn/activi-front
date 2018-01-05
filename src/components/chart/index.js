import Vue from 'vue'

const barLineComposeChart = resolve => {
    require(['./barLineComposeChart.vue'], resolve)
}

Vue.component('barLineComposeChart', barLineComposeChart)