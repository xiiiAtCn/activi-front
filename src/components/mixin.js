/**
 * File: d:\product\vue\src\components\mixin.js
 * Project: d:\product
 * Created Date: 2017-11-06
 * Author: ZhaoPeng
 * -----
 * 上次修改时间: 2017-11-06
 * Modified By: ZhaoPeng
 * -----
 * 哈哈哈哈隔
 */
import _ from 'lodash'
import Mutations from 'store/Mutation'
import { getData } from 'utils/actionUtils'
import { deepCopy } from 'utils/utils'

let NoData = Symbol('NoData')

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
            if (Object.keys(dataLink).length > 0) {
                let obj = _.filter(dataLink, (item) => {
                    return item.attr === type
                })[0]
                // 设置组件请求参数
                obj.link.pathParams = this.getRealParamData(obj.link.pathParams)
                obj.link.queryParams = this.getRealParamData(obj.link.queryParams)
                obj.link.body = this.getRealParamData(obj.link.body)
                getData(obj.link, (data, err) => {
                    callback(data, err)
                })
            }
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
        // getRealParamData (param) {
        //     let data = {}
        //     if (param) {
        //         let componentData = this.$store.state.componentPageData
        //         for (let key of Object.keys(param)) {
        //             data[key] = componentData[param[key].value] || param[key].defaultValue
        //             if (data[key] === null) {
        //                 delete data[key]         
        //             }
        //         }
        //     }
        //     return data
        // },
        getRealParamData (param) {
            let data = {}
            if (param) {
                let componentData = this.$store.state.componentPageData
                for (let key of Object.keys(param)) {
                    let value = param[key].value
                    let defaultValue = param[key].defaultValue
                    // 如果为数组逐层取值 
                    if (Array.isArray(value)) {
                        data[key] = _.get(componentData, [...value], NoData)
                    } else {
                        data[key] = componentData[value] || NoData
                    }
                    // vuex中没有数据，有默认值赋值，没有报错
                    if (NoData === data[key]) {
                        if (Object.keys(param[key]).includes('defaultValue')) {
                            data[key] = defaultValue
                        } else {
                            throw new Error(`获取vuex中的数据时发生错误，vuex中没有key为${value}的数据`)
                        }
                    }
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
        }
    },
    watch: {
        relationData (newVal, oldVal) {
            if (!_.isEqual(newVal, oldVal)) {
                this.watchValuesChanged()
            }
        }
    },
    destroyed () {
        this.$store.commit(Mutations.CLEAR_COMPONENT_DATA, {id: this.id})
    }
}

export default mixin
