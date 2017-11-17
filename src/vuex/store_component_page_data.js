/**
 * File: d:\product\vue\src\vuex\store_filter.1.js
 * Project: d:\product
 * Created Date: 2017-11-06
 * Author: ZhaoPeng
 * -----
 * 上次修改时间: 2017-11-06
 * Modified By: ZhaoPeng
 * -----
 * 哈哈哈哈隔
 */
import Vue from 'vue'
import Mutations from './Mutation'

export default {
    state: {},
    mutations: {
        /**
         * 设置组件数据
         * @param {*} state 
         * @param {*} payload {id: 组件id, form: 数据区域, data: 组件数据 }
         */
        [Mutations.SET_COMPONENT_DATA] (state, payload) {
            if (payload.form) {
                // 不存在数据区域先添加
                if (!state[payload.form]) {
                    Vue.set(state, payload.form, {})
                } 
                Vue.set(state[payload.form], payload.id, payload.data)
            } else {
                Vue.set(state, payload.id, payload.data)
            }
            // 调用回调
            if (payload.callback) {
                payload.callback()
            }
        },
        [Mutations.CLEAR_COMPONENT_DATA] (state, payload) {
            if (payload.form) {
                delete state[payload.form]
            } else {
                delete state[payload.id]
            }
        }
    }
}
