<template>
    <div style="margin-bottom: 30px">
        <div class="top-btn-container">
            <Button-group >
                <Button class="kong" type="primary">新建</Button>
                <Button class="kong" type="primary">删除</Button>
                <Button class="kong" type="primary">格式模板导出</Button>
                <Button class="kong" type="primary">EXCEL模板导出</Button>
                <Button class="kong" type="primary">EXCEL导入</Button>
            </Button-group>
            <Button class="kong backBtn" type="info" @click="back">返回</Button>
        </div>
        <div>
            <Button-group size="small" class="nav-btn-container">
                <template v-if="template.name">
                    <div class="nav-btn">
                    <Tag type="border" color="red">
                        <span class="nav-btn-text">{{template.name}}</span>
                    </Tag>
                </div>
                <Icon type="chevron-right" class="kong"></Icon>
                </template>
                <div class="nav-btn" :key="button.btn.id" v-for="(button, index) in querys">
                    <Tag @on-close="delAttr(button)" type="border" closable color="red">
                        <span class="nav-btn-title">{{button.title || 'metas'}}:</span>
                        <span class="nav-btn-text">{{button.btn.name}}</span>
                    </Tag>
                    <Icon type="chevron-right" class="kong" v-show="index != querys.length - 1 && button.type != 'tracker'"></Icon>
                </div>
            </Button-group>
        </div>
        <div class="chooseCard">
            <Row class="flexCenter">
                <Col span="3">
                    <h3>{{template.name || 'metas'}}</h3>
                </Col>
                <Col span="21">
                    <Button-group size="small" >
                        <Button :key="meta.id" v-for="meta in metaList" type="ghost" @click="replaceMeta(meta.id, meta.name)" class="kong">{{meta.name}}</Button>
                        <Button @click="addMeta" type="primary">添加</Button>
                    </Button-group>
                </Col>
            </Row>
            <Row class="flexCenter" :key="item.title" v-for="item in attrList">
                <Col span="2">
                    <h3>{{item.title}}</h3>
                </Col>
                <Col span="22">
                    <Button-group size="small">
                        <Button :key="tracker.id" v-for="tracker in item.trackers" type="info"
                                @click="addTracker(item.title, tracker)" class="kong">{{tracker.name}}
                        </Button>
                    </Button-group>
                </Col>
            </Row>
        </div>
        <div class="table-container">
            <Row>
                <Col span="24">
                    <Table @on-row-click="getFormData" :columns="columns" :data="tableData"></Table>
                </Col>
            </Row>
            <div class="info-form-container" v-show="infoForm">
                <Form :model="formData" class="info-form" v-if="Object.keys(currentMeta).length !== 0">
                    <FormItem :key="item.name" v-for="item in currentMeta.detailmetainfo" :label="item.alias">
                        <Input disabled v-model="formData[item.name]"></Input>
                    </FormItem>
                </Form>
                <Form :model="formData" class="info-form" v-if="Object.keys(currentMeta).length === 0">
                    <FormItem :key="item.name" v-for="item in template.detailmetainfo" :label="item.alias">
                        <Input disabled v-model="formData[item.name]"></Input>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
