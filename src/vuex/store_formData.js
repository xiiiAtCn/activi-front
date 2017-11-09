import Mutations from './Mutation'
import { FETCH_TABLE_DATA, ELEMENT_VALIDATE_RESULT, COUNT_CHECK_RESULT, SUBMIT_FORM_DATA } from './Action'
import Request from 'utils/request-addon'
import Vue from 'vue'

let request = new Request()

export default {
    state: {
        table: [],
        checkCount: 8
    },
    mutations: {

        [Mutations.ADD_NEW_OBJECT] (state, payload) {
            Vue.set(state, payload.attribute, payload.value)
        },

        [Mutations.FORM_ELEMENT_VALUE] (state, payload) {
            let {form, ...rest} = payload
            debugger
            state[form] = {
                ...state[form],
                ...rest
            }
        },
        [Mutations.CLEAR_FORM_DATA] (state, payload) {
            let { form } = payload
            state[form + 'checkResult'] = {}
            form = state[form]
            for (let i in form) {
                let item = form[i]
                if (typeof item === 'boolean') {
                    form[i] = false
                } else if (typeof item === 'object') {
                    form[i] = {}
                }
            }
            form['reset'] = true
        },

        [Mutations.SET_TABLE_DATA] (state, data) {
            state.table = data
        },
        [Mutations.OPEN_TABLE_LAYER] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                visible: true,
                reset: false
            }
        },
        [Mutations.CLOSE_TABLE_LAYER] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                visible: false,
                reset: true,
                loading: true
            }
        },
        [Mutations.BUTTON_START_LOADING] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                loading: true
            }
        },
        [Mutations.BUTTON_CANCEL_LOADING] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                loading: false
            }
        },
        [Mutations.FORM_DATA_VALIDATE] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                validate: true
            }
        },
        [Mutations.CLOSE_DATA_VALIDATE] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                validate: false
            }
        },
        [Mutations.ELEMENT_VALIDATE_RESULT] (state, payload) {
            let {form, ...rest} = payload
            state[form + 'checkResult'] = {
                ...state[form + 'checkResult'],
                ...rest
            }
        },
        [Mutations.DESTROY_FORM_DATA] (state, payload) {
            let { form } = payload
            delete state[form]
            delete state[form + 'checkResult']
        }
    },
    actions: {
        [FETCH_TABLE_DATA] ({commit}, data) {
            request.setUrl(data.url).forPost((result, err) => {
                if (err) {
                    commit(Mutations.SET_TABLE_DATA, [])
                    return
                }
                commit(Mutations.SET_TABLE_DATA, result)
            })
        },
        [COUNT_CHECK_RESULT] ({commit, state}, payload) {
            let {form, count} = payload
            if (state.checkCount === count) {
                let checkResult = state[form + 'checkResult']
                let flag = Object.keys(checkResult).every(element => checkResult[element] === false)
                commit(Mutations.CLOSE_DATA_VALIDATE, {form: form})
                if (flag) {
                    // 数据提交逻辑
                    commit(Mutations.CLEAR_FORM_DATA, {form: form})
                    commit(Mutations.BUTTON_START_LOADING, {form: form})
                } else {
                    commit(Mutations.BUTTON_CANCEL_LOADING, {form: form})
                    setTimeout(() => {
                        commit(Mutations.BUTTON_START_LOADING, {form: form})
                    }, 0)
                }
            }
        },

        [SUBMIT_FORM_DATA] ({commit}, payload) {
            commit(Mutations.FORM_DATA_VALIDATE, payload)
        },
        [ELEMENT_VALIDATE_RESULT] ({state, dispatch}, payload) {
            let {form, ...rest} = payload
            state[form + 'checkResult'] = {
                ...state[form + 'checkResult'],
                ...rest
            }
            if (state[form]['validate'] === true) {
                dispatch(COUNT_CHECK_RESULT, {form, count: Object.keys(state[form + 'checkResult']).length})
            }
        }
    }
}
