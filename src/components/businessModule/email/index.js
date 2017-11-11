import Vue from 'vue'

const CheckEmail = resolve => {
    require(['./checkEmail.vue'], resolve)
}

const EmailDetail = resolve => {
    require(['./emailDetail.vue'], resolve)
}

const EmailDirectory = resolve => {
    require(['./emailDirectory.vue'], resolve)
}

const mEmail = resolve => {
    require(['./m-email.vue'], resolve)
}

const WriteEmail = resolve => {
    require(['./writeEmail.vue'], resolve)
}

Vue.component('mCheckEmail', CheckEmail)
Vue.component('mEmailDetail', EmailDetail)
Vue.component('mEmailDirectory', EmailDirectory)
Vue.component('mEmail', mEmail)
Vue.component('mWriteEmail', WriteEmail)
