import Mutations from './Mutation'
import Actions from './Action'
import Request from 'utils/request-addon'
import Vue from 'vue'
import { getData, dispatch } from 'utils/actionUtils'
import iView from 'iview'
import _ from 'lodash'
let request = new Request()

export default {
    state: {
    },
    mutations: {

        [Mutations.ADD_NEW_OBJECT] (state, payload) {
            Vue.set(state, payload.attribute, payload.value)
        },

        [Mutations.FORM_ELEMENT_VALUE] (state, payload) {
            let {form, ...rest} = payload
            state[form] = {
                ...state[form],
                ...rest
            }
        },

        [Mutations.INCREMENT_CHECK_COUNT](state, payload) {
            let {form} = payload
            if(state[form]['checkedCount'] === undefined) 
                state[form]['checkedCount'] = 1
            else 
                state[form]['checkedCount']++ 
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
            form['checkedCount'] = 0
        },

        [Mutations.SET_TABLE_DATA] (state, data) {
            state.table = data
        },
        [Mutations.OPEN_TABLE_LAYER] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                visible: true,
                reset: false,
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
            let { form} = payload
            state[form] = {
                ...state[form],
                validate: true,
                checkedCount: 0,
            }

            if(payload.requestUrl !== undefined) {
                state[form] = {
                    ...state[form],
                    [form + 'requestUrl']: payload.requestUrl,
                    checkCount: 3
                }
            }

            if(payload.action !== undefined) {
                state[form] = {
                    ...state[form],
                    action: payload.action
                }
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
            let keys = Object.keys(state)
            let { form } = payload
            keys.forEach(element => {
                if(element.startsWith(form)) {
                    delete state[element]
                }
            })
        }
    },
    actions: {
        [Actions.FETCH_TABLE_DATA] ({commit}, data) {
            request.setUrl(data.url).forPost((result, err) => {
                if (err) {
                    commit(Mutations.SET_TABLE_DATA, [])
                    return
                }
                commit(Mutations.SET_TABLE_DATA, result)
            })
        },
        [Actions.COUNT_CHECK_RESULT] ({commit, state}, payload) {
            let {form} = payload
            debugger
            if (state[form]['checkCount'] === state[form]['checkedCount']) {
                let checkResult = state[form + 'checkResult']
                let flag = Object.keys(checkResult).every(element => checkResult[element] === false)
                commit(Mutations.CLOSE_DATA_VALIDATE, {form: form})
                if (flag) {
                    // 数据提交逻辑
                    iView.Modal.confirm({
                        title: '确认',
                        content: '确定提交',
                        onOk:() => {
                            let copies = _.cloneDeep(state[form])
                            let keyList = Object.keys(copies)
                            keyList.forEach(element => {
                                if(typeof copies[element] !== 'object') {
                                    delete copies[element]
                                }
                            })
                            debugger
                            if(state[form][ form + 'requestUrl'] !== undefined) {
                                request.setUrl(state[form][form+ 'requestUrl']).setBody(copies).forPost((data, err) => {
                                    if(err) {
                                        console.log(err)
                                        iView.Message.error('服务器出错了!')
                                        return
                                    }
                                    dispatch(data)
                                })
                            }
                            if(state[form]['action'] !== undefined) {
                                let action = state[form]['action']
                                delete state[form]['action']
                                let array = state['form'][action['value']]['value']
                                if(array === undefined) {
                                    array = (state['form'][action['value']] = [])
                                }
                                array = array.slice()
                                let formCopy = _.cloneDeep(state[form])
                                let keyList = Object.keys(formCopy)
                                keyList.forEach(element => {
                                    if(typeof formCopy[element] !== 'object') {
                                        delete formCopy[element]
                                    }
                                })
                                if(action.type === 'add') {
                                    array.push(formCopy)
                                } else if(action.type === 'edit') {
                                    array.splice(action.index, 1, formCopy)
                                }
                                commit(Mutations.FORM_ELEMENT_VALUE, {form: 'form', [action.value]: { value: array, type: 'mDetailTable' }})
                                commit(Mutations.CLOSE_TABLE_LAYER, {form})
                                commit(Mutations.CLEAR_FORM_DATA, {form})
                            }
                        }
                    })
                } else {
                    commit(Mutations.BUTTON_CANCEL_LOADING, {form: form})
                    setTimeout(() => {
                        commit(Mutations.BUTTON_START_LOADING, {form: form})
                    }, 0)
                }
            }
        },
        
        [Actions.SUBMIT_FORM_DATA] ({commit}, payload) {
            commit(Mutations.FORM_DATA_VALIDATE, payload)
        },
        [Actions.ELEMENT_VALIDATE_RESULT] ({state, commit, dispatch}, payload) {
            let {form, ...rest} = payload
            state[form + 'checkResult'] = {
                ...state[form + 'checkResult'],
                ...rest
            }
            if (state[form]['validate'] === true) {
                commit(Mutations.INCREMENT_CHECK_COUNT, {form})
                dispatch(Actions.COUNT_CHECK_RESULT, {form})
            }
        },
        [Actions.FETCH_FORM_DATA]({commit, state}, payload) {
            let { url } = payload
            getData(url, data => {
                let keyList = Object.keys(data)
                //此处的form为后台返回的值
                if(state.form === undefined) 
                    commit(Mutations.ADD_NEW_OBJECT, {
                        attribute: 'form',
                        value: {
                            loading: true,
                            reset: false,
                            validate: false,
                            visible: false
                        }
                    })
                let value = {
                    form: 'form'
                }
                keyList.forEach(element => {
                    value[element] = {
                        value: data[element]['value']
                    }
                })
                commit(Mutations.FORM_ELEMENT_VALUE, value)
            })
        }
    }
}
