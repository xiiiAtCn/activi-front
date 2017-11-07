import Vue from 'vue'

let mAttribute = resolve => {
    require(['./m-attribute.vue'], resolve)
}
let mBo = resolve => {
    require(['./m-bo.vue'], resolve)
}
let mBoolean = resolve => {
    require(['./m-boolean.vue'], resolve)
}
let mDate = resolve => {
    require(['./m-date.vue'], resolve)
}
let mFileUpload = resolve => {
    require(['./m-fileUpload.vue'], resolve)
}
let mForm = resolve => {
    require(['./m-form.vue'], resolve)
}
let mInput = resolve => {
    require(['./m-input.vue'], resolve)
}
let mLabel = resolve => {
    require(['./m-label.vue'], resolve)
}
let mLabelInput = resolve => {
    require(['./m-labelInput.vue'], resolve)
}
let mLoading = resolve => {
    require(['./m-loading.vue'], resolve)
}
let mMail = resolve => {
    require(['./m-mail.vue'], resolve)
}
let mNumber = resolve => {
    require(['./m-number.vue'], resolve)
}
let mPicUpload = resolve => {
    require(['./m-picUpload.vue'], resolve)
}
let mRadio = resolve => {
    require(['./m-radio.vue'], resolve)
}
let mRow = resolve => {
    require(['./m-row.vue'], resolve)
}
let mSelect = resolve => {
    require(['./m-select.vue'], resolve)
}
let mSteps = resolve => {
    require(['./m-steps.vue'], resolve)
}
let mSwitch = resolve => {
    require(['./m-switch.vue'], resolve)
}

let mTime = resolve => {
    require(['./m-time.vue'], resolve)
}

Vue.component('mAttribute', mAttribute)
Vue.component('mBo', mBo)
Vue.component('mBoolean', mBoolean)
Vue.component('mDate', mDate)
Vue.component('mFileUpload', mFileUpload)
Vue.component('mForm', mForm)
Vue.component('mInput', mInput)
Vue.component('mLabel', mLabel)
Vue.component('mLabelInput', mLabelInput)
Vue.component('mLoading', mLoading)
Vue.component('mMail', mMail)
Vue.component('mNumber', mNumber)
Vue.component('mPicUpload', mPicUpload)
Vue.component('mRadio', mRadio)
Vue.component('mRow', mRow)
Vue.component('mSelect', mSelect)
Vue.component('mSteps', mSteps)
Vue.component('mSwitch', mSwitch)
Vue.component('mTime', mTime)
