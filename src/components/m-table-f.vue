<template>
    <div ref="tableCt" class="table-f">
        <Row class="top-content" style="text-align: right">
            <Col span="24">
            <div class="button-container search" v-if="search" >
                <Row>
                    <Col span="18">
                        <AutoComplete
                            v-model="valueSearch"
                            placeholder="查询"
                            @on-search="searchSuggest"
                            @enter="handleTopSearch">
                            <Option v-for="(option, index) in suggestList" :value="option" :key="index">{{option}}</Option>
                        </AutoComplete>
                    </Col>
                    <Col span="6" class="btn-ct">
                        <Button class="search-button" @click="handleTopSearch" type="info">搜索</Button>
                    </Col>
                </Row>
            </div>
            <div class="button-container" >
                <Poptip placement="bottom">
                    <Button class="icon-btn" type="ghost" icon="grid"></Button>
                    <div class="api" slot="content" style="text-align: left">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            <Checkbox :indeterminate="indeterminate"
                                      :value="checkAll"
                                      @click.prevent.native="handleCheckAll">全选</Checkbox>
                        </div>
                        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" style="height: 400px;overflow-y: scroll">
                            <div v-for='(item, index) in dataList' :key="index">
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
            <div v-for="(item, index) in operation"  :key="index" class="button-container" >
                <Button  :type="item.type?item.type:'primary'" :size="item.size?item.size:'default'" @click="handleTopButton(item.action)">{{item.text}}</Button>
            </div>
            <div class="button-container" v-if="showAddressBtn">
                <Button size="default" @click="showLayerAmap">查看地址</Button>
            </div>
            </Col>
        </Row>
        <div>
            <Table :highlight-row="checkRow === 'S' ? true : false" border @on-current-change="handleRowClick" @on-selection-change="handleRowsClick"  @on-row-dblclick="handledblclick"
                   :columns="columnsData" :data="dataTable"></Table>
        </div>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;" ref="pageCt">
                <Page :total="pageTotal || rowsContent.length" :page-size="parseInt(rowCount)" :current="currentPage" @on-change="changePage"></Page>
            </div>
        </div>
        <mLayer :value="showLayer" :titleText="customTitle" @on-cancel="handleCancel" @on-ok="handleOk">
            <component
                v-if="layerDefine"
                :is="customComponent"
                :define="layerDefine"
            ></component>
        </mLayer>
    </div>
