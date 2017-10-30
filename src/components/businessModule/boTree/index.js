import Vue from 'vue'

const BoTree = resolve => {
  require(['./boTree.vue'], resolve)
}

const BoTreeDetail = resolve => {
  require(['./boTreeDetail.vue'], resolve)
}

const FileTree = resolve => {
  require(['./fileTree.vue'], resolve)
}

const FileTreeDetail = resolve => {
  require(['./fileTreeDetail.vue'], resolve)
}

const BoTreeView = resolve => {
    require(['./boTreeView.vue'], resolve)
}

Vue.component('BoTree', BoTree)
Vue.component('BoTreeDetail', BoTreeDetail)
Vue.component('FileTree', FileTree)
Vue.component('FileTreeDetail', FileTreeDetail)
Vue.component('BoTreeView', BoTreeView)
