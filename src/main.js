// The Vue build version to load with the `import` command
import mPage from './components/m-page.vue'
import './assets/css/base.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Vue from 'vue'
import router from './router'

Vue.use(iView)
// Vue.config.silent = false;

import vueResource from 'vue-resource'

Vue.use(vueResource)
/* eslint-disable no-new */
// new Vue({
//  el: '#app',
//  router,
//  template: '<App/>',
//  components: { App }
// })
const app = new Vue({
  el: '#app',
  router,
  data: function () {
    return {username: 'demo用户'}
  },
  components: {mPage}
}).$mount('#app')

app.$Message.config({
  top: 120,
  duration: 3
})
