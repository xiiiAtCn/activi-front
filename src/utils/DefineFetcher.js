/**
 * Created by sunb on 17-5-26.
 */
// import VueResource from 'vue-resource'
import _ from 'lodash'
import iView from 'iview'
import axios from 'axios'

// Vue.use(VueResource)

/***
 * 从服务器段取得数据
 * @param urlObject 后端url(字符串)或者url对象。
 *   urlObject对象示例：
 *   {
 *      url: /api/xxxx
 *      otherParam1:  1003
 *   }
 *
 * @param callback
 */
export default function fetch(urlObject, callback) {
    let _url
    if (typeof urlObject === 'string') {
        _url = urlObject
    } else {
        _url = urlObject.url

        let params = _.omit(urlObject, 'url')

        if (Object.keys(params).length > 0) {
            _url += '?'
            _.forIn(params, function (value, key) {
                _url += (key + '=' + value + '&')
            })
        }
    }

    axios.get(_url).then(function (res) {
        callback(null, res.data)
    }).catch(function (error) {
        let response = error.response
        codeClassify(response.status, response.statusText)
    })
}

export function post(url, body, callback) {
    axios.post(url, body).then(function (res) {
        callback(null, res.data)
    }).catch(
        function (error) {
            let response = error.response
            codeClassify(response.status, response.statusText)
        }
        )
}

function codeClassify(status, text) {
    let error = { status, text }
    let content

    switch (status) {
        case 500:
            content = '糟糕，服务器出故障了！' + ' (' + status + ' : ' + text + ')'
            iView.Message.error({
                content,
                duration: 5,
                closable: true
            })
            // iView.Modal.error({
            //     title: "出错了！",
            //     content: content
            // });
            break
        case 430:
            content = '没有符合条件的数据。'
            iView.Message.info(content)
            break

        default:
    }
    return error
}
