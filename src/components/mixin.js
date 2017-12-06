/**
 * File: d:\product\vue\src\components\mixin.js
 * Project: d:\product
 * Created Date: 2017-11-06
 * Author: ZhaoPeng
 * -----
 * 上次修改时间: 2017-11-06
 * Modified By: ZhaoPeng
 * -----
 * 组件公用关联逻辑
 */
import _ from 'lodash'
import Mutations from 'store/Mutation'
// import { getData } from 'utils/actionUtils'
import { deepCopy } from 'utils/utils'

let NoData = Symbol('NoData')

const mixin = {
    props: {
        relation: {
            type: Object,
            default: {}
        },
        // 组件数据区域
        form: {
            type: String,
            default: ''
        }
    },
    methods: {
        /**
         * 获取数据
         * @param {*} type dataLink类型
         * @param {*} callback 回调
         */
        getDataUrlObj (type) {
            // 此时relation还未传入 
            if (this.relation && Object.keys(this.relation).length > 0) {
                let dataLink = deepCopy(this.dataLink)
                // 没有link对象
                if (Object.keys(dataLink).length > 0) {
                    let obj = _.filter(dataLink, (item) => {
                        return item.attr === type
                    })[0]
                    // 设置组件请求参数
                    obj.link.pathParams = this.getRealParamData(obj.link.pathParams)
                    obj.link.queryParams = this.getRealParamData(obj.link.queryParams)
                    obj.link.body = this.getRealParamData(obj.link.body)
                    // getData(obj.link, (data, err) => {
                    //     callback(data, err)
                    // })
                    return obj.link
                }
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
        getRealParamData (param) {
            let data = {}
            if (param) {
                let componentData = this.form ? this.$store.state.componentPageData[this.form] : this.$store.state.componentPageData
                for (let key of Object.keys(param)) {
                    // 普通数据不处理
                    if (!param[key].getVuexValue) {
                        data[key] = param[key]
                    } else {
                        let value = param[key].value
                        let defaultValue = param[key].defaultValue
                        data[key] = NoData
                        if (componentData) {
                            // 如果为数组逐层取值 
                            if (Array.isArray(value)) {
                                data[key] = _.get(componentData, [...value], NoData)
                            } else {
                                data[key] = componentData[value] || NoData
                            }
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
            }
            return data
        },
        /**
         * 向vuex提交数据
         * @param {*} payload 
         */
        commitData (payload) {
            this.$store.commit(Mutations.SET_COMPONENT_DATA, {
                ...this.idObj,
                data: payload
            })
        },
        /**
         * 组件受影响后会调用此方法
         */
        watchValuesChanged () {}
    },
    computed: {
        // 组件id
        id () {
            return _.get(this.relation, 'id', '')
        },
        // 组件id + 数据区域
        idObj () {
            let result = {id: this.id}
            if (this.form) {
                result.form = this.form
                return result
            } else {
                return result
            }
        },
        // 是否与其他组件关联
        isRelated () {
            return _.get(this.relation, 'related', false)
        },
        // 与其他组件关联的数据
        relationData () {
            if (!this.isRelated) {
                return ['']
            }
            let arrData = []
            let source = this.$store.state.componentPageData
            if (this.form) {
                for (let id of this.relation.relation) {
                    if (source[this.form]) {
                        arrData.push(source[this.form][id] || '')
                    } else {
                        arrData.push('')
                    }
                }
            } else {
                for (let id of this.relation.relation) {
                    arrData.push(source[id] || '')
                }
            }
            return arrData
        },
        // 组件获取数据link对象
        dataLink () {
            return _.get(this.relation, 'dataLink', {})
        }
    },
    watch: {
        relationData (newVal, oldVal) {
            if (!_.isEqual(newVal, oldVal)) {
                this.watchValuesChanged(newVal, oldVal)
            }
        }
    },
    destroyed () {
        this.$store.commit(Mutations.CLEAR_COMPONENT_DATA, {...this.idObj})
    }
}

export default mixin
