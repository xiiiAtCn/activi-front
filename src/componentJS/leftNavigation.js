/**
 * Created by 高鹏程 on 2017/5/9.
 */
import Vue from 'vue'
import mMenu from '../components/m-menu.vue'
import router from '../router'

new Vue({
    el: '#nav',
    router,
    render: h => h(mMenu)
}).$mount('#app')
