/**
 * Created by sunb on 17-7-5.
 */
import { default as fetch } from '../utils/DefineFetcher'
// import _ from 'lodash'

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
        // updateField(state, newData){
        //     if (state.data.fields[newData.name]) {
        //         state.data.fields[newData.name] = newData.value;
        //     } else {
        //         let temp = {};
        //         temp[newData.name] = newData.value;
        //         state.data.fields = Object.assign({}, state.data.fields, temp);
        //     }
        // },
        // updateTable(state, newData){
        //     if (state.data.tables[newData.name]) {
        //         state.data.tables[newData.name] = newData.value;
        //     } else {
        //         let temp = {};
        //         temp[newData.name] = newData.value;
        //         state.data.tables = Object.assign({}, state.data.tables, temp);
        //     }
        // },
    },
    actions: {
        /* 根据url请求数据 */
        putData: function ({ commit }, args) {
            var url = args.url
            if (url) {
                fetch(url, function (error, body) {
                    if (error === null) {
                        commit('changeData', body)
                    }
                })
            }
            // debugger
            // Vue.http.get(args.url).then(function (result) {
            //     commit('changeData', result.body);
            // }, function (response) {
            //     alert(response.status);
            //     alert(response.statusText);
            // });
        },
        /* 清除data数据 */
        clearData: function ({ commit }, args) {
            commit('changeData', {})
        }
    },
    getters: {}
}

