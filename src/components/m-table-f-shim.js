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
            showModalBtn: '',
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
        },
        addComponent: {
            type: Function
        }
    },
    computed:{
        name () {
            return _.get(this.relation, 'id', '')
        }
    },
    mounted () {
        this.addComponent()
        Object.keys(this.relation).length === 0 && this.initialize(this.define)
    },
    methods: {
        initialize (def) {
            if(def.ui_define){
                def = def.ui_define
            }
            if(!def.cols){
                return
            }
            this.operation = _.get(def,'operation', [])
            this.showModalBtn = _.get(def,'showModalBtn','')
            this.cols = _.get(def,'cols', [])
            this.url = _.get(def,'data_url', {})
            this.showSearch = _.get(def,'showSearch', false)
            this.tableName = _.get(def,'tableName', '')
            this.tableHeight = _.get(def,'tableHeight', null)
            this.serverPage = _.get(def,'serverPage', false)
            this.checkRow= _.get(def,'checkRow', '')
            Object.keys(this.relation).length === 0 && this.tableGetData(this.url,'data')
        },
        getTableDefine () {
            let urlDefine = this.getDataUrlObj('tableDefine')
            this.tableGetData(urlDefine,'define')
        },
        getTableData () {
            let urlData = this.getDataUrlObj('tableData')
            this.tableGetData(urlData,'data')
        },
        tableGetData(url,key){
            if(!url || url.length === 0){return}
            getData(url, (data) => {
                if(data){
                    if(key === 'define'){
                        this.initialize(data)
                    }else{
                        this.rowsContent = data
                    }
                }
            })
        },
        watchValuesChanged (newval, oldval) {
            if (newval[0] === oldval[0] && Object.keys(newval[1]).length === 0 && !oldval[1]) {
                return 
            }

            this.getTableDefine()
            this.getTableData()
        },
        handleRowsPageChange(arg){
            this.commitData(arg)
        }
    }
})

export default tableFShim
