
import Vue from 'vue'

const mTaskPlan = resolve => {
    require(['./taskPlan.vue'], resolve)
}

Vue.component('mTaskPlan', mTaskPlan)

