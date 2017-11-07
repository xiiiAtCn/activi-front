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
import Mutations from 'store/Mutation'
import { getData } from 'utils/actionUtils'
import { deepCopy } from 'utils/utils'

const mixin = {
    props: {
        define: {
            type: Object,
            default: {}
        }
    },
    methods: {
        /**
         * 获取数据
         * @param {*} type dataLink类型
         * @param {*} callback 回调
         */
        getData (type, callback) {
            let dataLink = deepCopy(this.dataLink)
            let obj = _.filter(dataLink, (item) => {
                return item.attr === type
            })[0]
            // 设置组件请求参数
            obj.link.pathParams = this.getRealParamData(obj.link.pathParams)
            obj.link.queryParams = this.getRealParamData(obj.link.queryParams)
            obj.link.body = this.getRealParamData(obj.link.body)
            getData(obj.link, (data, err) =>{
                callback(data, err)
            })
        },
        /**
         * 将id替换为真实数据
         * @param {*} param 
         * id: {
         *      value: idObj.navSelectId,
         *      defaultValue: ''
         * }
         * id: [*] || {*} || '*'
         */
        getRealParamData (param) {
            let data = {}
            if (param) {
                let componentData = this.$store.state.componentPageData
                for (let key of Object.keys(param)) {
                    data[key] = componentData[param[key].value] || param[key].defaultValue
                    if (data[key] === null) {
                        delete data[key]         
                    }
                }
            }
            return data
        },
        /**
         * 组件受影响后会调用此方法
         */
        watchValuesChanged () {}
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
            for (let id of this.define.relation) {
                arrData.push(this.$store.state.componentPageData[id] || '')
            }
            return arrData
        },
        dataLink () {
            return _.get(this.define, 'dataLink', {})
        },
    },
    watch: {
        relationData (newVal, oldVal) {
            if (!_.isEqual(newVal, oldVal)) {
                this.watchValuesChanged()
            }
        }
    },
    beforeDestroy () {
        this.$store.commit(Mutations.CLEAR_COMPONENT_DATA, {id: this.id})
    }
}

export default mixin