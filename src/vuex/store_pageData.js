/**
 * Created by sunb on 17-7-5.
 */

import { getData } from 'utils/actionUtils'
// 放画面数据的
export default {
    state: {
        data: {}
    },
    mutations: {
        /* 更新data */
        changeData(state, data) {
            state.data = data
        },
        updateItem(state, newData) {
            if (state.data[newData.name]) {
                state.data[newData.name] = newData
            } else {
                let temp = {}
                temp[newData.name] = newData
                state.data = Object.assign({}, state.data, temp)
            }
        }
    },
    actions: {
        /* 根据url请求数据 */
        putData: function ({ commit }, args) {
            var url = args.url
            getData(url,  body => {
                
            })
        },
        /* 清除data数据 */
        clearData: function ({ commit }, args) {
            commit('changeData', {})
        }
    },
    getters: {}
}

