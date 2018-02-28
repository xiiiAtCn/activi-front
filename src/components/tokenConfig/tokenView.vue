<template>
    <div class="token-view-container">
        <Row>
            <Col span="12">
                <h1>库所浏览</h1>
            </Col>
            <Col span="12" class="button-area">
                <ButtonGroup>
                    <Button @click="configToken">编辑meta</Button>
                    <!-- <Button @click="active">生效</Button> -->
                    <Button @click="extractConfig">抽取一览配置</Button>
                    <Button @click="exit">退出</Button>
                </ButtonGroup>
            </Col>
        </Row>
        <Row class="content-container">
            <Col span="8" class="tree-container">
                <Tree 
                    @on-select-change="nodeClick"
                    :data="treeData">
                </Tree>
            </Col>
            <Col span="16" class="table-container">
                <ConfigTable
                    :define="tableDefine"
                    :data="tableData"
                    :disabled="true"
                    class="config-table"
                />
            </Col>
        </Row>
        <Row>
            <Col span="24" class="footer-container">
                <Table 
                    :border="true"
                    :columns="relTableColumns" 
                    :data="relTableData" 
                />
            </Col>
        </Row>
        <mLoading
            :event-bus="bus"
            event-show="token-config-show"
            event-hide="token-config-hide"
            >
        </mLoading>
    </div>
</template>
<script>
import ConfigTree from './configTree'
import ConfigTable from './configTable'
import { fetchDir, traverseTree, relTableColumns, EventType } from './constant'
import bus from 'routers/bus'
import _ from 'lodash'

const tableDefine = [
    {
        key: 'key',
        title: 'fkey',
        type: 'text'
    },
    {
        key: 'fieldName',
        title: 'fieldName',
        type: 'text'
    },
    {
        key: 'caption',
        title: 'caption',
        type: 'text'
    },
    {
        key: 'visible',
        title: 'visible',
        type: 'checkbox'
    },
    {
        key: 'required',
        title: 'required',
        type: 'checkbox'
    },
    {
        key: 'readonly',
        title: 'readonly',
        type: 'checkbox'
    }
]

export default {
    components: {
        ConfigTree,
        ConfigTable
    },
    data () {
        return {
            treeId: '',
            treeData: [],
            tableDefine: [],
            tableData: [],
            relTableData: [],
            relTableColumns: [],
            requestNum: 0,
            bus: bus
        }
    },
    mounted () {
        this.treeId = this.$router.currentRoute.params.tokenId
        this.init()
    },
    watch: {
        requestNum (val) {
            if (val == 0) {
                this.bus.$emit(EventType.hideLoading)
            } else {
                this.bus.$emit(EventType.showLoading)
            }
        }
    },
    methods: {
        init () {
            this.getRelData()
            this.getTreeData()
            this.tableDefine = _.cloneDeep(tableDefine)
            this.relTableColumns = _.cloneDeep(relTableColumns)
        },
        getTreeData () {
            this.requestNum++
            this.setUrl(fetchDir.treeData)
                .setPathVariables({templateId: this.treeId})
                .forGet((result, err) => {
                    this.requestNum--
                    if (err) {
                        this.$Message.error('获取treeData失败')
                    } else {
                        traverseTree(result['root'], node => {
                            node.expand = true
                        })
                        this.treeData = [result.root]
                    }
                })
        },
        getTableData (nodeId) {
            this.requestNum++
            this.setUrl(fetchDir.viewTableData)
                .setPathVariables({
                    templateId: this.treeId,
                    nodeId
                })
                .forGet((result, err) => {
                    this.requestNum--
                    if (err) {
                        this.$Message.error("获取tableData失败")
                    } else {
                        this.tableData = result
                    }
                })
        },
        getRelData () {
            this.requestNum++
            this.setUrl(fetchDir.relData)
                .setPathVariables({templateId: this.treeId})
                .forGet((result, err) => {
                        this.requestNum--
                        if (err) {
                            this.$Message.error('获取rel数据失败')
                        } else {
                            this.relTableData = result
                        }
                    })
        },
        nodeClick (data) {
            this.getTableData(data[0].id)
        },
        configToken () {
            let params = this.$router.currentRoute.params
            this.$router.push({
                path: `/layoutContent/${params.id}/tokenConfig?tokenId=${params.tokenId}`
            })
        },
        extractConfig () {
            let params = this.$router.currentRoute.params
            this.$router.push({
                path: `/layoutContent/${params.id}/extractConfig/${params.tokenId}`
            })
        },
        exit () {
            let params = this.$router.currentRoute.params
            this.$router.push({
                path: `/layoutContent/${params.id}/tokenOverview`
            })
        },
        active () {

        }
    }
}
</script>
<style scoped>
.token-view-container {
    margin: 30px;
}
.token-view-container
.button-area {
    text-align: right;
}
.tree-container {
    overflow-x: auto;
    border-right: 1px solid #707B7C;
}
.table-container {
    overflow-x: auto;
    direction: rtl;
}
.footer-container {
    margin-top: 30px;
}
</style>
<style>
.token-view-container
.ivu-table-wrapper {
    direction: ltr;
}
</style>