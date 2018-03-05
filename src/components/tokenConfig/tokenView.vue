<template>
    <div class="token-view-container">
        <Row>
            <Col span="12">
                <h1>库所浏览</h1>
            </Col>
            <Col span="12" class="button-area">
                <ButtonGroup>
                    <Button @click="configToken">编辑meta</Button>
                    <Button @click="active" :disabled="activeBtnDis">生效</Button>
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
                <Form class="title-form" :label-width="120" :model="titleForm">
                    <FormItem label="库所名称" prop="title">
                        <Input 
                            :disabled="true"
                            v-model="titleForm.title"
                        />
                    </FormItem>
                </Form>
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
        <Modal
            v-model="modal"
            :title="modalTitle"
            @on-cancel=""
        >
            <p class="modal-message">{{modalMessage}}</p>
            <div slot="footer">
                <Button
                    @click="modalCancel"
                    v-show="!!cancelMsg"
                    type="error"
                >
                    {{cancelMsg}}
                </Button>
                <Button 
                    type="primary" 
                    :long="!cancelMsg" 
                    :size="!cancelMsg ? 'large' : null" 
                    @click="modalOK"
                >
                    {{okMsg}}
                </Button>
            </div>
        </Modal> 
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
import mixin from './mixin'
import { 
    fetchDir, 
    traverseTree, 
    relTableColumns, 
    TempTemplateId,
    CacheStatus,
    PageNames,
} from './constant'
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
    },
    {
        key: 'type',
        title: 'type',
        type: 'text'
    }
]

export default {
    mixins: [mixin],
    components: {
        ConfigTree,
        ConfigTable
    },
    data () {
        return {
            pageName: PageNames.viewPage,
            treeData: [],
            tableDefine: [],
            tableData: [],
            relTableData: [],
            relTableColumns: [],
            titleForm: {
                title: ''
            }
        }
    },
    computed: {
        // 生效按钮disabled状态
        activeBtnDis () {
            return !this.activeId
        }
    },
    methods: {
        init () {
            this.validatePageStatus(() => {
                this.getTreeData()
            })
            this.tableDefine = _.cloneDeep(tableDefine)
            this.relTableColumns = _.cloneDeep(relTableColumns)
        },
        getTreeData () {
            this.requestNum++
            this.setUrl(fetchDir.treeData)
                .setPathVariables({
                    templateId: this.templateId,
                    cache: this.cache
                })
                .forGet((res, err) => {
                    this.requestNum--
                    if (err || !res.success) {
                        this.$Message.error(res.message ? res.message : '获取treeData失败')
                    } else {
                        traverseTree(res.data['root'], node => {
                            node.expand = true
                        })
                        this.treeData = [res.data.root]
                        this.$set(this.titleForm, 'title', res.data.treeTitle)
                        this.getRelData()
                    }
                })
            
        },
        getTableData (nodeId) {
            this.requestNum++
            this.setUrl(fetchDir.viewTableData)
                .setPathVariables({
                    templateId: this.templateId,
                    nodeId
                })
                .forGet((res, err) => {
                    this.requestNum--
                    if (err || !res.success) {
                        this.$Message.error(res.message ? res.message : "获取tableData失败")
                    } else {
                        this.tableData = res.data
                    }
                })
        },
        getRelData () {
            this.requestNum++
            this.setUrl(fetchDir.relData)
                .setPathVariables({templateId: this.templateId})
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
            this._goToEditPage()
        },
        extractConfig () {
            this._goToRulePage()
        },
        active () {
            if (this.cache === CacheStatus.error) {
                this.$Message.error('无法生效')
                console.error(`当前树id: ${this.templateId} 与redis中树id: ${this.activeId}不同`)
            } else {
                this.requestNum++
                this.setUrl(fetchDir.active)
                    .setPathVariables({templateId: this.activeId})
                    .forGet((res, err) => {
                        this.requestNum--
                        if (err || !res.success) {
                            this.$Message.error(`${res.message ? res.message : '生效失败'}`)
                        } else {
                            this.$Message.success('生效成功')
                            this.store.setItem(TempTemplateId, '')
                            this.activeId = ''
                        }
                    })
            }
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
.title-form {
    direction: ltr;
}
.footer-container {
    margin-top: 30px;
}
.modal-message {
    font-size: 15px;
    text-align: center;
}
</style>
<style>
.token-view-container
.ivu-table-wrapper {
    direction: ltr;
}
</style>