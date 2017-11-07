<template>
    <Tree :data="treeData" :load-data="getChildNode" @on-select-change="selectedCurrentNode"></Tree>
</template>

<script>
    import _ from 'lodash'
    //    import {dispatch} from  '../../../utils/actionUtils'
    export default{
        data () {
            return {
                urls: {
                    // 获取跟节点
                    getRootNode: '/api/tree/root-node'
                },
                // 关闭tab切换滑动效果
                noCssTransition: false,
                // 定义树
                treeData: []
            }
        },
        methods: {
            getChildNode () {
//                this.setUrl(item.childUrl).forGet(res => {
//                    setTimeout(() => {
//                        callback(res)
//                    }, 400)
//                })
                setTimeout(() => {
                    const data = [
                        {
                            title: '还有',
                            loading: false,
                            children: []
                        },
                        {
                            title: '其实还有',
                            loading: false,
                            children: []
                        }
                    ]
                    callback(data)
                }, 400)
            },
            selectedCurrentNode () {

            }
        },
        mounted () {
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