//    import utils from  '../../utils/utils'
    import {dispatch} from  '../../utils/actionUtils'
    import {default as fetch, post} from '../../utils/DefineFetcher'
    import _ from 'lodash'
    export default{
        props: {'define': {type: Object}},
        data() {
            return{
                metaList: [],
                attrList: [],
                tableData: [],
                columns: [],
                formData: {},
                fetchUrl: {
                    // 根据templateId获取meta(没有templateId，获取所有没有templateId的meta)
                    metaUrl: '/api/productPrice/getMetaList/{templateId}',
                    // 获取当前meta下的所有tracker
                    attrUrl: '/api/productPrice/getAttrList',
                    // 根据metaId获取table数据
                    tableMetaUrl: '/api/productPrice/searchData/metaId/',
                    // 根据商品id获取form数据
                    formUrlMeta: '/api/productPrice/getInfo/meta/',
                    // 根据商品id获取form数据
                    formUrlTemplate: '/api/productPrice/getInfo/template/',
                    // 根据templateid获取table数据
                    tableTemplateUrl: '/api/productPrice/searchData/templateId/',
                    // 根据metaId与tracker获取table数据
                    tableMetaTrackerUrl: '/api/productPrice/searchData/metaIdAndTracker',
                    // 根据templateId与tracker获取table数据
                    tableTemplateTrackerUrl: '/api/productPrice/searchData/templateIdAndTracker'
                },
                infoForm: false,
                // 当前query中的meta
                selectedMeta: {},
                // 当前真实meta
                currentMeta: {},
                // 当前选中的tracker
                selectedTrackers: []
            }
        },
        methods: {
            addMeta: function () {
            },
            // 删除选择项
            delAttr: function (button) {
                if (button.type === 'meta') {
                    this.selectedMeta = {}
                    this.currentMeta = {}
                    this.selectedTrackers = []
                } else {
                    this.selectedTrackers.forEach((item, i) => {
                        if (item.title === button.title && item.btn.name === button.btn.name) {
                            this.selectedTrackers.splice(i, 1)
                        }
                    })
                }
            },
            // 添加选择项
            addTracker: function (title, tracker) {
                this.selectedTrackers = _.filter(this.selectedTrackers, function (o) {
                    return o.title !== title
                })
                this.selectedTrackers.push({
                    btn: tracker,
                    title: title,
                    type: 'tracker'
                })
            },
            // 改变meta
            replaceMeta: function (metaId, metaName) {
                this.selectedTrackers = []
                if (!!metaId) {
                    this.selectedMeta = {
                        btn: {
                            id: metaId,
                            name: metaName
                        },
                        title: this.template.name,
                        type: 'meta'
                    }
                    this.currentMeta = _.filter(this.metaList, (o) => {
                        return o.id == metaId
                    })[0]
                } else {
                    this.selectedMeta = {}
                    this.currentMeta = {}
                }
            },
            getFormData: function (rowData) {
                this.infoForm = !this.infoForm
                let url = ''
                if (Object.keys(this.currentMeta).length !== 0) {
                    url = this.fetchUrl.formUrlMeta + rowData.id + '/' + this.currentMeta.id
                } else {
                    url = this.fetchUrl.formUrlTemplate + rowData.id + '/' + this.template.id
                }
                fetch(url, (status, res) => {
                    console.log("getFormData", res)
                    this.formData = res
                })
            },
            loading: function () {
                this.$Message.loading({
                    content: '努力加载中...',
                    duration: 0
                });
            },
            finish: function () {
                this.$Message.destroy()
            },
            getTrackers: function (attrList) {
                let postData = []
                attrList.forEach(function (item) {
                    postData.push({
                        alias: item.alias,
                        trackerPropertyValues: item.trackerPropertyValues
                    })
                })
                post(this.fetchUrl.attrUrl, postData, (status, body) => {
                    if(status) {
                        console.log("getTrackers", status)
                        return
                    }
                    this.attrList = body
                })
                console.log("postData", postData)
            },
            getTable: function (id, type, trackers) {
                // 生成table列定义
                let columns = []
                // checkbox
                columns.push(
                    {
                        type: 'selection',
                        width: 100,
                        align: 'center',
                        fixed: 'left'
                    }
                )
                // index
                columns.push(
                     {
                        width: 60,
                        type: 'index',
                        title: 'NO.',
                        align: 'center',
                        fixed: 'left'
                    }
                )
                // meta
                columns.push(
                     {
                        width: 120,
                        title: '商品META&ID',
                        key: 'metaName',
                        align: 'center',
                        fixed: 'left'
                    }
                )
                // 列定义
                let colDefine = []
                // 查询数据
                let url = ''
                switch(type) {
                    case 'metaId':
                        url = this.fetchUrl.tableMetaUrl + id
                        colDefine = this.currentMeta['detailmetainfo']
                        break
                    case 'templateId':
                        url = this.fetchUrl.tableTemplateUrl + id
                        colDefine = this.template['detailmetainfo']
                        break
                    case 'metaIdArr':
                        url = this.fetchUrl.tableMetaTrackerUrl
                        colDefine = this.currentMeta['detailmetainfo']
                        break
                    case 'templateIdArr':
                        url = this.fetchUrl.tableTemplateTrackerUrl
                        colDefine = this.template['detailmetainfo']
                        break
                    default :
                        break;
                }
                // 循环当前列定义
                for (let col of colDefine) {
                    columns.push(
                        {
                            title: col['alias'],
                            key: col['name'],
                            align: 'center',
                        }
                    )
                }
                this.columns = columns
                console.log("columns", columns)
                if (type.indexOf('Arr') !== -1) {
                    console.log("url", url, trackers)
                    post(url, {id: id, trackerCondition: trackers[0]}, (status, res) => {
                        console.log("tableData", res)
                        if(res) {
                            this.tableData = res
                        } else {
                            this.tableData = []
                        }
                    })
                } else {
                    fetch(url, (status, res) => {
                        console.log("tableData", res)
                        if(res) {
                            this.tableData = res
                        } else {
                            this.tableData = []
                        }
                    })
                }
            },
            back: function () {
                this.$router.go(-1);
            },
            getColByName: function (name) {
                // 查询当前meta
                let filterObj = null
                if (Object.keys(this.currentMeta).length !== 0) {
                    filterObj = this.currentMeta['detailmetainfo']
                } else {
                    filterObj = this.template['detailmetainfo']
                }
                return _.filter(filterObj, (o) => {
                            return o['alias'] == name
                        })[0]['name']
            }
        },
        mounted() {
            fetch({url: this.fetchUrl.metaUrl, templateId: this.template.id}, (status, res) => {
                console.log("getMetaList", res)
                this.metaList = res
                this.replaceMeta(this.selectMeta.id, this.selectMeta.name)
            })
        },
        computed: {
            // 前一页面选中的template
            template: function () {
//                return utils(this.define, {}, 'template')
              return _.get(this.define, 'template', {})
            },
            // 前一页面选中的meta
            selectMeta: function () {
//                let metaId = utils(this.define, '', 'metaId')
                let metaId = _.get(this.define, 'metaId', '')
//                let metaTitle = utils(this.define, '', 'metaTitle')
                let metaTitle = _.get(this.define, 'metaTitle', '')
                if(metaId !== '') {
                    return {
                        id: metaId,
                        name: metaTitle
                    }
                }
                return {}
            },
            // 当前查询条件（meta + tracker || tracker）
            querys: function () {
                if (Object.keys(this.selectedMeta).length > 0) {
                    return [this.selectedMeta, ...this.selectedTrackers]
                } else {
                    return [...this.selectedTrackers]
                }
            }
        },
        watch: {
            querys: function(newQuery) {
                console.log("query", newQuery);
                let trackers = []
                let id = ''
                let type = ''
                let attrList = null
                // 通过templateId查询
                console.log("currentMeta", this.currentMeta)
                if (Object.keys(this.currentMeta).length === 0) {
                    id = this.template.id
                    type = 'templateId'
                    newQuery.forEach((item) => {
                        let colname = this.getColByName(item.title)
                        trackers.push({
                            colname,
                            colvalue: item.btn.name
                        })
                    })
                    attrList = _.filter(this.template.detailmetainfo, function (o) {
                        return o.fieldtype == "Tracker"
                    })
                } else {// 通过metaId查询
                    type = 'metaId'
                    newQuery.forEach((item) => {
                        if (item.type !== 'meta') {
                            let colname = this.getColByName(item.title)
                            trackers.push({
                                colname,
                                colvalue: item.btn.name
                            })
                        } else {
                            id = item.btn.id
                        }
                    })
                    console.log("trackers", trackers)
                    attrList = _.filter(this.currentMeta.detailmetainfo, function (o) {
                        return o.fieldtype == "Tracker"
                    })
                }
                if (trackers.length > 0) {
                    type += 'Arr'
                }
                this.getTrackers(attrList)
                this.getTable(id, type, trackers)
            }
        }
    }

