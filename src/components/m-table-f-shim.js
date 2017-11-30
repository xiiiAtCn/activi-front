import Vue from 'vue'
import _ from 'lodash'
import mTableF from './m-table-f.vue'
import { getData } from 'utils/actionUtils'
import { deepCopy } from 'utils/utils'
import mixin from './mixin'
import Mutations from 'store/Mutation'

let tableFShim = Vue.component('tableF-Shim', {
    render: function (h) {
        return h(mTableF, {
            props: {
                showModalBtn: this.showModalBtn,
                operation: this.operation,
                cols: this.cols,
                rowsContent: this.rowsContent,
                tableHeight: this.tableHeight,
                search:this.showSearch,//是否显示搜索框
                tableName:'',//为本地存贮提供表格名字
                serverPage:false,//是否服务器分页
                checkRow:this.checkRow, //是否行单选

                form:this.form, //往vuex存数据的地址
                name:this.name //selectid

            },
            on:{
                rowsPageChange : this.handleRowsPageChange
            }
        })
    },
    mixins: [mixin],
    data () {
        return {
            url: '',
            showModalBtn: [],
            rowsContent: [],
            operation: [],
            cols:[],
            showSearch:false,
            tableDefine: {},
            tableName:'',
            tableHeight:null,
            serverPage:false,
            checkRow:false
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
        form:{
            type:String,
            default:''
        }
    },
    computed:{
        name () {
            return _.get(this.define, 'id', '')
        }
    },
    methods: {
        initialize (def) {
            this.operation = _.get(def, ['ui_define', 'operation'], [])
            this.showModalBtn = _.get(def, ['ui_define', 'showModalBtn'], [])
            this.cols = _.get(def, ['ui_define', 'cols'], [])
            this.url = _.get(def, ['ui_define', 'data_url'], {})
            this.showSearch = _.get(def, ['ui_define', 'showSearch'], false)
            this.tableName = _.get(def, ['ui_define', 'tableName'], '')
            this.tableHeight = _.get(def, ['ui_define', 'tableHeight'], null)
            this.serverPage = _.get(def, ['ui_define', 'serverPage'], false)
            this.checkRow=  _.get(def, ['ui_define', 'checkRow'], '')
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
        },
        watchValuesChanged () {
            this.getTableDefine()
            this.getTableData()
        },
        handleRowsPageChange(arg){
            this.commitData(arg)
        }
    }
})

export default tableFShim
