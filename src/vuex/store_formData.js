import Mutations from './Mutation'
import Actions from './Action'
import Request, {addQuery, replace} from 'utils/request-addon'
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
            let {form, checkKey,...rest} = payload
            state[form] = {
                ...state[form],
                ...rest
            }
            let checkList = state[form][form + 'waitCheck']
            if(checkList && checkList.indexOf(checkKey) === -1) 
                checkList = checkList.concat(checkKey)
            state[form][form + 'waitCheck'] = checkList
        },

        [Mutations.CLEAR_FORM_DATA] (state, payload) {
            let { form } = payload
            debugger
            state[form + 'checkResult'] = {}
            form = state[form]
            for (let i in form) {
                let item = form[i]
                if (typeof item === 'boolean') {
                    form[i] = false
                } else if ( item instanceof Array) {
                    continue
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
                reset: false,
            }
            if(payload.dataKey !== undefined) {
                let {dataKey, index} = payload
                let data = state['form'][dataKey]['value'][index]
                state[form] = {
                    ...state[form],
                    ...data
                }
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

            if(payload.request !== undefined) {
                state[form] = {
                    ...state[form],
                    [form + 'request']: payload.request,
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
            let waitCheck = state[form][form + 'waitCheck']
            let finish = true
            let checkResult = Object.keys(state[form + 'checkResult'])
            for(let i = 0; i < waitCheck.length; i++) {
                if(checkResult.indexOf(waitCheck[i]) === -1) {
                    finish = false
                }
            }
            if (finish) {
                debugger
                let flag = checkResult.every(element => state[form + 'checkResult'][element] === false)
                commit(Mutations.CLOSE_DATA_VALIDATE, {form: form})
                if (flag) {
                // 数据提交逻辑
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
                            formCopy['flag'] = { value: 'add' }
                            array.push(formCopy)
                        } else if(action.type === 'update') {
                            let index = action['index']
                            let data = array[index]
                            if(data.flag === undefined) {
                                formCopy['flag'] = { value: 'update' }
                            }
                            array.splice(action.index, 1, formCopy)
                        }
                        commit(Mutations.FORM_ELEMENT_VALUE, {form: 'form', [action.value]: { value: array, type: 'm-detail-table' }})
                        commit(Mutations.CLOSE_TABLE_LAYER, {form})
                        commit(Mutations.CLEAR_FORM_DATA, {form})
                    } else {
                        let action = state[form][ form + 'request']
                        iView.Modal.confirm({
                            title: '确认',
                            content:action && action.confirm ||'确定提交',
                            onOk:() => {
                                let copies = _.cloneDeep(state[form])
                                let keyList = Object.keys(copies)
                                keyList.forEach(element => {
                                    if(typeof copies[element] !== 'object') {
                                        delete copies[element]
                                    }
                                })
                                if(action !== undefined) {
                                    try {
                                        let url 
                                        let urlObject = action.url
                                        if (urlObject.method !== 'POST') {
                                            throw new Error('action\'s method must be post')
                                        }
                                        url = urlObject.url
                                        url = replace(url, urlObject.pathParams || {})
                                        url = addQuery(url, urlObject.queryParams || {})
                                        let body = urlObject.body || {}
                                        body = {
                                            ...body,
                                            ...copies
                                        }
                                        delete body[ form + 'request']
                                        request.setUrl(url).setBody(body).forPost((data, err) => {
                                            if(err) {
                                                console.log(err)
                                                iView.Message.error('服务器出错了!')
                                                commit(Mutations.FORM_ELEMENT_VALUE, {form, validate: false})
                                                return
                                            }
                                            dispatch(data)
                                        })
                                    } catch (e) {
                                        commit(Mutations.FORM_ELEMENT_VALUE, {form, validate: false})
                                        console.error(e)
                                    }
                                }
                            }
                        })
                    }
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
                            visible: false,
                            ['form' + 'waitCheck']: []
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
        },
        [Actions.DELETE_TABLE_DATA]({state, commit}, payload) {
            let {dataKey, index} = payload
            let array = state['form'][dataKey]['value'].slice()
            let deletedArray = array.filter(ele => {
                if(ele['flag']&& ele['flag']['value'] === 'delete') {
                    return true
                }
                return false
            })
            let primaryList = array.filter(ele => {
                if(ele['flag']&& ele['flag']['value'] === 'delete') {
                    return false
                }
                return true
            })
            let data = primaryList[index]
            if(data.flag) {
                if(data.flag.value === 'update') {
                    data.flag = {
                        value: 'delete'
                    }
                } else {
                    primaryList.splice(index, 1)
                }
            } else {
                data['flag'] = {
                    value: 'delete'
                }
            }
            primaryList = primaryList.concat(deletedArray)
            commit(Mutations.FORM_ELEMENT_VALUE, {form: 'form', [dataKey]:{type: 'm-detail-table', value: primaryList}})
        }
    }
}
