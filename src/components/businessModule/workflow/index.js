import Vue from 'vue'

const workflow = resolve => {
    require(['./workflow.vue'], resolve)
}

const workflowDetails = resolve => {
    require(['./workflowDetails.vue'], resolve)
}

const workflowCheck = resolve => {
    require(['./workflowCheck.vue'], resolve)
}

Vue.component('mWorkflow', workflow)
Vue.component('mWorkflowDetails', workflowDetails)
Vue.component('mWorkflowCheck', workflowCheck)