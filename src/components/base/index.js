import Vue from 'vue'

const mDate = resolve =>
    require(['./m-date'], resolve)

const mDetailChoose = resolve =>
    require(['./m-detail-choose.vue'], resolve)

const mDetailTable = resolve =>
    require(['./m-detailTable.vue'], resolve)
const mInput = resolve =>
    require(['./m-input.vue'], resolve)

const mLabel = resolve =>
    require(['./m-label.vue'], resolve)

const mLabelInput = resolve =>
    require(['./m-labelInput.vue'], resolve)

const mLoading = resolve =>
    require(['./m-loading.vue'], resolve)

const mMultiCheck = resolve =>
    require(['./m-multiCheck.vue'], resolve)

const mNumber = resolve =>
    require(['./m-number.vue'], resolve)

const mRow = resolve =>
    require(['./m-row.vue'], resolve)

const mSelect = resolve =>
    require(['./m-select.vue'], resolve)

const mSingleCheck = resolve =>
    require(['./m-singleCheck.vue'], resolve)

const mSteps = resolve =>
    require(['./m-steps.vue'], resolve)

const mTab = resolve =>
    require(['./m-tab.vue'], resolve)

Vue.component('mDate', mDate)
Vue.component('mDetailChoose', mDetailChoose)
Vue.component('mDetailTable', mDetailTable)
Vue.component('mInput', mInput)
Vue.component('mLabel', mLabel)
Vue.component('mLabelInput', mLabelInput)
Vue.component('mLoading', mLoading)
Vue.component('mMultiCheck', mMultiCheck)
Vue.component('mNumber', mNumber)
Vue.component('mRow', mRow)
Vue.component('mSelect', mSelect)
Vue.component('mSingleCheck', mSingleCheck)
Vue.component('mSteps', mSteps)
Vue.component('mTab', mTab)
