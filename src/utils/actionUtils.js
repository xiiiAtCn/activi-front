/**
 * Created by 高鹏程 on 2017/5/24.
 */
/**
 * 根据url，获取页面meta数据, 判断页面显示位置
 * @param url
 * @returns {*}
 */

import router from '../router'
import url from 'url'
import util from 'util'
import store from '../vuex/store'
import extend from 'node.extend'
import iView from 'iview'
import bus from '../router/bus'
import Request, { replace, addQuery } from './request-addon'
import {SUBMIT_FORM_DATA} from 'store/Action'


export function dispatch () {
    if (arguments.length === 0) {
        console.log('路由分发参数错误 0 ')
        return
    }

    let arg0 = arguments[0]
    console.group('dispatch start', arguments[0])

    if (util.isString(arg0)) {
        let urlObject = url.parse(arg0, true)
        asLink({
            type: 'link',
            url: arg0,
            at: urlObject.query.at,
            mode: arguments.length > 1 ? arguments[1] : 'push'
        })
    } else if (util.isObject(arg0)) {
        (arg0.type === 'link' ? asLink
            : arg0.type === 'submit' ? asSubmit
            : arg0.type === 'selectOne'? selectOne
            : arg0.type === 'serverAction' ? asServerAction
            : asMessage)(arg0)
    } else {
        console.log('路由分发参数错误 1 ', arguments)
    }
    console.groupEnd()
}

/**
 * 获取数据
 */
let stack = 0
export const getData = (action, callback) => {
    let url
    let request = new Request()
    let method = 'GET'
    let body
    if (typeof action === 'string') {
        url = action
    } else if (Object.prototype.toString.apply(action) === '[object Object]') {
        url = action.url
        url = replace(url, action.pathParams || {})
        url = addQuery(url, action.queryParams || {})
        if (action.method === 'POST' || action.method === 'PUT' ) {
            body = action.body
            method = action.method
        } else if(action.method === 'DELETE') {
            method = action.method
        } else {
            method = 'GET'
        }
    } else {
        throw new Error(`unexpected argument action, required string, object , but got ${typeof action}`)
    }

    if (stack === 0) {
        bus.$emit('show-my-full-loading')
    }
    stack++
    setTimeout(() => {
        if (stack !== 0) {
            bus.$emit('hide-my-full-loading')
            stack = 0
            console.warn('network seems slow. overlay is forced to close even though request is not back')
        }
    }, 10000)
    switch (method) {
    case 'POST':
        request.setUrl(url).setBody(body).forPost((result, err) => {
            stack--
            setTimeout(() => {
                if (stack === 0) { bus.$emit('hide-my-full-loading') }
            }, 1000)

            callback(result, err)
            if(!err && action.callback) {
                action.callback()
            }
        })
        break
    case 'PUT':
        request.setUrl(url).setBody(body).forPut((result, err) => {
            stack--
            setTimeout(() => {
                if (stack === 0) { bus.$emit('hide-my-full-loading') }
            }, 1000)

            callback(result, err)
            if(!err && action.callback) {
                action.callback()
            }
        })
        break
    case 'GET':
        request.setUrl(url).forGet((result, err) => {
            stack--
            setTimeout(() => {
                if (stack === 0)
                    bus.$emit('hide-my-full-loading')
            }, 1000)
            callback(result, err)
            if(!err && action.callback) {
                action.callback()
            }
        })
        break
    case 'DELETE':
        request.setUrl(url).forDelete((result, err) => {
            stack--
            setTimeout(() => {
                if (stack === 0)
                    bus.$emit('hide-my-full-loading')
            }, 1000)
            callback(result, err)
            if(!err && action.callback) {
                action.callback()
            }
        })
        break
    default:
    }

}

/**
 * url动作
 * @param action
 *  例：
 *  {
 *      type: "link",               // 固定
 *      url: "/api/XXXXx",          // 一般是后端指定
 *      at: "/layout/page"          // 选择路由
 *      query: {jobId: 123}         // url里边附加的参数
 *      confirm: "您确定要XXXX吗",   // 可选  按钮按下后的确认信息(是否两个按钮)
 *      alert: "XXXXX",             // 可选  确认按钮（一个按钮）
 *      mode:                       //  mode: push/replace/reload
 *  }
 */
