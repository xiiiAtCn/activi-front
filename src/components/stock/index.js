import Vue from 'vue'

const mFilterTable = resolve => {
    require(['./m-filter-table.vue'], resolve)
}

const mActiveStock = resolve => {
    require(['./m-active-stock.vue'], resolve)
}

const mStockView = resolve => {
    require(['./m-stock-view.vue'], resolve)
}

const mStockLayer = resolve => {
    require(['./m-stock-layer.vue'], resolve)
}

Vue.component('mFilterTable', mFilterTable)
Vue.component('mActiveStock', mActiveStock)
Vue.component('mStockLayer', mStockLayer)
Vue.component('mStockView', mStockView)
