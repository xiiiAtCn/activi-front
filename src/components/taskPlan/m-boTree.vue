<template>
    <div>
        <Tree :data="treeData" :load-data="getChildNode" @on-select-change="selectedCurrentNode"></Tree>
    </div>
</template>

<script>
    import mixin from '../mixin'
    export default{
        mixins: [mixin],
        data () {
            return {
                // 树结构
                treeData: []
            }
        },
        methods: {
            getChildNode (item, callback) {
                this.getData(item.children, (data, err) => {
                    if (data) {
                        setTimeout(() => {
                            callback(data)
                        })
                    }
                })
            },
            selectedCurrentNode (currentNode) {
            	console.log('当前节点：', currentNode[0])
            },
            getTreeData () {
                this.getData('treeData', (data, err) => {
                    if (data) {
                        this.treeData = this.treeNodeShow(data)
                    }
                })
            },
            // 判断当前节点展示方式为 有子节点 或 无子节点
            treeNodeShow (treeData) {
                for (let i of treeData) {
                    if (i.leaf === false) {
                        delete i.children
                    } else {
                        i.loading = false
                        i.children = []
                    }
                }
                return treeData
            },
//            watchValuesChanged () {
//                this.getTreeData()
//            }
        },
        mounted () {
            console.info('mBoTree work')
            this.getTreeData()
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
