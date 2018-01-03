// The Vue build version to load with the `import` command
import "babel-polyfill"
import mPage from './components/m-page.vue'
import './assets/css/base.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Vue from 'vue'
import './components'
import router from './router/index'
import Request from 'utils/request-addon'
import store from './vuex/store'

for (let i of Reflect.ownKeys(Request.prototype)) {
    if (i === 'constructor') { continue }
    Vue.prototype[i] = Request.prototype[i]
}
Vue.use(iView)
const app = new Vue({
    el: '#app',
    router,
    store,
    data: function () {
        return { username: 'demo用户' }
    },
    components: { mPage }
}).$mount('#app')

app.$Message.config({
    top: 120,
    duration: 3
})
