
import Vue from 'vue'

const mTaskPlan = resolve => {
    require(['./taskPlan.vue'], resolve)
}

const mBoTree = resolve => {
    require(['./m-boTree.vue'], resolve)
}

Vue.component('mTaskPlan', mTaskPlan)
Vue.component('mBoTree', mBoTree)