</script>
<style scoped>
    .slide-fade-enter-active {
        transition: all .6s ease;
    }
    .slide-fade-leave-active {
        transition: all .6s ease;
    }
    .slide-fade-enter, .slide-fade-leave-to{
        transform: translateX(800px);
        opacity: 0;
    }
    a.btn {
        margin-right: 5px;
    }
    .top-btn-container{
        margin-bottom: 20px;
    }
    .chooseCard {
        padding: 12px 24px;
        border: 2px solid #eeeeee;
    }
    .flexCenter {
        display: flex;
        align-items: center;
        padding: 8px;
    }
    .flexCenter:not(:last-child){
        border-bottom: 1px dashed #dddddd;
    }
    .kong {
        margin-right: 10px;
    }
    .nav-btn-container{
        margin-bottom: 5px;
    }
    .nav-btn {
        display: inline;
    }
    .close-btn {
        margin-left: 10px;
        color: red;
    }
    .nav-btn-title{
        color: black;
    }
    .nav-btn-text{
        color: red;
    }
    .btn-container{
        width:100%;
        text-align: right;
        margin-bottom: 20px;
    }
    .table-container{
        margin-top: 30px;
        position: relative;
    }
    .label-container{
        text-align: right;
        width: 60px;
        padding-right: 12px;
    }
    .price-form input{
        border-bottom: 0px !important;
    }
    .tip-container{
        margin-left: 70px;
    }
    .info-form-container{
        margin-left: 280px;
    }
    .info-form{
        position: absolute;
        top: 0;
        z-index: 2000000;
        right: 0;
        left: 280px;
        height: 400px;
        overflow-y: auto;
        opacity: 1;
        background: white;
        border: 1px solid black;
    }
    .ivu-table-fixed-body{
        height: auto !important;
    }
    .backBtn{
        float: right;
    }
</style>
