/**
 * Created by sunb on 17-7-5.
 */
import { default as fetch } from '../utils/DefineFetcher'
import { getData } from '../utils/actionUtils'
import { CLEAR_FORM_STATUS } from './Mutation'
// 放画面初始状态的
export default {
    state: {
        status: {}
    },
    mutations: {
        /* 更新状态 */
        changeStauts(state, data) {
            state.status = data
        },
        [CLEAR_FORM_STATUS](state) {
            state.status = {}
        }
    },
    actions: {
        /* 获取页面组件状态 */
        putStatus: function ({ commit }, action) {
            getData(action, (result, err) => {
                if (err === null) {
                    commit('changeStauts', result.status)
                }
            })
        }

    }
}
