import axios from 'axios'
import urlUtil from 'url'
import  _ from 'lodash'
import iView from 'iview'
/**
 *
 * @author  Lungern xiii.at.cn@gmail.com
 * @since   2017-10-18 17:38:56
 * @update  2017-10-19 09:52:09
 */

const types = ['$requestUrl', '$path', '$query']

axios.interceptors.response.use(res => {
    if(res.data.code == '401') {
        location.href = '/system-login.html'
        return Promise.reject('redirect')
    }
    return res
}, error => {
    return Promise.reject(error)
})

function Request () {

}
/**
 * 发起get请求
 *
 * @param 请求返回的回调
 */
Request.prototype.forGet = function (callback) {
    let url = this._buildPath()
    let config = {}
    if (this.$config !== undefined) {
        config = { ...this.$config}
        delete this.$config
    }
    console.group(`get method from ${this._checkEnvironment()} start`)
    console.info('path: ===> ' + location.origin + url)
    console.groupEnd()
    return axios.get(url, config)
        .then(res => {
            console.group(`${this._checkEnvironment()} get request success`)
            console.info(`data from get method %c${location.origin + url} \n`,
                'color: #008B00;', res.data)
            console.groupEnd()
            callback(res.data, null)
        })
        .catch(err => {
            console.group(`${this._checkEnvironment()} get request fail`)
            console.error(`err from get method %c${location.origin + url} \n`,
                'color: #EE2C2C; background: rgba(255, 215, 0, 0.9)', err)
            console.groupEnd()
            iView.Message.error('服务器出错了，请联系管理员解决')
            callback(null, err)
        })
}

Request.prototype.forDelete = function (callback) {
    let url = this._buildPath()
    let config = {}
    if (this.$config !== undefined) {
        config = { ...this.$config}
        delete this.$config
    }
    console.group(`delete method from ${this._checkEnvironment()} start`)
    console.info('path: ===> ' + location.origin + url)
    console.groupEnd()
    return axios.delete(url, config)
        .then(res => {
            console.group(`${this._checkEnvironment()} delete request success`)
            console.info(`data from delete method %c${location.origin + url} \n`,
                'color: #008B00;', res.data)
            console.groupEnd()
            callback(res.data, null)
        })
        .catch(err => {
            console.group(`${this._checkEnvironment()} delete request fail`)
            console.error(`err from delete method %c${location.origin + url} \n`,
                'color: #EE2C2C; background: rgba(255, 215, 0, 0.9)', err)
            console.groupEnd()
            iView.Message.error('服务器出错了，请联系管理员解决')
            callback(null, err)
        })
}


/**
 * 发起post请求
 *
 * @param callback  请求返回之后的回调
 */
Request.prototype.forPost = function (callback) {
    let url = this._buildPath()
    let body = {}, config = {}
    if (this.$body !== undefined) {
        if(_.isArray(this.$body)){
            body = this.$body
            delete this.$body
        }else{
            body = { ...this.$body}
            delete this.$body
        }
    }
    if (this.$config !== undefined) {
        config = { ...this.$config}
        delete this.$config
    }
    console.group(`post method from ${this._checkEnvironment()} start`)
    console.info('path: ===> ' + location.origin + url)
    console.info('body :', body)
    console.groupEnd()
    return axios.post(url, body, config)
        .then(res => {
            console.group(`${this._checkEnvironment()} post request success`)
            console.info(`data from %c${location.origin + url} \n`,
                'color: #008B00;', res.data)
            console.info('method body :', body)
            console.groupEnd()
            callback(res.data, null)
        })
        .catch(err => {
            console.group(`${this._checkEnvironment()} post request fail`)
            console.error(`err from %c${location.origin + url} \n`,
                'color: #EE2C2C; background: rgba(255, 215, 0, 0.9)', err)
            console.info('method body :', body)
            console.groupEnd()
            iView.Message.error('服务器出错了，请联系管理员解决')
            callback(null, err)
        })
}

/**
 * 发起put请求
 *
 * @param callback  请求返回之后的回调
 */
