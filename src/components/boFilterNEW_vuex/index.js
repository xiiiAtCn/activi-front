/**
 * File: d:\product\vue\src\components\boFilter\index.js
 * Project: d:\product
 * Created Date: 2017-10-24
 * Author: zhao peng
 * -----
 * 上次修改时间: 2017-10-24
 * Modified By: 
 * -----
 */
import Vue from 'vue'

const mBoFilterPage = resolve => {
    require(['./m-boFilterPage.vue'], resolve)
}
const mBoFilter = resolve => {
    require(['./m-boFilter.vue'], resolve)
}
const mNavSelect = resolve => {
    require(['./m-navSelect.vue'], resolve)
}
const mFilterBasic = resolve => {
    require(['./m-filterBasic.vue'], resolve)
} 

Vue.component('mBoFilterPage', mBoFilterPage)
Vue.component('mBoFilter', mBoFilter)
Vue.component('mNavSelect', mNavSelect)
Vue.component('mFilterBasic', mFilterBasic)

