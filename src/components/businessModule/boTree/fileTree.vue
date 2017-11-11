<template>
    <div class="layout">
        <Col span="4">
        <div class="leftMenu">
            <Tree :data="baseData" @on-select-change="onSelected" @on-toggle-expand="onExpend"></Tree>
        </div>
        </Col>
        <Col span="20">
        <div class="rightContent">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        </Col>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {default as fetch, post} from '../../../utils/DefineFetcher'
    export default {
        data () {
            return {
                baseData: [],
                showTree: true,
//                获取初始节点URL
                initNOdeUrl: '/api/fileTree/view/info',
//                获取当前节点子节点URL
                getNodeUrl: '/api/fileTree/view/infoGetLeaf/'
            }
        },
        methods: {
//            当前选中节点
            onSelected: function (selectedAry) {
                console.log('选中节点：', selectedAry)
                this.requestNOdeInfo(selectedAry, 'selected')
            },
            onExpend: function (selectedObj) {
//                清除 addChild = true的节点
                this.cleanAddChild(this.baseData)
                selectedObj['addChild'] = true
                let ary = []
                ary.push(selectedObj)
                this.requestNOdeInfo(ary, 'expend')
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
//            初始加载节点
            getInitNode: function () {
                fetch(this.initNOdeUrl, (error, body) => {
                    if (!error || error === null) {
                        this.baseData = body
                        console.log('初始加载节点：', body)
                        this.requestNOdeInfo(body, 'selected')
                    }
                })
            },
//            递归当前选中节点
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
//            返回节点信息，传参到子组件
            requestNOdeInfo: function (ary, style) {
                let url = this.getNodeUrl + ary[0]['childId'] + '/' + ary[0]['childMetaId']
                fetch(url, (error, body) => {
                    if (!error || error === null) {
                        console.log('子节点查询结果：', body)
                        if (style === 'selected') {
                            this.getArray(this.baseData, body)
                            let child = []
                            for (let i of body) {
                                child.push({
                                    childMetaId: i.childMetaId,
                                    childBoId: i.childId,
                                    childTitle: i.title
                                })
                            }
                        //  向下传参
                            this.$router.push({
                                name: 'fileDetails',
                                query: {
                                    metaId: ary[0]['childMetaId'],
                                    boId: ary[0]['childId'],
                                    selectedAry: ary[0],
                                    child: child
                                }
                            })
                        } else if (style === 'expend') {
                            this.getHaveChild(this.baseData, body)
                        }
                    }
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
        border-left: 1px solid #dddddd;
    }
</style>