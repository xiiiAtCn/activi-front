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
import VueAMap from 'vue-amap'

Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
    key: '8bda06f2951a19b7d012692eb1855019',
    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType','AMap.PlaceSearch','AMap.Geocoder'],
    uiVersion: '1.0',
    v: '1.4.4'
});

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
