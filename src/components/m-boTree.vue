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
                    <Table :columns="columns" :data="data"></Table>
                </Row>
                <Row class="toTop">
                    <Tabs type="card" :animated="noCssTransition" v-if="childInfo.length > 0">
                        <TabPane v-for="(item,index) in childInfo" :label="item.childMeta" :key="index">
                            <Table :columns="item.childColumns" :data="item.childData"></Table>
                        </TabPane>
                    </Tabs>
                </Row>
            </div>
        </Col>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default{
        props: {
            define: {
                type: Object,
                "default": function () {
                    return {
                        rootNode: {
                            title: '暂无数据',
                            children: [],
                        }
                    }
                }
            }
        },
        data () {
            return {
                // 关闭tab切换滑动效果
                noCssTransition: false,
                columns: [],
                data: [],
                // 定义子节点详细
                childInfo: []
            }
        },
        computed: {
            treeData () {
                return _.get(this.define, 'rootNode', {})
            }
        },
        methods: {
            getChildNode (item, callback) {
                this.setUrl(item.childUrl).forGet(res => {
                    setTimeout(() => {
                        callback(res)
                    }, 400)
                })
            },
            selectedCurrentNode (currentNode) {
                this.getChildInfo(currentNode[0]['infoUrl'])
            },
            getChildInfo (infoUrl) {
                this.setUrl(infoUrl).forGet(res => {
                    for (let i in res) {
                        this[i] = res[i]
                    }
                })
            }
        },
        mounted () {
            this.getChildInfo(this.treeData[0]['infoUrl'])
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
    .layout {
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
