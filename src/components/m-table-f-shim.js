import Vue from 'vue'
import _ from 'lodash'
import mTableF from './m-table-f.vue'
import { getData } from 'utils/actionUtils'
import { deepCopy } from 'utils/utils'
import mixin from './mixin'

let tableFShim = Vue.component('tableF-Shim', {
    render: function (h) {
        return h(mTableF, {
            props: { 
                showModalBtn: this.showModalBtn, 
                operation: this.operation, 
                cols: this.cols, 
                rowsContent: this.rowsContent,
                search:this.showSearch, }
        })
    },
    mixins: [mixin],
    data() {
        return {
            url: '',
            showModalBtn:[],
            rowsContent: [],
            operation: [],
            cols:[],
            showSearch:false,
            tableDefine: {}
        }
    },
    props: {
        uid: {
            type: String,
            default: ''
        },
        define: {
            type: Object,
            default () {
                return {}
            }
        },
    },
    methods: {
        initialize(def) {
            this.operation = _.get(def, ['ui_define', 'operation'], [])
            this.showModalBtn = _.get(def, ['ui_define', 'showModalBtn'], [])
            this.cols = _.get(def, ['ui_define', 'cols'], [])
            this.url = _.get(def, ['ui_define', 'data_url'], null)
        },
        getTableDefine () {
            let obj = _.filter(this.dataLink, (item) => {
                return item.attr === 'tableDefine'
            })[0]
            // 设置组件请求参数
            obj.link.params = this.param
            getData(obj.link, (data, err) =>{
                if (data) {
                    this.initialize(data)
                }
            })
        },
        getTableData () {
            let obj = _.filter(this.dataLink, (item) => {
                return item.attr === 'tableData'
            })[0]
            // 设置组件请求参数
            obj.link.params = this.param
            getData(obj.link, (data, err) =>{
                if (data) {
                    this.rowsContent = data
                }
            })
        }
    },
    watch: {
        relationData () {
            this.getTableDefine()
            this.getTableData()
        }
    },
})

export default tableFShim
