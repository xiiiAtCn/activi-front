import Vue from 'vue'

const mBarrier = resolve =>
    require(['./m-barrier.vue'], resolve)
const mDate = resolve =>
    require(['./m-date'], resolve)

const formulaCollection = resolve =>
    require(['./m-calculator.vue'], resolve)

const mDecimal = resolve =>
    require(['./m-decimal.vue'], resolve)

const mDetailChoose = resolve =>
    require(['./m-detail-choose.vue'], resolve)

const mDetailTable = resolve =>
    require(['./m-detailTable.vue'], resolve)

const mFileUpload = resolve =>
    require(['./m-fileUpload.vue'], resolve)

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

const mPicUpload = resolve =>
    require(['./m-picUpload.vue'], resolve)

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

const mInputPercent = resolve =>
    require(['./m-input-percent.vue'], resolve)

const mAddress = resolve =>
    require(['./m-address.vue'], resolve)

const mInputChoose = resolve =>
    require(['./m-input-choose.vue'], resolve)

const mDisplay = resolve =>
    require(['./m-display.vue'], resolve)

const mButtonLayer = resolve =>
    require(['./m-button-layer.vue'], resolve)

const mSpan = resolve =>
    require(['./m-span.vue'], resolve)

const mButtonIframe = resolve =>
    require(['./m-button-show.vue'], resolve)

const mBoolean = resolve =>
    require(['./m-boolean.vue'], resolve)

const mIconList = resolve =>
    require(['./m-icon-list.vue'], resolve)

const mArea = resolve =>
    require(['./m-area.vue'], resolve)

const mLayerAmap = resolve =>
    require(['./m-layer-amap.vue'], resolve)

const mCode = resolve =>
    require(['./m-code.vue'], resolve)

const nForm = resolve =>
    require(['./n-form.vue'], resolve)

const nInput = resolve =>
    require(['./n-input.vue'], resolve)
const nText = resolve =>
    require(['./n-text.vue'], resolve)
const nSelect = resolve =>
    require(['./n-select.vue'], resolve)

const nList = resolve =>
    require(['./n-list.vue'], resolve)

const nResource = resolve =>
    require(['./n-resource.vue'], resolve)

Vue.component('mBarrier', mBarrier)
Vue.component('mFormulaCollection', formulaCollection)
Vue.component('mDate', mDate)
Vue.component('mDecimal', mDecimal)
Vue.component('mDetailChoose', mDetailChoose)
Vue.component('mFileUpload', mFileUpload)
Vue.component('mDetailTable', mDetailTable)
Vue.component('mInput', mInput)
Vue.component('mLabel', mLabel)
Vue.component('mLabelInput', mLabelInput)
Vue.component('mLoading', mLoading)
Vue.component('mMultiCheck', mMultiCheck)
Vue.component('mInteger', mNumber)
Vue.component('mPicUpload', mPicUpload)
Vue.component('mRow', mRow)
Vue.component('mSelect', mSelect)
Vue.component('mSingleCheck', mSingleCheck)
Vue.component('mSteps', mSteps)
Vue.component('mTab', mTab)
Vue.component('mInputPercent', mInputPercent)
Vue.component('mAddress', mAddress)
Vue.component('mInputChoose', mInputChoose)
Vue.component('mDisplay', mDisplay)
Vue.component('mButtonLayer', mButtonLayer)
Vue.component('mSpan', mSpan)
Vue.component('mButtonIframe', mButtonIframe)
Vue.component('mBoolean', mBoolean)
Vue.component('mIconList', mIconList)
Vue.component('mAddress', mArea)
Vue.component('mLayerAmap', mLayerAmap)
Vue.component('mCode', mCode)
// 新的
Vue.component('nForm', nForm)
Vue.component('nInput', nInput)
Vue.component('nText', nText)
Vue.component('nSelect', nSelect)
Vue.component('nList', nList)
Vue.component('nResource', nResource)