/**
 * File: d:\product\vue\src\components\mixin.js
 * Project: d:\product
 * Created Date: 2017-11-06
 * Author: ZhaoPeng
 * -----
 * 上次修改时间: 2017-11-06
 * Modified By: 
 * -----
 * 哈哈哈哈隔
 */
import _ from 'lodash'
const mixin = {
    props: {
        define: {
            type: Object,
            default: {}
        }
    },
    computed: {
        id () {
            return _.get(this.define, 'id', '')
        },
        isRelated () {
            return _.get(this.define, 'isRelated', false)    
        },
        relationData () {
            if (!this.isRelated) {
                return ''
            }
            let arrData = []
            for (let obj of this.define.relation) {
                arrData.push(this.$store.state.componentPageData[obj.id] || '')
            }
            return arrData
        },
        dataLink () {
            return _.get(this.define, 'dataLink', {})
        },
        param () {
            let result = {}
            for (let obj of this.define.relation) {
                result[obj.key] = this.$store.state.componentPageData[obj.id] || obj.default
            }
            return result
        },
    },
}

export default mixin