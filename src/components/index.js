import Vue from 'vue'

import './base'
import './boFilterNEW_vuex'
import './tokenConfig'
import './stock'

const mCard = resolve => {
    require(['./m-card.vue'], resolve)
}

const mHead = resolve => {
    require(['./m-head.vue'], resolve)
}

const mLayoutContentDefault = resolve => {
    require(['./m-layout-content-default.vue'], resolve)
}

const mLayoutContent = resolve => {
    require(['./m-layout-content.vue'], resolve)
}

const mMain = resolve => {
    require(['./m-main.vue'], resolve)
}

const mMenu = resolve => {
    require(['./m-menu.vue'], resolve)
}

const mPage = resolve => {
    require(['./m-page.vue'], resolve)
}

const mSection = resolve => {
    require(['./m-section.vue'], resolve)
}

const mTable = resolve => {
    require(['./m-table.vue'], resolve)
}

const mTableF = resolve => {
    require(['./m-table-f.vue'], resolve)
}

const mLayer = resolve => {
    require(['./m-zpSlideLayer'], resolve)
}

const tableFShim = resolve => {
    require(['./m-table-f-shim'], resolve)
}

const mTabs = resolve => {
    require(['./m-tabs.vue'], resolve)
}

const mUrlSection = resolve => {
    require(['./m-url-section.vue'], resolve)
}

const mCardTable = resolve => {
    require(['./m-card-table.vue'], resolve)
}

const mChoreographContent = resolve => {
    require(['./m-choreograph-content.vue'], resolve)
}

const mShowMap = resolve => {
    require(['./m-show-map.vue'], resolve)
}

const nPage = resolve => {
    require(['./n-main.vue'], resolve)
}

Vue.component('mCard', mCard)
Vue.component('mHead', mHead)
Vue.component('mLayoutContentDefault', mLayoutContentDefault)
Vue.component('mLayoutContent', mLayoutContent)
Vue.component('mMain', mMain)
Vue.component('mMenu', mMenu)
Vue.component('mPage', mPage)
Vue.component('mSection', mSection)
Vue.component('mTable', mTable)
Vue.component('mTableF', mTableF)
Vue.component('mLayer',  mLayer)
Vue.component('tableFShim', tableFShim)
Vue.component('mTabs', mTabs)
Vue.component('mUrlSection', mUrlSection)
Vue.component('mCardTable', mCardTable)
Vue.component('mChoreographContent', mChoreographContent)
Vue.component('mShowMap', mShowMap)

Vue.component('nPage', nPage)
