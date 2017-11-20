<template>
    <div>
        <Row class="top-content" style="text-align: right">
            <Col span="24">
                <div class="search" v-show="search">
                    <Input v-model="valueSearch" placeholder="筛选">
                    <Button slot="append" icon="ios-search" @click="handleTopSearch"></Button>
                    </Input>
                </div>
                <div class="button-container" >
                    <Poptip placement="bottom">
                        <Button type="ghost" icon="grid"></Button>
                        <div class="api" slot="content" style="text-align: left">
                            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                                <Checkbox :indeterminate="indeterminate"
                                          :value="checkAll"
                                          @click.prevent.native="handleCheckAll">全选</Checkbox>
                            </div>
                            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" style="height: 400px;overflow-y: scroll">
                                <div v-for='item in dataList'>
                                    <Checkbox :label="item.label"></Checkbox>
                                </div>
                            </CheckboxGroup>
                        </div>
                    </Poptip>
                </div>
                <div class="button-container">
                    <div>
                        <Select style="width:120px" placeholder="请选择显示行数" @on-change="changeSelect">
                            <Option v-for="item in rowList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
                <div v-for="item in operation"  class="button-container" >
                    <Button  :type="item.type?item.type:'primary'"  @click="handleTopButton(item.url)">{{item.text}}</Button>
                </div>
            </Col>
        </Row>
        <div>
            <Table :highlight-row="checkRow" border @on-current-change="hanleRowClick"
                   :columns="columnsData" :data="dataTable" :height="tableHeight"></Table>
        </div>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="rowsContent.length" :page-size="parseInt(rowCount)" :current="currentPage" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from '../router/bus'
    import { dispatch,forGet } from 'utils/actionUtils'
    import _ from 'lodash'
    import { FORM_ELEMENT_VALUE} from 'store/Mutation'

    export default {
        props: {
            showModalBtn: {
                type: null
            },
            operation: {
                type: null
            },
            cols: {
                type: null
            },
            rowsContent: {
                type: null
            },
            search: {
                type: Boolean,
                default: true
            },
            serverPage:{
                type: Boolean,
                default: false
            },
            tableName:{
                type: null,
                default: undefined
            },
            tableHeight:{
                type: null,
                default: 500
            },
            checkRow:{
                type: null,
                default: false
            },
            form:{
                type: [String, Number],
                default: ''
            },
            name:{
                type: null,
                default: ''
            }
        },
        data () {
            return {
                columnsData: [],
                columnsDataCopy: [],
                dataTable: [],
                valueSearch: '',

                // 列选择控制
                indeterminate: false,
                checkAll: true,
                checkAllGroup: [],
                dataList: [],
                dataListChange: [],
                testList:[],
                //行数
                rowList: [
                    {
                        value: '5',
                        label: '5'
                    },
                    {
                        value: '10',
                        label: '10'
                    },
                    {
                        value: '15',
                        label: '15'
                    },
                    {
                        value: '20',
                        label: '20'
                    },
                    {
                        value: '25',
                        label: '25'
                    },
                    {
                        value: '30',
                        label: '30'
                    }
                ],
                rowCount:10,
                currentPage:1
            }
        },
        watch: {
            cols () {
                console.log('mTableF watch cols')
                this.handleDefine()
            },
            rowsContent () {
                console.log('mTableF watch rowsContent')
                this.handleContent()
            },
            tableName(){
                if(window.localStorage.getItem(this.tableName+'.rowCount')){
                    this.rowCount = window.localStorage.getItem(this.tableName+'.rowCount')
                }
            }
        },
        mounted () {
            console.log('mTableF run')
        },
        methods: {
            // 配置表格
            handleDefine () {
                this.getColumnsDataWay(this.cols)
                this.showButton(this.showModalBtn)
            },
            // columnsData存入设置
            getLength(str){
                let len = 0;
                if(!str){
                    return 0
                }
                for (let i = 0; i < str.length; i++) {
                    let a = str.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {
                        len += 2;
                    }
                    else {
                        len += 1;
                    }
                }
                return len*7 + 40;
            },
            getColumnsDataWay (c) {
                c.forEach((val, i) => {
                    let self =this
                    this.columnsData[i] = {
                        title: val.text,
                        key: val.field,
                        align: 'center',
                        width: this.getLength(val.text),
                        render: (h, params) => {
                            if(self.columnsData){
                                self.columnsData.forEach((v,j)=>{
                                    if(v.key === val.field && self.getLength(params.row[val.field]) > self.columnsData[j].width){
                                        if(!self.columnsData[j]){return}
                                        self.columnsData[j].width = self.getLength(params.row[val.field])
                                    }
                                })
                            }
                            if (val.icon) {
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: val.icon
                                        }
                                    }),
                                    h('strong', params.row[val.field])
                                ])
                            } else {
                                return h('div',[h('span', params.row[val.field])]
                                )
                            }
                        }
                    }
                    // 筛选列
                    this.dataList[i] = {
                        label: val.text,
                        value: val.field
                    }
                    this.testList[i] = val.text
                })
                this.columnsDataCopy = _.clone(this.columnsData, true)
                //读取localStorage数据 确认展示列
                if(this.tableName && window.localStorage.getItem(this.tableName+'.checkAllGroup')){
                    this.checkAllGroup = JSON.parse(window.localStorage.getItem(this.tableName+'.checkAllGroup'))
                    for(let i=this.checkAllGroup.length-1;i>=0;i--){
                        let removeColumns=true
                        for(let j=0;j<this.checkAllGroup.length;j++){
                            if(this.columnsData[i].title === this.checkAllGroup[j]){
                                removeColumns=false
                                break
                            }
                        }
                        if(removeColumns){
                            this.columnsData.splice(i,1)
                        }
                    }
                    this.dataListChange =  _.cloneDeep(this.checkAllGroup)
                }else{
                    this.checkAllGroup = _.cloneDeep(this.testList)
                    this.dataListChange = _.cloneDeep(this.testList)
                }
            },
            //配置操作的按钮
            showButton(smb){
                let i = 0
                let existence =false
                while (this.columnsData.length !== 0){
                    if(this.columnsData[i].key === 'action'){
                        existence = true
                        break
                    }
                    i++
                    if(this.columnsData.length === i){break}
                }
                if(existence){
                    return
                }
                this.columnsData.push({
                    title: '操作',
                    key: 'action',
                    width: smb.length * 60,
                    align: 'center',
                    fixed: 'right',
                    render: (h, params) => {
                        let buttonList = []
                        smb.forEach((val) => {
                            buttonList.push(h('Button', {
                                props: {
                                    type: val.type,
                                    size: val.size ? val.size : 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handleButtonClick(params, val)
                                    }
                                }
                            }, val.text))
                        })
                        if (buttonList.length > 0) { return h('div', buttonList) } else { return h() }
                    }
                })
            },
            //tableData存入行数据
            handleContent(){
                if(this.serverPage){
                    this.dataTable = this.rowsContent
                }else{
                    this.dataTable = this.rowsContent.slice(0,this.rowCount)
                }
                this.removeColButton()
            },
            //是否去除无用的操作列
            removeColButton(){
                if(this.showModalBtn.length === 0){
                    let i=1
                    while (this.columnsData.length !== 0){
                        if(this.columnsData[i].key === 'action'){
                            this.columnsData.splice(i,1)
                            break
                        }
                        i++
                        if(this.columnsData.length === i){break}
                    }
                }
            },

            // 处理顶部按钮
            handleTopButton (url) {
                dispatch(url)
            },
            //发送搜索事件数据
            handleTopSearch(){
                bus.$emit('topSearchMsg',this.valueSearch)
            },
            // 处理表内按钮点击
            handleButtonClick (params, row) {
                dispatch(params.row._actions[row.field])
            },

            // 筛选列
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false
                } else {
                    this.checkAll = !this.checkAll
                }
                this.indeterminate = false

                if (this.checkAll) {
                    this.checkAllGroup = _.cloneDeep(this.testList)
                    this.columnsData = _.cloneDeep(this.columnsDataCopy)
                    this.removeColButton()
                } else {
                    this.checkAllGroup = []
                    this.columnsData = []
                    if(this.showModalBtn.length !== 0) {this.showButton(this.showModalBtn)}
                }
                this.dataListChange = _.cloneDeep(this.checkAllGroup)
            },
            checkAllGroupChange (data) {
                if (data.length === this.dataList.length) {
                    this.indeterminate = false
                    this.checkAll = true
                } else if (data.length > 0) {
                    this.indeterminate = true
                    this.checkAll = false
                } else {
                    this.indeterminate = false
                    this.checkAll = false
                }

                let obj=this.judgeArr(this.dataListChange,data)
                this.handleColumnsData(obj);
                this.dataListChange = data
                if(this.tableName){
                    window.localStorage.setItem(this.tableName+'.checkAllGroup',JSON.stringify(data))
                }
            },
            handleColumnsData (obj) {
                if (!obj) {
                    return
                } else if (obj.method === 'remove') {
                    this.columnsData.forEach((val, i) => {
                        if (val.title === obj.str) {
                            this.columnsData.splice(i, 1)
                        }
                    })
                } else if (obj.method === 'add') {
                    this.columnsDataCopy.forEach((val,i) => {
                        if (val.title === obj.str) {
                            this.columnsData.splice(i,0,val)
                        }
                    })
                }
                if(this.showModalBtn.length !== 0) {this.showButton(this.showModalBtn)}
            },
            //提取数组不同值
            judgeArr(arr1,arr2){
                let str = '',obj={method:'remove'}
                if(arr1.length < arr2.length){
                    let Arr=arr1
                    arr1=arr2
                    arr2=Arr
                    obj.method='add'
                }else if(arr1.length === arr2.length){
                    return
                }
                for (let i = 0; i < arr1.length; i++) {
                    let val = arr1[i]
                    str = val
                    for (let j = 0; j < arr2.length; j++) {
                        if (val === arr2[j]) {
                            str = ''
                            break
                        }
                    }
                    if (str !== '') {
                        break
                    }
                }
                obj.str = str
                return obj
            },


            //改变 显示行数
            changePage(arg){
                if(!this.serverPage){
                    this.dataTable = this.rowsContent.slice((arg-1)*this.rowCount,arg*this.rowCount)
                }else{
                    this.$emit('rowsPageChange', {from:arg, size:this.rowCount})
                }
            },
            //用户选择一页显示行数时
            changeSelect(arg){
                this.rowCount = arg
                this.dataTable = this.rowsContent.slice(0,arg)
                this.currentPage = 1
                window.localStorage.setItem(this.tableName+'.rowCount',arg)
            },

            //行单选存数据
            hanleRowClick(data){
                this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]:data, form: this.form})
            }
        }
    }
</script>
<style scoped>
    .top-content > div{
        padding: 5px;
    }
    .button-container{
        display: inline-block;
        min-width:65px;
        margin-right: 8px;
    }

    .columns-select{
        text-align: center;
    }
    .columns-select button{
        padding: 0 11px;
        font-size: 20px;
    }
    .columns-select .api{
        text-align: initial;
    }
</style>
<style>
    .ivu-table td{
        box-sizing: content-box !important;
    }
    .ivu-table-row-highlight td{
        background-color: #8ee1fa;
    }
    .ivu-table-row-hover td{
        background-color: #8ee1fa !important;
    }
</style>
