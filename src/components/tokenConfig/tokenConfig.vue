<template>
    <div class="config-page-container">
        <Row>
            <Col span="12">
                <h1>配置tokenMeta</h1>
            </Col>
            <Col span="12" class="button-area">
                <ButtonGroup>
                    <Button 
                        type="primary"
                        @click="save" 
                        :disabled="formDisabled"
                    >
                        保存
                    </Button>
                    <Button @click="exit">退出</Button>
                    <Button @click="addRow">添加行</Button>
                    <Button @click="delRow">删除选中行</Button>
                </ButtonGroup>
            </Col>
        </Row>
        <Row class="content-container">
            <Col span="8" class="tree-container">
                <ConfigTree 
                    ref="configTree"
                    :data="treeData"
                    :editable="true"
                    :nodeClick="nodeClick"
                    :nodeAdd="append"
                    :nodeDel="remove"
                />
            </Col>
            <Col span="16" class="table-container">
                <Form :label-width="120" :model="formData" :rules="formRules" ref="form">
                    <FormItem label="节点名称" prop="title">
                        <Input 
                            v-model="formData.title"
                            :disabled="formDisabled"
                        />
                    </FormItem>
                    <FormItem label="节点类型" prop="metaType">
                        <Select 
                            v-model="formData.metaType"
                            :disabled="formDisabled"
                            @on-change="changeMetaType"
                        >
                            <Option 
                                v-for="node in metaTypeList" 
                                :key="node.value" 
                                :value="node.value"
                            >
                                {{node.label}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="选择meta" prop="tokenMetaId">
                        <Select 
                            v-model="formData.tokenMetaId"
                            :disabled="formDisabled || metaDisabled"
                            @on-change="changeMeta"
                            :loading="metaListLoading"
                            loading-text="加载中"
                        >
                            <Option
                                v-for="meta in metaList"
                                :key="meta.value"
                                :value="meta.value"
                            >
                                {{meta.label}}
                            </Option>
                        </Select>
                    </FormItem>
                </Form>
                <ConfigTable
                    :define="tableDefine"
                    :data="tableData"
                    :changeModel="changeModel"
                    @on-current-change="currentChange"
                    ref="configTable"
                    class="config-table"
                />
            </Col>
        </Row>
        <Row>
            <Col span="24" class="footer-container">
            </Col>
        </Row>
        <Modal
            v-model="modal"
            :title="modalTitle"
            @on-ok="modalOK"
            @on-cancel="modalCancel">
            <p>{{modalMessage}}</p>
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
import _ from 'lodash'
import bus from 'routers/bus'

const tableDefine = [
    {
        key: 'enabled',
        title: '启用字段',
        type: 'checkbox'
    },
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

// 节点类型
const metaTypeList = [
    {
        label: 'bill',
        value: 'bill'
    },
    {
        label: 'entry',
        value: 'entry'
    },
    {
        label: 'bo',
        value: 'bo'
    }
]
// 事件类型
const EventType = {
    showLoading: 'token-config-show',
    hideLoading: 'token-config-hide'
}
// 当前编辑状态(新建节点、删除节点、编辑节点)
const EditStatus = {
    newNode: 'new',
    delNode: 'del',
    editNode: 'edit'
}

// table添加行的行id
let generateId = 0

// 与后台交互接口地址
let fetchDir = {
    metaList: "/api/placeConfig/getFormMetaList/{type}",
    treeData: "/api/placeConfig/getTreeData/{templateId}",
    formData: "/api/placeConfig/getFormData/{templateId}",
    tableData: "/api/placeConfig/getTableData/{metaId}",
    saveData: "/api/placeConfig/saveNode",
    delData: "/api/placeConfig/delNode/{templateId}/{nodeId}"
}

export default {
    components: {
        ConfigTree,
        ConfigTable
    },
    data () {
        return {
            treeData: [],
            treeTitle: '',
            treeId: '',
            tableDefine: [],
            tableData: [],
            metaTypeList: [],
            metaList: [],
            // metaList下拉加载中
            metaListLoading: true,
            formData: {
                title: '',
                metaType: '',
                tokenMetaId: ''
            },
            modal: false,
            formRules: {
                title: [
                    {
                        required: true,
                        message: '请输入节点名称'
                    }
                ]
            },
            currentRow: null,
            selectedNode: null,
            bus: bus,
            // 当前请求总数
            requestNum: 0,
            // 当前编辑状态
            editStatus: null,
            // 模态ok回调
            modalOkCB: null,
            // 模态cancel回调
            modalCancelCB: null,
            // 需要保存的模态中间变量
            modalData: null,
            // 模态标题
            modalTitle: '',
            // 模态显示信息
            modalMessage: ''
        }
    },
    computed: {
        // 禁用所有表单元素
        formDisabled () {
            return !this.selectedNode
        },
        metaDisabled () {
            return !this.formData.metaType
        }
    },
    mounted () {
        // templateId
        this.treeId = this.$router.currentRoute.query.tokenId
        this.init()
    },
    watch: {
        requestNum (val) {
            if (val == 0) {
                this.bus.$emit(EventType.hideLoading)
            } else {
                this.bus.$emit(EventType.showLoading)
            }
        },
        selectedNode (newVal, oldVal) {
            if (!!newVal && !!oldVal && newVal.nodeKey == oldVal.nodeKey) {
                return 
            }
            // 当前为编辑状态
            if (this.editStatus === EditStatus.editNode) {
                this.modal = true
            }
            // 获取节点相关数据
            this.getFormData()
        }
    },
    methods: {
        init () {
            this.getTreeData()
            this.tableDefine = _.cloneDeep(tableDefine)
            this.metaTypeList = _.cloneDeep(metaTypeList)
        },
        // 重置modal相关数据
        resetModalData () {
            // 模态ok回调
            this.modalOkCB = null
            // 模态cancel回调
            this.modalCancelCB = null,
            // 需要保存的模态中间变量
            this.modalData = null,
            // 模态标题
            this.modalTitle = '',
            // 模态显示信息
            this.modalMessage = ''
        },
        //------树相关方法------
        // 调用后台接口查询树的数据
        getTreeData () {
            // 没有id直接设为空值
            if (!this.treeId) {
                this.setTreeData({
                    treeId: '',
                    treeTitle: '',
                })
            } else {
                this.requestNum++
                this.setUrl(fetchDir.treeData)
                    .setPathVariables({templateId: this.treeId})
                    .forGet((result, err) => {
                        this.requestNum--
                        if (err) {
                            this.$Message.error('获取treeData失败')
                        } else {
                            this.setTreeData(result)
                        }
                    })
            }
        },  
        // 将后台数据转为组件数据
        setTreeData (resData) {
            this.treeId = resData.treeId
            this.treeTitle = resData.treeTitle
            // 为每个节点设置初始值
            this.traverseTree(resData['root'], (node) => {
                node.expand = true
                node.add = true
                node.del = true
            })
            this.treeData = [{
                render: (h, {root, node, data}) => {
                    return h('span', {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, [
                        h('span', [
                            h('Icon', {
                                props: {
                                    type: 'ios-folder-outline'
                                },
                                style: {
                                    marginRight: '8px'
                                }
                            })
                        ]),
                        h('span', {
                            style: {
                                display: 'inline-block',
                                float: 'right',
                                marginRight: '32px'
                            }
                        }, [
                            h('Button', {
                                props: {
                                    icon: 'ios-plus-empty',
                                    type: 'primary',
                                    size: 'small',
                                    disabled: !!resData.root
                                },
                                style: {
                                    width: '52px'
                                },
                                on: {
                                    click: () => { this.append(root, node, data) }
                                }
                            })
                        ])
                    ])
                },
                expand: true,
                id: Date.now(),
                children: resData.root ? [resData.root] : []
            }]
        },
        // 添加节点 如果当前有未保存数据提示后再添加 清除未保存节点
        append (root, node, data) {
            this.modal = true
            this.editStatus = EditStatus.newNode
            this.modalData = {
                root, node, data
            }
        },
        // 删除节点
        remove (root, node, data) {
            this.modal = true
            this.editStatus = EditStatus.delNode
            this.modalOkCB = () => {
                this.setUrl(fetchDir.delData)
                    .setPathVariables({
                        templateId: this.treeId,
                        nodeId: node.node.id
                    })
                    .forGet((res, err) => {
                        if (err || !res.result) {
                            this.$Message.error(`删除失败： ${res.message ? res.message : ''}`)
                        } else {
                            this.init()
                        }
                    })
            }
        },
        // 确认添加节点
        modalOK () {
            this.modalOkCB()
            this.resetModalData()
            let {root, node, data} = this.modalData
            let delNode = root.find(el => !el.node.id)
            if (delNode) {
                let parent = root[delNode.parent].node
                let index = parent.children.indexOf(delNode)
                parent.children.splice(index, 1)
            }
            const children = data.children || []
            children.push({
                title: '新增节点',
                expand: true,
                selected: true,
                add: false,
                del: true
            })
            this.$set(data, 'children', children)

            this.resetFormData()
            this.resetConfigTableData()
            this.modalOK = null
            this.$nextTick(() => {
                this.selectedNode = this.$refs['configTree'].getSelectedNodes()[0]
            })
        },
        // 取消添加节点
        modalCancel () {
            this.modalData = null
        },
        // 点击节点
        nodeClick (root, node, data) {
            this.selectedNode = node
        },
        // 遍历树节点
        traverseTree(root, callback) {
            if (root) {
                callback(root)
                if (root.children) {
                    for (let child of root.children) {
                        this.traverseTree(child, callback)
                    }
                }
            }
        },
        //------表单相关方法------
        // 获取表单数据
        getFormData () {
            // 没有id各项为空
            if (!this.treeId) {
                this.resetFormData()
            } else {
                this.requestNum++
                this.setUrl(fetchDir.formData)
                    .setPathVariables({
                        templateId: this.treeId
                    })
                    .setQuery({
                        nodeId: this.selectedNode.node.id ? this.selectedNode.node.id : ''
                    })
                    .forGet((result, err) => {
                        this.requestNum--
                        if (err) {
                            this.$Message.error('获取formData失败')
                        } else {
                            this.formData = result
                        }
                    })
            }
        },
        // 获取meta下拉列表
        getMetaList () {
            this.metaListLoading = true
            this.requestNum++
            this.setUrl(fetchDir.metaList)
                .setPathVariables({
                    type: this.formData.metaType
                })
                .forGet((result, err) => {
                    this.requestNum--
                    this.metaListLoading = false
                    if (err) {
                        this.$Message.error('获取metaList失败')
                    } else {
                        this.metaList = result
                    }
            })
        },
        // 选中某个metaType 获取选择meta下拉
        changeMetaType (val) {
            if (!!val) {
                this.getMetaList()
            }
        },
        // 选中某个meta 获取tabledata
        changeMeta (val) {
            if (!!val) {
                this.getTableData()
            } else {
                this.resetConfigTableData()
            }
        },
        // 重置表单数据
        resetFormData () {
            this.formData = {
                title: '',
                metaType: '',
                tokenMetaId: ''
            }
        },
        //------表格相关方法------
        getTableData () {
            let nodeId = ""
            if (this.selectedNode && this.selectedNode.node && this.selectedNode.node.id) {
                nodeId = this.selectedNode.node.id
            }
            this.requestNum++
            this.setUrl(fetchDir.tableData)
                .setPathVariables({
                    metaId: this.formData.tokenMetaId
                })
                .setQuery({
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
        // 添加行
        addRow() {
            this.tableData.push({
                'generateId': ++generateId
            })
        },
        // 删除行
        delRow () {
            for (let i = 0, len = this.tableData.length; i < len; i++) {
                if (!!this.tableData[i].id) {
                    if (this.tableData[i].id === this.currentRow.id) {
                        this.tableData.splice(i, 1)
                        break
                    }
                } else {
                    if (this.tableData[i].generateId === this.currentRow.generateId) {
                        this.tableData.splice(i, 1)
                        break
                    }
                }
            }
        },
        // 切换当前选中行
        currentChange (newRow, oldRow) {
            this.currentRow = newRow
        },
        // 改变model
        changeModel (index, key, value) {
            this.$set(this.tableData[index], key, value)
        },
        // 重置表格数据
        resetConfigTableData () {
            this.tableData = []   
        },
        //------按钮操作相关方法------
        // 退出 页面跳转
        exit () {
            let params = this.$router.currentRoute.params
            this.$router.push({
                path: `/layoutContent/${params.id}/tokenOverview`
            })
        },
        // 保存
        save () {
            let result = true
            this.$refs['configTable'].validate((valid) => {
                if (!valid) {
                    result = false
                    this.$Message.error('表格数据填写有误，请核对后再保存')
                }
            }).then(() => {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        this.$Message.error('表单数据填写有误，请核对后再保存')
                    } else {
                        this.requestNum++
                        this.setUrl(fetchDir.saveData).setBody({
                            treeId: this.treeId,
                            treeTitle: this.treeTitle,
                            nodeId: this.selectedNode.node.id ? this.selectedNode.node.id : '',
                            selfId: this.selectedNode.nodeKey,
                            parentId: this.selectedNode.parent,
                            formData: this.formData,
                            tableData: this.tableData
                        }).forPost((res, err) => {
                            this.requestNum--
                            if (err || res.result === false) {
                                this.$Message.err(res.message ? res.message : '保存失败')
                            } else {
                                this.$Message.success("保存成功")
                                this.treeId = res.data.id
                                this.init()
                            }
                        })
                    }
                })
            })
        },
    }
}
</script>
<style scoped>
.config-page-container {
    margin: 30px;
}
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
</style>
<style>
.config-page-container
.ivu-table-wrapper,
.config-page-container
.ivu-form-item-content {
    direction: ltr;
}
</style>