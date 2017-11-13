/**
 * File: d:\product\vue\src\vuex\store_filter.1.js
 * Project: d:\product
 * Created Date: 2017-11-06
 * Author: ZhaoPeng
 * -----
 * 上次修改时间: 2017-11-06
 * Modified By:
 * -----
 * 哈哈哈哈隔
 */
import Vue from 'vue'
import Mutations from './Mutation'

export default {
    state: {},
    mutations: {
        [Mutations.SET_COMPONENT_DATA] (state, payload) {
            Vue.set(state, payload.id, payload.data)
            if (payload.callback) {
                payload.callback()
            }
        },
        [Mutations.CLEAR_COMPONENT_DATA] (state, payload) {
            delete state[payload.id]
        }
    }
}
