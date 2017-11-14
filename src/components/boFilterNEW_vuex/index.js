/**
 * File: d:\productNEW\vue_v2\src\components\boFilterNEW_vuex\index.js
 * Project: d:\productNEW\vue_v2
 * Created Date: 2017-11-14
 * Author: ZhaoPeng
 * -----
 * 上次修改时间: 2017-11-14
 * Modified By: ZhaoPeng
 * -----
 * 哈哈哈哈隔
 */
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

const mFilterPage = resolve => {
    require(['./m-FilterPage.vue'], resolve)
}
const mFilter = resolve => {
    require(['./m-Filter.vue'], resolve)
}
const mNavSelect = resolve => {
    require(['./m-navSelect.vue'], resolve)
}
const mFilterBasic = resolve => {
    require(['./m-filterBasic.vue'], resolve)
}

Vue.component('mFilterPage', mFilterPage)
Vue.component('mBoFilter', mFilter)
Vue.component('mNavSelect', mNavSelect)
Vue.component('mFilterBasic', mFilterBasic)

