import Vue from 'vue'
import Vuex from 'vuex'


import pageData from './store_pageData'
import pageStatus from './store_pageStatus'
import componentPageData from './store_component_page_data'
import formData from './store_formData'
import layerData from './store_layerData'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        pageData,
        pageStatus,
        componentPageData,
        formData,
        layerData
    }
})
export default store
