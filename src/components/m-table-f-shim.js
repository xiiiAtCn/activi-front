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
                search:this.showSearch,
                tableWidth:this.tableWidth
            }
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
            tableDefine: {},
            tableWidth:undefined
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
            this.tableWidth = _.get(def, ['ui_define', 'tableWidth'], undefined)
        },
        getTableDefine () {
            this.getData('tableDefine', (data, err) => {
                if (data) {
                    this.initialize(data)
                }
            })
        },
        getTableData () {
            this.getData('tableData', (data, err) => {
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
