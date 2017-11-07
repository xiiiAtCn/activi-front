<template>
    <div class="layout">
        <Col span="4">
            <div class="leftMenu">
                <Tree :data="baseData" @on-select-change="onSelected" @on-toggle-expand="onExpend"></Tree>
            </div>
        </Col>
        <Col span="20">
            <div class="rightContent">
                <Row>
                    <Table :columns="columns" :data="data"></Table>
                </Row>
                <Row class="toTop">
                    <Tabs type="card" :animated="noCssTransition" v-if="childInfo.length > 0">
                        <TabPane v-for="(item,index) in childInfo" :label="item.childMeta">
                            <Table :columns="item.childColumns" :data="item.childData"></Table>
                        </TabPane>
                    </Tabs>
                </Row>
            </div>
        </Col>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                baseData: [],
                showTree: true,
//                获取初始节点URL
                initNOdeUrl: '/api/boViewTree/view/info',
//                获取当前节点子节点URL
                getNodeUrl: '/api/boViewTree/view/infoGetLeaf/',
//                获取当前节点的详细信息
                getNodeDetailsUrl: '/api/boViewTree/view/infoDetails/',
                columns: [],
                data: [],
                childInfo: [],
//                去掉tab切换css动画
                noCssTransition: false
            }
        },
        methods: {
//            当前选中节点
            onSelected: function (selectedAry) {
                this.requestCurrentNodeInfo(selectedAry)
            },
            onExpend: function (selectedObj) {
//                清除 addChild = true的节点
                this.cleanAddChild(this.baseData)
                selectedObj['addChild'] = true
                let ary = []
                ary.push(selectedObj)
                this.requestChildNode(ary, 'expend')
            },
//            初始加载节点
            getInitNode: function () {
                this.setUrl(this.initNOdeUrl).forGet(res => {
                    this.baseData = res
                    this.requestChildNode(res, 'selected')
                    this.requestCurrentNodeInfo(res)
                })
            },
//            递归当前节点，选中当前选择的节点，并把返回的节点插入到选中的节点上
            getArray: function (data, child) {
                for (let i in data) {
                    if (data[i].selected === true) {
                        data[i].children = child
                        break
                    } else {
                        this.getArray(data[i].children, child)
                    }
                }
            },
//            递归当前节点，选中当前有addChild的节点
            getHaveChild: function (data, child) {
                for (let i in data) {
                    if (data[i].addChild === true) {
                        data[i].children = child
                        break
                    } else {
                        this.getHaveChild(data[i].children, child)
                    }
                }
            },
            cleanAddChild: function (data) {
                for (let i in data) {
                    if (data[i].addChild === true) {
                        delete data[i].addChild
                        break
                    } else {
                        this.cleanAddChild(data[i].children)
                    }
                }
            },
//            返回当前树节点的子节点
            requestChildNode: function (ary, style) {
                let url = `this.getNodeUrl${ary[0]['id']}`
                this.setUrl(url).forGet(res => {
                    if (style === 'selected') {
                        this.getArray(this.baseData, res)
                    } else if (style === 'expend') {
                        this.getHaveChild(this.baseData, res)
                    }
                })
            },
//            返回当前节点的详细信息
            requestCurrentNodeInfo: function (ary) {
                let detailUrl = `this.getNodeDetailsUrl${ary[0]['id']}`
                this.setUrl(detailUrl).forGet(res => {
                    this.columns = res.columns
                    this.data = res.data
                    this.childInfo = res.childInfo
                })
            }
        },
        mounted () {
            this.getInitNode()
    }
    }
</script>

<style>
    /*树菜单样式*/
    .ivu-tree ul li {
        /*margin: 12px 0;*/
        font-size: 16px;
    }
    .ivu-tree-arrow {
        width: 26px;
        height: 26px;
        display: block;
        float: left;
        text-align: center;
    }
    .ivu-tree-title {
        border: 1px solid #d5e8fc;
        padding: 0 10px;
    }
    .ivu-tree-title-selected {
        background: #2d8cf0;
        color: white;
        border: 1px solid #2d8cf0;
    }
    .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
        border: 1px solid #2d8cf0;
        background: #2d8cf0;
    }
</style>

<style scoped>
    /*外层*/
    .layout{
        padding: 20px 24px;
    }
    /*左侧树菜单*/
    .leftMenu {
        width: 100%;
        min-height: 600px;
    }
    /*右侧动态路由*/
    .rightContent {
        width: 100%;
        min-height: 600px;
        margin: 8px 0;
        padding: 10px;
        /*border-left: 1px solid #dddddd;*/
    }
    .toTop {
        margin-top: 26px;
    }
</style>
