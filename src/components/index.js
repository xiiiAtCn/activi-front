import Vue from 'vue'

import './base'
import './boFilterNEW_vuex'
import './taskPlan'

const mBoTemplate = resolve => {
    require(['./m-boTemplate.vue'], resolve)
}


const mBillMeta = resolve => {
    require(['./m-billMeta.vue'], resolve)
}

const mBoMeta = resolve => {
    require(['./m-boMeta.vue'], resolve)
}

const mBottomModal = resolve => {
    require(['./m-bottomModal.vue'], resolve)
}

const mCard = resolve => {
    require(['./m-card.vue'], resolve)
}

const mCoin = resolve => {
    require(['./m-coin.vue'], resolve)
}

const mConfirm = resolve => {
    require(['./m-confirm.vue'], resolve)
}

const mDetailView = resolve => {
    require(['./m-detailView.vue'], resolve)
}

const mEntry = resolve => {
    require(['./m-entry.vue'], resolve)
}

const mFilter = resolve => {
    require(['./m-filter.vue'], resolve)
}

const mFilterRow = resolve => {
    require(['./m-filterRow.vue'], resolve)
}

const mHead = resolve => {
    require(['./m-head.vue'], resolve)
}

const mIndex = resolve => {
    require(['./m-index.vue'], resolve)
}

const mIsBuilding = resolve => {
    require(['./m-isBuilding.vue'], resolve)
}

const mLayoutContentDefault = resolve => {
    require(['./m-layout-content-default.vue'], resolve)
}

const mLayoutContent = resolve => {
    require(['./m-layout-content.vue'], resolve)
}

const mLayout = resolve => {
    require(['./m-layout.vue'], resolve)
}

const mListFilter = resolve => {
    require(['./m-listFilter.vue'], resolve)
}

const mListResult = resolve => {
    require(['./m-listResult.vue'], resolve)
}

const mListTable = resolve => {
    require(['./m-listTable.vue'], resolve)
}

const mListTask = resolve => {
    require(['./m-listTask.vue'], resolve)
}

const mListView = resolve => {
    require(['./m-detailView-shim.js'], resolve)
}

const mMainContent = resolve => {
    require(['./m-main-content.vue'], resolve)
}

const mMain = resolve => {
    require(['./m-main.vue'], resolve)
}

const mMenu = resolve => {
    require(['./m-menu.vue'], resolve)
}

const mModal = resolve => {
    require(['./m-modal.vue'], resolve)
}

const mNavigation = resolve => {
    require(['./m-navigation.vue'], resolve)
}

const mPage = resolve => {
    require(['./m-page.vue'], resolve)
}

const mPriceTable = resolve => {
    require(['./m-priceTable.vue'], resolve)
}

const mSection = resolve => {
    require(['./m-section.vue'], resolve)
}

const mTab = resolve => {
    require(['./m-tab.vue'], resolve)
}

const mTable = resolve => {
    require(['./m-table.vue'], resolve)
}


const mTableF = resolve => {
    require(['./m-table-f.vue'], resolve)
    require(['./m-table-f-shim.js'], resolve)
}

const mTree = resolve => {
    require(['./m-tree.vue'], resolve)
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

Vue.component('mBoTemplate', mBoTemplate)
Vue.component('mBillMeta', mBillMeta)
Vue.component('mBoMeta', mBoMeta)
Vue.component('mBottomModal', mBottomModal)
Vue.component('mCard', mCard)
Vue.component('mCoin', mCoin)
Vue.component('mConfirm', mConfirm)
Vue.component('mDetailView', mDetailView)
Vue.component('mEntry', mEntry)
Vue.component('mFilter', mFilter)
Vue.component('mFilterRow', mFilterRow)
Vue.component('mHead', mHead)
Vue.component('mIndex', mIndex)
Vue.component('mIsBuilding', mIsBuilding)
Vue.component('mLayoutContentDefault', mLayoutContentDefault)
Vue.component('mLayoutContent', mLayoutContent)
Vue.component('mLayout', mLayout)
Vue.component('mListFilter', mListFilter)
Vue.component('mListResult', mListResult)
Vue.component('mListTable', mListTable)
Vue.component('mListTask', mListTask)
Vue.component('mListView', mListView)
Vue.component('mMainContent', mMainContent)
Vue.component('mMain', mMain)
Vue.component('mMenu', mMenu)
Vue.component('mModal', mModal)
Vue.component('mNavigation', mNavigation)
Vue.component('mPage', mPage)
Vue.component('mPriceTable', mPriceTable)
Vue.component('mSection', mSection)
Vue.component('mTab', mTab)
Vue.component('mTable', mTable)
Vue.component('mTableF', mTableF)
Vue.component('mTree', mTree)
Vue.component('mLayer', mLayer)
Vue.component('tableFShim', tableFShim)
Vue.component('mTabs', mTabs)
Vue.component('mUrlSection', mUrlSection)
