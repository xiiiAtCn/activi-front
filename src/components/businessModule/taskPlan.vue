<template>
    <div class="layout">
        <Col span="4">
            <div class="leftMenu">
                <Tree :data="treeData" :load-data="getChildNode" @on-select-change="selectedCurrentNode"></Tree>
            </div>
        </Col>
        <Col span="20">
        <div class="rightContent">
            <Row>
                <!--<tableF-Shim/>-->
            </Row>
            <!--<Row>-->
            <!--<Table :columns="columns" :data="data"></Table>-->
            <!--</Row>-->
            <!--<Row class="toTop">-->
            <!--<Tabs type="card" :animated="noCssTransition" v-if="childInfo.length > 0">-->
            <!--<TabPane v-for="(item,index) in childInfo" :label="item.childMeta" :key="index">-->
            <!--<Table :columns="item.childColumns" :data="item.childData"></Table>-->
            <!--</TabPane>-->
            <!--</Tabs>-->
            <!--</Row>-->
        </div>
        </Col>
    </div>
</template>

<script>
    import _ from 'lodash'
    import {dispatch} from  '../../utils/actionUtils'
    export default{
        data () {
            return {
                urls: {
                    // 获取跟节点
                    getRootNode: '/api/tree/root-node'
                },
                // 定义树
                treeData: [
                    {
                        title: 'parent1',
                        loading: false,
                        children: []
                    },
                    {
                        title: 'parent2'
                    },
                    {
                        title: 'parent3'
                    },
                    {
                        title: 'parent4',
                        loading: false,
                        children: []
                    }
                ],
            }
        },
        methods: {
            getChildNode (item, callback) {
//                this.setUrl(item.childUrl).forGet(res => {
//                    setTimeout(() => {
//                        callback(res)
//                    }, 400)
//                })
                setTimeout(() => {
                    const data = [
                        {
                            title: 'children',
                            loading: false,
                            children: []
                        },
                        {
                            title: 'children',
                            loading: false,
                            children: []
                        }
                    ];
                    callback(data);
                }, 400)
            },
            selectedCurrentNode (currentNode) {
                dispatch(currentNode[0]['action'])
            },
            getRootNode (rootNodeUrl, id, boMetaId, rootBoole = true) {
                let url = `${rootNodeUrl}?id=${id}&boMetaId=${boMetaId}&isRoot=${rootBoole}`
                this.setUrl(url).forGet(body => {
                    console.log('cs：', body)
                    this.treeData = body
                })
            }
        },
        mounted () {
//            this.getRootNode(
//                this.urls.getRootNode,
//                this.$route.params['nodeId'],
//                this.$route.params['nodeMetaId']
//            )
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
