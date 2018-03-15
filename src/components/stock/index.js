import Vue from 'vue'

const mFilterTable = resolve => {
    require(['./m-filter-table.vue'], resolve)
}

const mActiveStock = resolve => {
    require(['./m-active-stock.vue'], resolve)
}

Vue.component('mFilterTable', mFilterTable)
Vue.component('mActiveStock', mActiveStock)
