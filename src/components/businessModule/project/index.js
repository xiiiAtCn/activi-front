import Vue from 'vue'

const mProjectDetails = resolve => {
    require(['./m-projectDetails.vue'], resolve)
}

const mProjectOut = resolve => {
    require(['./m-projectOut.vue'], resolve)
}

const mProjectPerson = resolve => {
    require(['./m-projectPerson.vue'], resolve)
}

const mProjectSummary = resolve => {
    require(['./m-projectSummary.vue'], resolve)
}

const mTaskSteps = resolve => {
    require(['./m-taskSteps.vue'], resolve)
}

const mNewProject = resolve => {
    require(['./m-newProject.vue'], resolve)
}

Vue.component('mProjectDetails', mProjectDetails)
Vue.component('mProjectOut', mProjectOut)
Vue.component('mProjectPerson', mProjectPerson)
Vue.component('mProjectSummary', mProjectSummary)
Vue.component('mTaskSteps', mTaskSteps)
Vue.component('mNewProject', mNewProject)