Request.prototype.forPut = function (callback) {
    let url = this._buildPath()
    let body = {}, config = {}
    if (this.$body !== undefined) {
        if(_.isArray(this.$body)){
            body = this.$body
            delete this.$body
        }else{
            body = { ...this.$body}
            delete this.$body
        }
    }
    if (this.$config !== undefined) {
        config = { ...this.$config}
        delete this.$config
    }
    console.group(`put method from ${this._checkEnvironment()} start`)
    console.info('path: ===> ' + location.origin + url)
    console.info('body :', body)
    console.groupEnd()
    return axios.put(url, body, config)
        .then(res => {
            console.group(`${this._checkEnvironment()} put request success`)
            console.info(`data from %c${location.origin + url} \n`,
                'color: #008B00;', res.data)
            console.info('method body :', body)
            console.groupEnd()
            callback(res.data, null)
        })
        .catch(err => {
            console.group(`${this._checkEnvironment()} put request fail`)
            console.error(`err from %c${location.origin + url} \n`,
                'color: #EE2C2C; background: rgba(255, 215, 0, 0.9)', err)
            console.info('method body :', body)
            console.groupEnd()
            iView.Message.error('服务器出错了，请联系管理员解决')
            callback(null, err)
        })
}
/**
 * 设置请求地址
 */
Request.prototype.setUrl = function (url) {
    if (this.$requestUrl !== undefined) {
        throw new Error(`requestUrl '${this.$requestUrl}' has been set but never used, 
        please check if there was a request not sending`)
    }
    this.$requestUrl = url
    return this
}

/**
 * 添加post请求的body参数
 */
Request.prototype.setBody = function (body) {
    this._checkUrl()
    this.$body = body
    return this
}

/**
 * 设置路径参数
 */
Request.prototype.setPathVariables = function (pathVariables) {
    this._checkUrl()
    pureObjectCheck(pathVariables)
    this.$path = pathVariables
    return this
}

/**
 * 添加查询字符串
 */
Request.prototype.setQuery = function (query) {
    this._checkUrl()
    pureObjectCheck(query)
    this.$query = query
    return this
}

/**
 * 设置post请求的配置参数
 */
Request.prototype.setConfig = function (config) {
    this._checkUrl()
    pureObjectCheck(config)
    this.$config = config
    return this
}

/**
 * 替换路径参数
 * @param url 需要进行路径参数替换的url
 * @param pathVariables 路径参数对象
 */
export function replace (url, pathVariables) {
    pureObjectCheck(pathVariables)
    let regex = /\{([^{^}]*)\}/g
    return url.replace(regex, (match, $1) => {
        let variable = pathVariables[$1]
        delete pathVariables[$1]
        return variable
    })
}

/**
 * 添加查询字符串
 * @param  url
 * @param  queryVariables
 */
export function addQuery (url, queryVariables) {
    pureObjectCheck(queryVariables)
    let urlObject = urlUtil.parse(url, true)
    queryVariables = {
        ...queryVariables,
        ...urlObject.query
    }
    return urlObject.pathname + '?' + Object.keys(queryVariables).map(element => `${element}=${queryVariables[element]}`).join('&')
}

/**
 * 生成请求的完整路径
 */
Request.prototype._buildPath = function () {
    this._checkUrl()
    let url = this.$requestUrl
    if (this.$path !== undefined) {
        let pathVariables = {...this.$path}
        url = replace(url, pathVariables)
    }
    if (this.$query !== undefined) {
        let query = {...this.$query}
        url = addQuery(url, query)
    }

    for (let i = 0; i < types.length; i++) {
        let element = types[i]
        if (element in this) {
            delete this[element]
        }
    }
    return url
}

/**
 * 解决关键字冲突问题
 * TODO
 */
Request.prototype.resolveConflict = function (key) {
    console.log(key)
}

/**
 * 检查是否设置请求url, 需要在设置其他参数之前检查
 */
Request.prototype._checkUrl = function () {
    if (this.$requestUrl === undefined) {
        throw new Error('url is not set. Please set it first')
    }
}

Request.prototype._checkEnvironment = function () {
    return this.$vnode ? 'Vue instance' : 'Request instance'
}

/**
 * 纯粹对象检查
 * @param  target
 */
export function pureObjectCheck (target) {
    if (Object.prototype.toString.apply(target) !== '[object Object]') {
        throw new Error(`unexpected argument variables, expect pure object, but get 
        ${Object.prototype.toString.apply(target)} `)
    }
}

export default Request