</template>
<script>
    import { dispatch, getData} from 'utils/actionUtils'
    import _ from 'lodash'
    import { FORM_ELEMENT_VALUE} from 'store/Mutation'
    import  bus from '../router/bus'

    export default {
        props: {
            showModalBtn: {
                type: null,
                default: false
            },
            customBtn: {//自定义表格内菜单
                type: null,
                default: false
            },
            layerTitle:{//layer的标题
                type: null,
                default: ''
            },
            layerComponent:{//layer内容是哪个组件
                type: null,
                default: ''
            },
            justTable:{//最简化显示table
                type: null,
                default: false
            },
            operation: {
                type: null,
                default () {
                    return []
                }
            },
            cols: {
                type: null,
                default () {
                    return []
                }
            },
            rowsContent: {
                type: null,
                default () {
                    return []
                }
            },
            search: {
                type: Boolean,
                default: true
            },
            serverPage:{
                type: Boolean,
                default: false
            },
            pageTotal:{
                type: Number,
                default: null
            },
            tableName:{
                type: null,
                default: undefined
            },
            checkRow:{
                type: null,
                default: ''
            },
            form:{
                type: [String, Number],
                default: ''
            },
            wordList: {
                type: [Array],
                default () {
                    return []
                }
            },
            suggestUrl: {
                type: [Object],
                default () {
                    return {}
                }
            },
            name:{
                type: null,
                default: ''
            },
            reload:{
                type: Function,
                default () {
                    return function () {}
                }
            },
            showAddress:{//是否显示展示地图按钮
                type: null,
                default: false
            }
        },
        data () {
            return {
                customTitle:'在地图上的位置',
                customComponent:'',

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
                        label: '每页  5 行'
                    },
                    {
                        value: '10',
                        label: '每页 10 行'
                    },
                    {
                        value: '15',
                        label: '每页 15 行'
                    },
                    {
                        value: '20',
                        label: '每页 20 行'
                    },
                    {
                        value: '25',
                        label: '每页 25 行'
                    },
                    {
                        value: '30',
                        label: '每页 30 行'
                    }
                ],
                rowCount:10,
                currentPage:1,
                lastId:'',
                //table宽度
                tableWidth:'',
                //post 的 id数组
                idList:[],
                //提示数据列表
                suggestList: [],
                suggestFlag: false,
                searchLoading: false,

                //弹出框
                showLayer:false,
                layerDefine:'',

                //查看地址按钮
                showAddressBtn:false,
                mapData:[],
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
            if(this.justTable){
                this.handleDefine()
                this.handleContent()
            }
        },
        methods: {
            // 配置表格
            handleDefine () {
                this.getColumnsDataWay(this.cols)
                if(this.showModalBtn) this.showButton()
            },
            // columnsData存入设置
            getLength(str){
                let len = 0
                if(!str){
                    return 0
                }
                for (let i = 0; i < str.length; i++) {
                    let a = str.charAt(i)
                    if (a.match(/[^\x00-\xff]/ig) != null) {
                        len += 2
                    }
                    else {
                        len += 1
                    }
                }
                return len*7 + 40
            },
            getColumnsDataWay (c) {
                this.columnsData = []
                c.forEach((val, i) => {
                    let self =this
                    this.columnsData[i] = {
                        title: val.text,
                        key: val.field,
                        align: 'center',
                        width: this.getLength(val.text),
                        render: (h, params) => {
                            let data = params.row[val.field]
                            if(!data){
                                return h('div',h('span', ''))
                            } else if(Object.prototype.toString.call(data) === '[object Object]'){
                                data = data.value
                            }
                            if(self.columnsData){
                                self.columnsData.forEach((v,j)=>{
                                    if(!v.key){return}
                                    if(v.key === val.field && self.getLength(data) > self.columnsData[j].width){
                                        if(!self.columnsData[j]){return}
                                        self.columnsData[j].width = self.getLength(data)
                                    }
                                })
                            }

                            let container = []
                            if(this.wordList.length > 0 && typeof data === 'string' && data) {
                                for(let i = 0; i < this.wordList.length; i++) {
                                    let word = this.wordList[i]
                                    data = data.replace(new RegExp(word, 'g'), $0 => `(${$0})`)
                                }
                                let header = 0
                                let tail = 0
                                for(let i = 0, length = data.length; i < length; i++) {
                                    if(data[i] === '(') {
                                        tail = i
                                        container.push({
                                            flag: false,
                                            data: data.substring(header, tail)
                                        })
                                        header = i + 1

                                        continue
                                    }
                                    if(data[i] === ')') {
                                        tail = i
                                        container.push({
                                            flag: true,
                                            data: data.substring(header, tail)
                                        })
                                        header = i + 1
                                    }
                                }
                                if(tail !== data.length) {
                                    container.push({
                                        flag: false,
                                        data: data.substring(header)
                                    })
                                }
                            } else {
                                container = [{
                                    flag: false,
                                    data: data
                                }]
                            }
                            if(container[0]['data'] === '(') {
                                container.shift()
                            }
                            let contentRender = []
                            for(let i = 0; i < container.length; i++) {
                                let element = container[i]
                                if((element['data'] !== undefined) && ((typeof element['data'].valueOf()) === "boolean")){
                                    contentRender.push(
                                        h('Icon', {
                                            props: {
                                                type: element['data'].valueOf()?'checkmark-round':'close-round'
                                            }
                                        }))
                                }else{
                                    if(element.flag) {
                                        contentRender.push(h('span',
                                            {
                                                style:{
                                                    color: 'red'
                                                }
                                            },
                                            element['data']
                                        ))
                                    } else {
                                        contentRender.push(h('span',
                                            element['data']
                                        ))
                                    }
                                }
                            }
                            if (val.icon) {
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: val.icon
                                        }
                                    }),
                                    h('strong', data)
                                ])
                            } else {
                                return h('div',contentRender)
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

                this.handleContent()
            },
            //判断是否存在
            judgeExistence(key,text){
                let i = 0
                let existence =false
                while (this.columnsData && this.columnsData.length !== 0){
                    if(this.columnsData[i][key] === text){
                        existence = true
                        break
                    }
                    i++
                    if(this.columnsData.length === i){break}
                }
                if(existence){
                    return true
                }else{
                    return false
                }
            },
            //配置操作的按钮
            showButton(){
                if(this.judgeExistence('key','action')){
                    return
                }
                if(!this.showModalBtn){return}
                this.columnsData.push({
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    fixed: 'left',
                    render: (h, params) => {
                        if(this.customBtn){
                            return h('div', [
                                h('span', {
                                    style:{
                                        marginRight:'5px',
                                        marginLeft:'-5px'
                                    }
                                }, params.index + 1 + (this.currentPage-1)*Number(this.rowCount)),
                                h('Button', {
                                    props:{
                                        size:'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleCustomBtn(params.row.id)
                                        }
                                    }
                                }, '查看')
                            ])
                        }else{
                            let buttons=params.row.buttons[0]
                            return h('div', [
                                h('span', {
                                    style:{
                                        marginRight:'5px',
                                        marginLeft:'-5px'
                                    }
                                }, params.index + 1 + (this.currentPage-1)*Number(this.rowCount)),
                                h('Button', {
                                    props:{
                                        size:'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleButtonClick(buttons)
                                        }
                                    }
                                }, buttons.text)
                            ])
                        }

                    }
                })
            },
            //打开弹出框
            handleCustomBtn(id){
                this.customComponent = this.layerComponent
                this.customTitle = this.layerTitle
                this.layerDefine ={
                    id:id
                }
                this.showLayer = true
            },
            handleCancel(){
                this.layerDefine = ''
                this.showLayer = false
            },
            handleOk(){
                this.layerDefine = ''
                this.showLayer = false
            },

            //tableData存入行数据
            handleContent(){
                if(this.rowsContent.length === undefined || this.rowsContent.length === 0){
                    this.dataTable = []
                    return
                }
                if(this.serverPage){
                    this.dataTable = this.rowsContent
                    this.lastId = this.rowsContent[this.rowsContent.length-1].id
                }else{
                    this.dataTable = this.rowsContent.slice(0,this.rowCount)
                }
                //确定有地址才注入数据
                if(this.showAddress){
                    this.mapData = []
                    this.dataTable.forEach(v => {
                        if(v.FAddress && v.FAddress.value){
                            this.mapData.push(v)
                        }
                    })
                    this.mapData.length !== 0 && (this.showAddressBtn = true)
                }
                this.showButton()
                this.checkRowClick()
                this.$nextTick(function() {
                    this.checkValue()
                })
            },
            //是否去除无用的操作列
            removeColButton(){
                if(!this.showModalBtn){
                    let i=0
                    while (this.columnsData && this.columnsData.length !== 0){
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
            handleTopButton (action) {
                let actions = _.cloneDeep(action)
                if(actions.type !== 'link'){
                    actions.url.body = this.idList
                }
                if(actions.callbackMethodName && actions.callbackMethodName === 'reloadData'){
                    actions.callback = this.reload
                    this.currentPage = 1
                }
                dispatch(actions)
            },
            //发送搜索事件数据
            handleTopSearch(){
                this.$emit('topSearchMsg',this.valueSearch)
            },
            // 处理表内按钮点击
            handleButtonClick (buttons) {
                dispatch(buttons.action)
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
                    if(this.showModalBtn) {this.showButton()}
                }
                this.showButton()
                this.checkRowClick()
                this.dataListChange = _.cloneDeep(this.checkAllGroup)
                this.$nextTick(function() {
                    this.checkValue()
                })
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

                this.$nextTick(function() {
                    this.checkValue()
                })
            },
            //添加或删除列
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
                            this.columnsData.splice(i+1,0,val)
                        }
                    })
                }
                if(this.showModalBtn) {this.showButton()}
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
                this.currentPage = arg
                if(!this.serverPage){
                    this.dataTable = this.rowsContent.slice((arg-1)*this.rowCount,arg*this.rowCount)
                }else{
                    this.$emit('rowsPageChange', {from:arg, size:this.rowCount,lastDataId:this.lastId})
                }
                this.$nextTick(function() {
                    this.checkValue()
                })
            },
            //用户选择一页显示行数时
            changeSelect(arg){
                this.rowCount = arg
                this.dataTable = this.rowsContent.slice(0,arg)
                this.$refs.pageCt.querySelector('.ivu-page-item').click()
                this.tableName && window.localStorage.setItem(this.tableName+'.rowCount',arg)
                if(this.serverPage){
                    this.$emit('rowsPageChange', {from:1, size:this.rowCount,lastDataId:this.lastId})
                }
            },
            //用户双击一行时 广播事件
            handledblclick(data){
                if(this.checkRow === 'S'){
                    bus.$emit(this.form + '_dbclick', data.id);
                }
            },

            //行单选存数据
            handleRowClick(data){
                this.$store.commit(FORM_ELEMENT_VALUE, {['id']:data.id, form: '_' + this.form || 'form'})
                this.idList.push(data.id)
            },

            //行多选存数据
            handleRowsClick(data){
                let list=[]
                data.forEach((val)=>{
                    list.push(val.id)
                })
                this.idList = list
                this.$store.commit(FORM_ELEMENT_VALUE, {'_list':list, form: this.form || 'form'})
            },

            //行多选加列
            checkRowClick(){
                if(this.checkRow === 'M'){
                    if(this.judgeExistence('type','selection')){
                        return
                    }
                    this.columnsData.unshift({
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    })
                }
            },
            checkValue(){
                //判断表格宽度更改表格渲染
                let width=0,arr=[]
                this.columnsData.forEach((val,i)=>{
                    width += val.width
                    // if(val.width >= this.getLength(val.text)){
                    //     arr.push(i)
                    // }
                })
                if(width < this.$refs.tableCt.clientWidth){
                    let val={}
                    for(let i=this.columnsData.length-1; i>=0 ; i--){
                        // for(let j=0;j<arr.length;j++){
                        //     if(arr[j] === i){
                        //         return
                        //     }
                        // }
                        this.columnsData[i].width < 170 && delete this.columnsData[i].width

                        val=this.columnsData[i]
                        if(val.key && val.key === 'action'){
                            this.columnsData.splice(i,1)
                        }
                        if(val.type && val.type === 'selection'){
                            this.columnsData.splice(i,1)
                        }



                    }
                }
                this.showButton()
                this.removeColButton()
                this.checkRowClick()
            },
            //查询提示词
            searchSuggest(words) {
                this.suggestFlag = false
                let suggestUrl = _.cloneDeep(this.suggestUrl)
                suggestUrl['queryParams'] = {
                    conditionWord: words,
                    size: 10
                }
                setTimeout(() => {
                    this.suggestFlag = true
                }, 500)
                setTimeout(() => {
                    if(this.suggestFlag === true) {
                        getData(suggestUrl, data => {
                            this.suggestList = data
                        })
                    }
                }, 500)
            },


            //多地址展示
            showLayerAmap(){
                this.customComponent = 'mLayerAmap'
                this.layerDefine = this.mapData
                this.showLayer = true
                this.customTitle = '在地图上的位置'
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
        vertical-align: middle;
    }
    .search{
        min-width: 300px;
    }

    .search .btn-ct{
        text-align: left;
    }
    .search .search-button{
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
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

    .icon-btn{
        padding: 0 14px;
        font-size: 20px;
    }
</style>
<style>
    .table-f .search .ivu-input{
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
    }
    .ivu-table td{
        box-sizing: content-box !important;
    }
    .ivu-table-cell{
        word-break: keep-all;
    }
    .ivu-table-row-highlight td{
        background-color: #8ee1fa;
    }
    .ivu-table-row-hover td{
        background-color: #8ee1fa !important;
    }
</style>
