import Vue from 'vue'

const configTable = resolve => {
    require(['./configTable.vue'], resolve)
}
const tableItem = resolve => {
    require(['./tableItem.vue'], resolve)
}

Vue.component('configTable', configTable)
Vue.component('tableItem', tableItem)