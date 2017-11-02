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
          : asMessage)(arg0)
  } else {
    console.log('路由分发参数错误 1 ', arguments)
  }

  console.groupEnd()
}

/***
 * 客户端事件 (遇到了再说）
 */
// function asBus (action) {
// }

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
