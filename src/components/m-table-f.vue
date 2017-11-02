<template>
    <div>
        <Row class="top-content">
            <Col span="16">
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
        <Table border :columns="columnsData" :data="dataTable"></Table>
    </div>
</template>
<script>
    import bus from '../router/bus'
    import { dispatch } from '../utils/actionUtils'

    export default {
        props: {
            showModalBtn:{
                type: null
            },
            operation:{
                type: null
            },
            cols:{
                type: null
            },
            rowsContent:{
                type: null
            },
            search:{
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                columnsData:[],
                dataTable:[],
                topButtonMsg:[],
                valueSearch:''
            }
        },
        watch:{
            cols(){
                //console.log("mTableF watch cols")
                this.handleDefine()
            },
            rowsContent(){
                //console.log("mTableF watch rowsContent")
                this.handleContent()
            }
        },
        mounted() {
            this.handleDefine()
            this.handleContent()
            console.log("mTableF run")
        },
        methods: {
            //配置表格
            handleDefine(){
                this.getColumnsDataWay(this.cols)
                this.operation && this.pushTopButtonMsg(this.operation)
                this.showModalBtn && this.showButton(this.showModalBtn)
            },
            //columnsData存入设置
            getColumnsDataWay(c){
                c.forEach((val,i)=> {
                    this.columnsData[i]={
                        title: val.text,
                        key: val.field,
                        render: (h, params) => {
                            if(val.icon){
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: val.icon
                                        }
                                    }),
                                    h('strong', params.row[val.field])
                                ])
                            }else{
                                return h(
                                    'div', [
                                        h('span', params.row[val.field])
                                    ]
                                )
                            }
                        }
                    }
                })
            },
            //顶部按钮数据存入
            pushTopButtonMsg(opt){
                opt.forEach((val)=>{
                    this.topButtonMsg.push(val)
                })
            },
            //配置操作的按钮
            showButton(smb){
                this.columnsData.push({
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        let buttonList = []
                        smb.forEach((val)=>{
                            buttonList.push(h('Button', {
                                props: {
                                    type: val.type,
                                    size: val.size?val.size:'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handleButtonClick(params,val)
                                    }
                                }
                            }, val.text))
                        })
                        if (buttonList.length > 0)
                            return h('div', buttonList)
                        else
                            return h()
                    }
                })
            },
            //tableData存入行数据
            handleContent(){
                this.dataTable = this.rowsContent
            },

            //处理顶部按钮
            handleTopButton(url){
              dispatch(url)
            },
            //发送搜索事件数据
            handleTopSearch(){
                bus.$emit('topSearchMsg',this.valueSearch)
                console.log(this.valueSearch)
            },
            //发送表内按钮数据
            handleButtonClick(params,val){
                bus.$emit('clickRowData',params)
                console.log(params)
                console.log(val)
            }
        }
    }
</script>
<style scoped >
    .button-container{
        display: inline-block;
        min-width:65px;
        margin-right: 8px;
    }
    .top-content{
        margin-bottom: 10px;
    }
</style>
