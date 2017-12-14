import Vue from 'vue'
import _ from 'lodash'
import mTableF from './m-table-f.vue'
import { getData } from 'utils/actionUtils'
import mixin from './mixin'

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
                serverPage:this.serverPage,//是否服务器分页
                pageTotal:this.pageTotal,
                checkRow:this.checkRow, //是否行单选

                form:this.form, //往vuex存数据的地址
                name:this.name, //selectid
                wordList: this.wordList,    //分词结果
                reload:this.reloadData
            },
            on:{
                rowsPageChange : this.handleRowsPageChange,
                topSearchMsg: this.keyWordSearch
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
            checkRow:false,
            lastUrlData:{},
            pageTotal:null,
            wordList: []
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
            type: Function,
            default () {
                return function () {}
            }
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
            this.checkRow= _.get(def,'checkRow', '')

            if(Object.keys(this.relation).length === 0){
                this.lastUrlData = _.cloneDeep(this.url)
                this.tableGetData(this.url,'data')
            }
        },
        getTableDefine () {
            let urlDefine = this.getDataUrlObj('tableDefine')
            this.tableGetData(urlDefine,'define')
        },
        getTableData () {
            let urlData = this.getDataUrlObj('tableData')
            this.lastUrlData = _.cloneDeep(urlData)
            this.tableGetData(urlData,'data')
        },
        keyWordSearch(keyWord) {
            debugger
            let urlData = _.cloneDeep(this.lastUrlData)
            urlData['queryParams']['conditionWord'] = keyWord
            this.tableGetData(urlData, 'data')
        },
        tableGetData(url,key){
            if(!url || url.length === 0){return}
            if( key === 'data' && !url.queryParams.size){
                url.queryParams.size = 10
            }
            getData(url, (data) => {
                if(data){
                    if(key === 'define'){
                        this.initialize(data)
                    }else{
                        if(data.total){
                            this.rowsContent = data.datas
                            this.serverPage = true
                            this.pageTotal = data.total
                            this.wordList = data.wordList || []
                        }else{
                            this.serverPage = false
                            this.rowsContent = data
                            this.wordList = data.wordList || []
                        }
                    }
                }
            })
        },
        reloadData(){
            let url = _.cloneDeep(this.lastUrlData)
            this.tableGetData(url,'data')
        },
        watchValuesChanged (newval, oldval) {
            if (newval[0] === oldval[0] && Object.keys(newval[1]).length === 0 && !oldval[1]) {
                return
            }
            this.getTableDefine()
            this.getTableData()
        },
        handleRowsPageChange(arg){
            let url = _.cloneDeep(this.lastUrlData)
            for(let key in arg){
                url.queryParams[key] = arg[key]
            }
            this.tableGetData(url,'data')
            this.commitData(arg)
        }
    }
})

export default tableFShim
