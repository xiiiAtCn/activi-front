import Vue from 'vue'
import Vuex from 'vuex'

import pageData from './store_pageData'
import pageStatus from './store_pageStatus'
import validStatus from './store_pageValid'
import componentPageData from './store_component_page_data'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        pageData,
        pageStatus,
        validStatus,
        componentPageData
    }
})
export default store
