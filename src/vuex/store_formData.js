import Mutations from './Mutation'
import Actions from './Action'
import Request, {addQuery, replace} from 'utils/request-addon'
import Vue from 'vue'
import { getData, dispatch } from 'utils/actionUtils'
import { VALIDATION } from 'utils/consts'
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
            let checkList = state[form][ '_'+ form + 'waitCheck'] || []
            if(checkList && checkKey && checkList.indexOf(checkKey) === -1)
                checkList = checkList.concat(checkKey)
            state[form]['_' + form + 'waitCheck'] = checkList
        },
        [Mutations.CLEAR_FORM_DATA] (state, payload) {
            let { form } = payload
            if(form.startsWith('_')) {
                state[form + VALIDATION] = {}
            } else {
                state['_' + form + VALIDATION] = {}
            }
            form = state[form]
            for (let i in form) {
                let item = form[i]
                if (typeof item === 'boolean') {
                    form[i] = false
                } else if ( item instanceof Array) {
                    form[i] = []
                } else if (typeof item === 'object') {
                    form[i] = {}
                }
            }
            form['_reset'] = true
        },

        [Mutations.SET_TABLE_DATA] (state, data) {
            state.table = data
        },
        [Mutations.OPEN_TABLE_LAYER] (state, payload) {
            let { form, formName } = payload
            state[form] = {
                ...state[form],
                _visible: true,
                _reset: false,
            }
            if(payload.dataKey !== undefined) {
                let {dataKey, index} = payload
                let data = state[formName][dataKey]['value'][index]
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
                _visible: false,
                _reset: true,
                _loading: true
            }
        },
        [Mutations.BUTTON_START_LOADING] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                _loading: true
            }
        },
        [Mutations.BUTTON_CANCEL_LOADING] (state, payload) {
            let { form } = payload
            state[form] = {
                ...state[form],
                _loading: false
            }
        },
        [Mutations.FORM_DATA_VALIDATE] (state, payload) {
            let { form} = payload
            state[form] = {
                ...state[form],
                _validate: true,
            }
            if(form.startsWith('_')) {
                state[form + VALIDATION] = {
                }
            } else {
                state['_' + form + VALIDATION] = {
                    
                }
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
                _validate: false,
                _reset: false
            }
        },
        [Mutations.ELEMENT_VALIDATE_RESULT] (state, payload) {
            let {form, ...rest} = payload
            if(form.startsWith('_')) {
                state[form + VALIDATION] = {
                    ...state[form + VALIDATION],
                    ...rest
                }
            } else {
                state['_' + form + VALIDATION] = {
                    ...state['_' + form + VALIDATION],
                    ...rest
                }
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
        },
        [Mutations.CLEAR_ALL_DATA](state) {
            for(let i in state) {
                delete state[i]
            }
        },
        [Mutations.ERASURE_DATA](state,payload) {
            if(state[payload.form]) {
                delete state[payload.form]
                if(payload.form.startsWith('_')) {
                    delete state[payload.form + 'formvalidateResult']
                } else {
                    delete state['_' + payload.form + 'validateResult']
                }
            }
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
            let waitCheck = state[form]['_' + form + 'waitCheck']
            let finish = true
            let validatedResult = Object.keys(state[ (form.startsWith('_')?'':'_') + form + VALIDATION])
            console.group('start check count')
            console.log(form + 'waitCheck is ', waitCheck)
            console.log(form + 'validatedResult key is ', validatedResult)
            console.log(form + 'validatedResult is ', state[ (form.startsWith('_')?'':'_') + form + VALIDATION])
            console.groupEnd()
            for(let i = 0; i < waitCheck.length; i++) {
                if(validatedResult.indexOf(waitCheck[i]) === -1) {
                    finish = false
                }
            }
            if (finish) {
                let flag = validatedResult.every(element => state[ (form.startsWith('_')?'':'_') + form + VALIDATION][element] === false)
                commit(Mutations.CLOSE_DATA_VALIDATE, {form: form})
                if (flag) {
                // 数据提交逻辑
                    if(state[form]['action'] !== undefined) {
                        let action = state[form]['action']
                        delete state[form]['action']
                        let array = state[action.form][action['value']]['value']
                        if(array === undefined) {
                            array = (state['form'][action['value']] = [])
                        }
                        array = array.slice()
                        let formCopy = _.cloneDeep(state[form])
                        let keyList = Object.keys(formCopy)
                        keyList.forEach(element => {
                            if(element.startsWith('_')) {
                                delete formCopy[element]
                            }
                        })
                        delete formCopy[form + 'waitCheck']
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
                        commit(Mutations.FORM_ELEMENT_VALUE, {form: action.form, [action.value]: { value: array, type: 'm-detail-table' }})
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
                                    if(element.startsWith('_')) {
                                        delete copies[element]
                                    }
                                })
                                delete copies[form + 'waitCheck']
                                if(action !== undefined) {
                                    try {
                                        let url
                                        action = _.cloneDeep(action)
                                        let urlObject = action.url
                                        if (urlObject.method !== 'POST' && urlObject.method !== 'PUT') {
                                            throw new Error('action\'s method must be post or put')
                                        }
                                        url = urlObject.url
                                        url = replace(url, urlObject.pathParams || {})
                                        url = addQuery(url, urlObject.queryParams || {})
                                        let body = urlObject.body || {}
                                        body = {
                                            ...body,
                                            ...copies
                                        }
                                        //将所有非对象值转为字符串
                                        for(let i in body) {
                                            let element = body[i]
                                            if(typeof element['value'] !== 'object') {
                                                element['value'] = element['value'] === null? 'null': String(element['value'])
                                            }
                                            if(element['value'] === null) {
                                                element['value'] = 'null'
                                            }
                                        }
                                        delete body[ form + 'request']
                                        if(urlObject.method === 'POST') {
                                            request.setUrl(url).setBody(body).forPost((data, err) => {
                                                if(err) {
                                                    console.log(err)
                                                    iView.Message.error('服务器出错了!')
                                                    commit(Mutations.FORM_ELEMENT_VALUE, {form, _validate: false})
                                                    return
                                                }
                                                dispatch(data)
                                            })
                                        } else {
                                            request.setUrl(url).setBody(body).forPut((data, err) => {
                                                if(err) {
                                                    console.log(err)
                                                    iView.Message.error('服务器出错了!')
                                                    commit(Mutations.FORM_ELEMENT_VALUE, {form, _validate: false})
                                                    return
                                                }
                                                dispatch(data)
                                            })
                                        }
                                    } catch (e) {
                                        commit(Mutations.FORM_ELEMENT_VALUE, {form, _validate: false})
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
            if(form.startsWith('_')) {
                state[form + VALIDATION] = {
                    ...state[form + VALIDATION],
                    ...rest
                }
            } else {
                state['_' + form + VALIDATION] = {
                    ...state[ '_' + form + VALIDATION],
                    ...rest
                }
            }
            
            if (state[form]['_validate'] === true) {
                Object.keys(rest).forEach(element => {
                    if(rest[element] === true) {
                        iView.Modal.error({
                            title:'错误',
                            content: '画面必填项缺失, 请确认后再试!'
                        })
                    }
                })
                dispatch(Actions.COUNT_CHECK_RESULT, {form})
            }
        },
        [Actions.FETCH_FORM_DATA]({commit, state}, payload) {
            let { url } = payload
            getData(url, (data, err) => {
                if(err) {
                    console.error('error happens when fetch form data')
                    return
                }
                commit(Mutations.CLEAR_ALL_DATA)
                console.log(data)
                if(!Array.isArray(data)) {
                    console.error('数据结构错误，请联系管理员解决!')
                    return
                }
                data.forEach(element => {
                    let form = element['_FORM_'] || 'form'
                    let stateData = state[form]
                    if(!stateData) {
                        commit(Mutations.ADD_NEW_OBJECT,
                            {
                                attribute: form,
                                value: {
                                    _loading: true,
                                    _reset: false,
                                    _validate: false,
                                    _visible: false,
                                    ['_' + form + 'waitCheck']: []
                                }
                            }
                        )
                    }
                    let tmp = {}
                    if(element['key'] && element.type !== 'table') {
                        let {  key, value, ...rest } = element
                        tmp[key] = {
                            value,
                            ...rest
                        }
                        tmp['form'] = form
                        commit(Mutations.FORM_ELEMENT_VALUE, tmp)
                    }
                    if(element.type === 'table') {
                        let array = element['value']
                        let key = element['key']
                        let list = []
                        if(Array.isArray(array)) {
                            array.forEach(ele => {
                                if(Array.isArray(ele)) {
                                    let tmpElement = {}
                                    ele.forEach(e => tmpElement = { ...tmpElement, [e.key]: { value: e.value}})
                                    list.push(tmpElement)
                                } else {
                                    console.warn(`unexpected data type in table element value, expected array, but got ${typeof ele}`)
                                }
                            })
                            commit(Mutations.FORM_ELEMENT_VALUE, { form, [key]:{value: list}})
                        } else {
                            console.warn(`unexpected data type in table data,expected array, but got ${typeof array}`)
                        }
                    }
                })
                // commit(Mutations.FORM_ELEMENT_VALUE, value)
            })
        },
        [Actions.DELETE_TABLE_DATA]({state, commit}, payload) {
            let {dataKey, index, formName} = payload
            let array = state[formName][dataKey]['value'].slice()
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
            commit(Mutations.FORM_ELEMENT_VALUE, {form: formName, [dataKey]:{type: 'm-detail-table', value: primaryList}})
        }
    }
}
