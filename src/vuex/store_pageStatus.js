/**
 * Created by sunb on 17-7-5.
 */
import { default as fetch } from '../utils/DefineFetcher'
import { getData } from '../utils/actionUtils'
import { CLEAR_FORM_STATUS } from './Mutation'
import Mutations from "./Mutation";
// 放画面初始状态的
export default {
    state: {
        status: {}
    },
    mutations: {
        /* 更新状态 */
        [Mutations.CHANGE_PAGE_STATUS](state, data) {
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
                    commit(Mutations.CHANGE_PAGE_STATUS, result.status)
                }
            })
        }

    }
}
