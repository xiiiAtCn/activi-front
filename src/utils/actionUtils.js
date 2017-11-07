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
import { default as fetch, post } from './DefineFetcher'
import iView from 'iview'
import bus from '../router/bus'
import Request, {replace, addQuery} from './request-addon'

// import _ from 'lodash'

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
        : arg0.type === 'serverAction' ? asServerAction
          : arg0.type === 'deliver' ? asBus
          : asMessage)(arg0)
  } else {
    console.log('路由分发参数错误 1 ', arguments)
  }

  console.groupEnd()
}


function deepCopy(object) {
  return JSON.parse(JSON.stringify(object))
}
/***
 * 客户端事件 (遇到了再说)
 */
function asBus (action) {
  // console.log('client event', JSON.stringify(action))
  // let url, method = 'GET', params, eventId, body, source
  // eventId = action.eventId
  // if (typeof action.link === 'string') {
  //     url = action.link
  // } else if (typeof action.link === 'object') {
  //     source = action.source
  //     url = action.link.url
  //     method = action.link.method
  //     params = action.link.params || {}
  //     if (method === 'POST') {
  //         source = body = params
  //     } else {
  //         source = deepCopy(params)
  //         url = replace(url, params)
  //         url = addQuery(url, params)
  //     }
  // }
  // let request = new Request()
  // if (method === 'GET') {
  //     request.setUrl(url).forGet(data => {
  //         bus.$emit(eventId, data, source)
  //     })
  // } else {
  //     request.setUrl(url).setBody(body).forPost(data => {
  //         bus.$emit(eventId, data, source)
  //     })
  // }
}

/**
 * 获取数据
 */
let stack = 0
export const  getData = (action, callback) => {
    let url, request = new Request(), method = 'GET', body
    if(typeof action === 'string') {
        url = action
    } else if(Object.prototype.toString.apply(action) === '[object Object]'){
        url = action.url
        if(action.method === 'POST') {
            body = action.body
            method = 'POST'
        } else {
            url = replace(url, action.pathParams || {})
            url = addQuery(url, action.queryParams || {})
        }
    } else {
        throw new Error(`unexpected argument action, required string, object , but got ${typeof action}`)
    }   

    if(stack === 0) {
        bus.$emit('show-my-full-loading')
    }
    stack++
    setTimeout(() => {
        if(stack !== 0)
            bus.$emit('hide-my-full-loading')
    }, 10000)
    if(method === 'POST')
        request.setUrl(url).setBody(body).forPost((result, err) => {
            stack--
            if(stack === 0)
                bus.$emit('hide-my-full-loading')
            callback(result, err)
        })
    else 
        request.setUrl(url).forGet((result, err) => {
            stack--
            if(stack === 0)
                bus.$emit('hide-my-full-loading')
            callback(result, err)
        }) 
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
function asLink (action) {
  if (action.alert) {
    iView.Message.success(action.alert)
  }

  let targetAction = function () {
    if (action.mode === 'reload') {
      let c = router.currentRoute

      // router.go(0)
      router.replace({path: c.path, query: c.query, hash: String(Date.now())})
    } else {
      let routLinkParam = {}
      let current = router.currentRoute

      if (action.at) {
        routLinkParam.path = action.at
      } else {
        action.at = current.path
        routLinkParam.path = action.at
      }

      // if (routLinkParam.path && !_.startsWith(routLinkParam.path, '/')) {

      //     routLinkParam.path = router.currentRoute.path + '/' + routLinkParam.path;
      // }

      if (action.url) {
        routLinkParam.query = extend({url: action.url}, action.query)
      } else {
        // /layoutContent/:id/isBuilding
        action.url = '/api/program/isBuilding/template?at=' + action.at
        routLinkParam.query = extend({url: action.url}, action.query)
      }
      // console.log('action', action);
      if (action.mode === 'replace') {
        router.replace(routLinkParam)
      } else {
        router.push(routLinkParam)
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
 * 提交处理
 * @param action
 *  例：
 *  {
 *      type: "submit",             // 固定
 *      url: "/api/XXXXx",          // 一般是后端指定
 *      confirm: "您确定要XXXX吗",   // 可选  按钮按下后的确认信息(是否两个按钮)
 *      alert: "XXXXX",             // 可选  确认按钮（一个按钮）
 *  }
 */
function asSubmit (action) {
  console.log('dispatch submit', action)

  bus.$emit('forceValid')

  let targetAction = function () {
    post(action.url, store.state.pageData.data, function (error, body) {
      if (error === null) {
        store.dispatch('clearData', {})
        dispatch(body)
      }
    })
  }

  bus.$emit('forceValid')

  if (store.state.validStatus.valid === 'VALID') {
    if (action.alert) {
      iView.Message.success(action.alert)
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
  } else {
    console.log('store.state.validStatus.valid', store.state.validStatus.valid)
    console.log('校验没有通过~')
  }
  // console.log("post data : ", store.state.pageData.data);
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
function asServerAction (action) {
  console.log('dispatch serverAction', action)

  let targetAction = function () {
    fetch(action.url, function (error, body) {
      if (error === null) {
        dispatch(body)
      }
    })
  }

  if (action.alert) {
    iView.Message.success(action.alert)
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
 *  服务器端处理
 * @param action
 *  例：
 *  {
 *      type: "message",            // 固定
 *      confirm: "您确定要XXXX吗",   // 可选  按钮按下后的确认信息(是否两个按钮)
 *      alert: "XXXXX",             // 可选  确认按钮（一个按钮）
 *  }
 */
function asMessage (action) {
  console.log('dispatch message', action)
  if (action.confirm) {
    if (!window.confirm(action.confirm)) {
      return
    }
  }

  if (action.alert) {
    window.alert(action.alert)
  }
}
