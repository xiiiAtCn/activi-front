<template>
    <div>
        <Row class="top-content">
            <Col span="2" offset="22">
            <Poptip placement="bottom">
                <Button type="primary" icon="grid"></Button>
                <div class="api" slot="content">
                    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                        <Checkbox :indeterminate="indeterminate"
                                  :value="checkAll"
                                  @click.prevent.native="handleCheckAll">全选</Checkbox>
                    </div>
                    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                        <div v-for='item in dataList'>
                            <Checkbox :label="item.label"></Checkbox>
                        </div>
                    </CheckboxGroup>
                </div>
            </Poptip>
            </Col>
            <Col span="14">
                <div v-for="item in operation"  class="button-container" >
                    <Button  :type="item.type?item.type:'primary'"  @click="handleTopButton(item.url)">{{item.text}}</Button>
                </div>
            </Col>
            <Col span="8" v-show="search">
                <div class="search">
                    <Input v-model="valueSearch" placeholder="筛选">
                    <Button slot="append" icon="ios-search" @click="handleTopSearch"></Button>
                    </Input>
                </div>
            </Col>
        </Row>
        <div>
            <Table border :columns="columnsData" :data="dataTable"></Table>
        </div>
    </div>
</template>
<script>
    import bus from '../router/bus'
    import { dispatch } from 'utils/actionUtils'
    import _ from 'lodash'

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
                default: false
            }
        },
        data () {
            return {
                columnsData:[],
                columnsDataCopy:[],
                dataTable:[],
                valueSearch:'',

                //列选择控制
                indeterminate: false,
                checkAll: true,
                checkAllGroup: [],
                dataList: [],
                dataListChange: [],
                testList: []
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
            }
        },
        mounted () {
            console.log('mTableF run')
        },
        methods: {
            // 配置表格
            handleDefine () {
                this.getColumnsDataWay(this.cols)
                this.operation && this.pushTopButtonMsg(this.operation)
                this.showModalBtn && this.showButton(this.showModalBtn)
            },
            // columnsData存入设置
            getColumnsDataWay (c) {
                c.forEach((val, i) => {
                    this.columnsData[i] = {
                        title: val.text,
                        key: val.field,
                        width: val.text.length*14+40,
                        render: (h, params) => {
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
                                return h(
                                    'div', [
                                        h('span', params.row[val.field])
                                    ]
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
                this.checkAllGroup = this.testList
                this.dataListChange = this.testList
            },
            //配置操作的按钮
            showButton(smb){
                if(this.columnsData[this.columnsData.length-1].key === 'action'){
                    return
                }
                this.columnsData.push({
                    title: '操作',
                    key: 'action',
                    width: 120,
                    align: 'center',
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
            // tableData存入行数据
            handleContent () {
                this.dataTable = this.rowsContent
            },

            //处理顶部按钮
            handleTopButton(url){
                dispatch(url)
            },
            // 发送搜索事件数据
            handleTopSearch () {
                bus.$emit('topSearchMsg', this.valueSearch)
                console.log(this.valueSearch)
            },
            //处理表内按钮点击
            handleButtonClick(params,row){
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
                    this.checkAllGroup = this.testList;
                    this.columnsData = this.columnsDataCopy
                } else {
                    this.checkAllGroup = [];
                    this.columnsData =[]
                }
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
            },
            handleColumnsData(obj){
                if(!obj){
                    return
                } else if(obj.method === 'remove'){
                    this.columnsData.forEach((val,i)=>{
                        if(val.title === obj.str){
                            this.columnsData.splice(i, 1)
                        }
                    })
                }else if(obj.method === 'add'){
                    this.columnsDataCopy.forEach((val)=>{
                        if(val.title === obj.str){
                            this.columnsData.push(val)
                        }
                    })
                }

            },
            //判断数组不同值
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
                for(let i=0;i<arr1.length;i++){
                    let val = arr1[i]
                    str = val
                    for(let j=0;j<arr2.length;j++){
                        if(val === arr2[j]){
                            str =''
                            break
                        }
                    }
                    if(str !== ''){
                        break
                    }
                }
                obj.str= str
                return obj
            }
        }
    }
</script>
<style scoped>
    .button-container{
        display: inline-block;
        min-width:65px;
        margin-right: 8px;
    }
    .top-content{
        margin-bottom: 10px;
    }
</style>