function asLink(action) {
    if (action.alert) {
        iView.Message.success(action.alert)
    }
    let targetAction = function () {
        if (action.mode === 'reload') {
            let c = router.currentRoute
            router.replace({ path: c.path, query: c.query, hash: String(Date.now()) })
        } else {
            let routLinkParam = {}
            let current = router.currentRoute

            if (action.at) {
                routLinkParam.path = action.at
            } else {
                action.at = current.path
                routLinkParam.path = action.at
            }

            //144-145 change by f in 12.1
            action.url = urlToString(action)

            action.url = action.url.replace(/([^\u0000-\u00FF])/g, function ($) { return encodeURI($)})

            if (action.url) {
                routLinkParam.query = extend({ url: action.url }, action.query)
            } else {
                action.url = '/api/program/isBuilding/template?at=' + action.at
                routLinkParam.query = extend({ url: action.url }, action.query)
            }
            if (action.mode === 'replace') {
                routLinkParam.hash = String(Date.now())
                router.replace(routLinkParam)
            } else {
                routLinkParam.hash = String(Date.now())
                router.push(routLinkParam)
            }
            if(action.callback) {
                action.callback()
            }
        }
    }

    if (action.confirm) {
        iView.Modal.confirm({
            title: '确认',
            content: '<p>' + action.confirm + '</p>',
            onOk: () => {
                targetAction()
            },
            onCancel: () => {
                iView.Message.info('点击了取消')
            }
        })
    } else {
        targetAction()
    }
}

/**
 *
 * @param {*} action
 *  提交表单时需要将type类型从后台返回的类型中取出，指定form值，并将action放在request属性中
 *  形如{type: ,form: 'form', request: btn.action}
 */
function asSubmit(action) {
    let form = action.form
    if(!action.form) form = 'form'
    store.dispatch( SUBMIT_FORM_DATA,{ form, request: action })
}

/**
 *  服务器端处理
 * @param action
 *  例：
 *  {
 *      type: "serverAction",       // 固定
 *      url: "/api/XXXXx",          // 一般是后端指定
 *      confirm: "您确定要XXXX吗",   // 可选  按钮按下后的确认信息(是否两个按钮)
 *      alert: "XXXXX",             // 可选  确认按钮（一个按钮）
 *  }
 */
function asServerAction(action) {
    let targetAction = function () {
        getData(action.url, (result, err) => {
            if(err) {
                iView.Message.error('服务器出错了, 请稍后再试!')
                return
            }
            dispatch(result)
            if(action.callback) {
                action.callback()
            }
        })
    }

    if (action.alert) {
        iView.Message.success(action.alert)
    }
    if (action.confirm) {
        iView.Modal.confirm({
            title: '确认',
            content: action.confirm,
            onOk: () => {
                targetAction()
            }
        })
    } else {
        targetAction()
    }
}

/**
 *  服务器端处理
 * @param action
 *  例：
 *  {
 *      type: "message",            // 固定
 *      confirm: "您确定要XXXX吗",   // 可选  按钮按下后的确认信息(是否两个按钮)
 *      alert: "XXXXX",             // 可选  确认按钮（一个按钮）
 *  }
 */
function asMessage(action) {
    console.log('dispatch message', action)
    if (action.confirm) {
        if (!window.confirm(action.confirm)) {
            return
        }
    }

    if (action.alert) {
        iView.Message.success(action.alert)
    }
    if(action.callback) {
        action.callback()
    }
}
/**
 *
 * @param {*} action 操作描述对象
 * @add 2017-12-21 09:50:29
 */

export function selectOne(action) {
    iView.Modal.warning({
        title: `${action.message}`,
        render:(h) => {
            let buttons = action.buttons
            let group = []
            buttons.forEach((element, index) => {
                let button = h(
                    'Button',
                    {
                        props: {
                            key: index,
                            size: element.size || 'default',
                            type: element.type || 'default'
                        },
                        style: {
                            'marginLeft': '10px'
                        },
                        on: {
                            click:() => {
                                iView.Modal.remove()
                                dispatch(element.action)
                            }
                        }
                    },
                    element.text
                )
                group.push(button)
            })
            return h(
                'div',
                {
                    style:{
                        'marginTop': '20px'
                    }
                },
                group
            )
        },
        okText: '取消'
    })
}
/*
* url对象转字符串
* */

export function urlToString(action) {
    if(util.isObject(action.url)){
        let url
        url = action.url.url
        url = replace(url, action.url.pathParams || {})
        url = addQuery(url, action.url.queryParams || {})
        return url
    }else{
        return action.url
    }
}
