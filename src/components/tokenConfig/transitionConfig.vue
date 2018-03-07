<template>
    <div class="transition-config">
        <Row>
            <Col span="12">
                <h1>变迁配置</h1>
            </Col>
            <Col span="12" class="button-area">
                <ButtonGroup>
                    <Button
                        type="primary"
                        @click="save"
                    >
                        保存
                    </Button>
                    <Button @click="addRow">
                        添加变迁
                    </Button>
                    <Button @click="delRow" :disabled="!currentRow">
                        删除变迁
                    </Button>
                    <Button @click="exit">
                        退出
                    </Button>
                </ButtonGroup>
            </Col>
        </Row>
        <div class="table-container">
            <ConfigTable
                :define="tableDefine"
                :data="tableDataWidthOption"
                :changeModel="changeModel"
                @on-current-change="currentChange"
                ref="configTable"
                class="config-table"
            />
        </div>
        <mLayer
            v-model="layer"
            @on-ok="layerOk"
            @on-cancel="layerCancel"
        >
            <MetaConfig
                :name="currentName"
                :inputId="currentInputId"
                :outputId="currentOutputId"
                :relation="currentRelation"
                :show="layer"
                :getRelation="getRelation"
            />
        </mLayer>
        <mLoading
            :event-bus="bus"
            event-show="token-config-show"
            event-hide="token-config-hide"
        >
        </mLoading>
        <Modal
            v-model="modal"
            :title="modalTitle"
            @on-cancel=""
        >
            <p class="modal-message">{{modalMessage}}</p>
            <div slot="footer">
                <Button
                    @click="modalCancel"
                >
                    {{cancelMsg}}
                </Button>
                <Button 
                    type="error" 
                    @click="modalOK"
                    :loading="delBtnLoading"
                >
                    {{okMsg}}
                </Button>
            </div>
        </Modal> 
    </div>
</template>
<script>
import ConfigTable from './configTable'
import MetaConfig from './metaConfig'
import mixin from './mixin'
import _ from 'lodash'
import {
    fetchDir,
    PageNames
} from './constant'

// table添加行的行id
let generateId = 0

export default {
    mixins: [mixin],
    components: {
        ConfigTable,
        MetaConfig
    },
    data () {
        return {
            pageName: PageNames.transitionPage,
            tableDefine: [
                {
                    key: 'name',
                    title: '变迁名称',
                    type: 'input'
                },
                {
                    key: 'inputId',
                    title: '输入',
                    type: 'select'
                },
                {
                    key: 'outputId',
                    title: '输出',
                    type: 'select'
                },
                {
                    title: 'meta关系',
                    width: '100',
                    render: (h, {row, column, index}) => {
                        return h('div', {
                            'style': {
                                'text-align': 'center'
                            }
                        }, [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.setMeta(index)
                                    }
                                }
                            }, '设置')
                        ])
                    }
                }
            ],
            tableData: [],
            tableDataWidthOption: [],
            currentRow: null,
            configList: [],
            layer: false,
            // 当前选中row
            index: null,
            delBtnLoading: false,
            setRelationFlag: false,
            inputShowOption: [],
            outputShowOption: {}
        }
    },
    computed: {
        currentRowData () {
            return this.tableData[this.index] || {}
        },
        currentName () {
            return this.currentRowData.name || ''
        },
        currentInputId () {
            return this.currentRowData.inputId || ''
        },
        currentOutputId () {
            return this.currentRowData.outputId || ''
        },
        currentRelation () {
            return this.currentRowData.rels || []
        },
        // todo 不确定对应关系
        // configListMap () {
        //     let result = {}
        //     for (let option of this.configList) {
        //         result[option.value] = option
        //     }
        //     return result
        // }
    },
    watch: {
        tableData: {
            deep: true,
            handler () {
                this.addOptionToTableData()
            }
        }
    },
    methods: {
        init () {
            this.resetPageData()
            this.validatePageStatus(() => {
                this.getConfigList()
            })
        },
        resetPageData () {
            this.tableData = []
            this.tableDataWidthOption = []
            this.currentRow = null
            this.configList = []
            this.layer = false
            this.index = null
            this.delBtnLoading = false
        },
        addRow () {
            this.tableData.push({
                'generateId': ++generateId,
                '_edit': true
            })
        },
        delRow () {
            for (let i = 0, len = this.tableData.length; i < len; i++) {
                debugger
                // 有id调接口删除
                if (!!this.tableData[i].id && this.tableData[i].id === this.currentRow.id) {
                    // 显示modal 确认后删除
                    this.showDelModal(this.currentRow.id)
                    break
                } else {
                    if (!!this.tableData[i].generateId && this.tableData[i].generateId === this.currentRow.generateId) {
                        this.tableData.splice(i, 1)
                        break
                    }
                }
            }
            this.currentRow = null
        },
        changeModel (index, key, value) {
            // 改变对应的值
            this.$set(this.tableData[index], key, value)
            // 状态改为已编辑
            this.$set(this.tableData[index], '_edit', true)
            // 如果更改下拉 将关联删除 重新计算显示的option
            if (key === 'inputId' || key === 'outputId') {
                this.$set(this.tableData[index], 'rels', [])
                // todo 不确定对应关系
                // this.calculateShowOption()
            }
        },
        currentChange (newRow, oldRow) {
            this.currentRow = newRow
        },
        addOptionToTableData () {
            let tableData = _.cloneDeep(this.tableData)
            // todo 不确定对应关系
            // let inputShowOption = _.cloneDeep(this.inputShowOption),
            //     inputRowOption = [],
            //     outputShowOption = _.cloneDeep(this.outputShowOption),
            //     outputRowOption = []
            for (let row of tableData) {
                // todo 不确定对应关系
                // if (!!row.inputId) {//input有值将自己添加进去
                //     inputRowOption = inputShowOption.concat([this.configListMap[row.inputId]])
                //     debugger
                //     if (!!row.outputId) {// output有值将自己添加进去
                //         outputRowOption = outputShowOption[row.inputId].concat([this.configListMap[row.outputId]])
                //     } else {
                //         outputRowOption = outputShowOption[row.inputId]
                //     }
                // } else {
                //     inputRowOption = inputShowOption
                //     outputRowOption = [{label: '', value: ''}]
                // }
                
                row.inputId = {
                    value: row.inputId,
                    options: this.configList
                }
                row.outputId = {
                    value: row.outputId,
                    options: this.configList
                }
            }

            this.tableDataWidthOption = tableData
        },
        // 获取table数据
        getTableData () {
            this.requestNum++
            this.setUrl(fetchDir.findAllTransition)
                .forGet((result, err) => {
                    this.requestNum--
                    if (err) {
                        this.$Message("获取table数据失败")
                    } else {
                        this.tableData = result.data
                        // todo 不确定对应关系
                        // this.calculateShowOption()
                    }
                })
        },
        // 获取下拉数据
        getConfigList () {
            this.requestNum++
            this.setUrl(fetchDir.configList)
                .forGet((result, err) => {
                    this.requestNum--
                    if (err) {
                        this.$Message("获取下拉数据失败")
                    } else {
                        this.configList = result
                        this.getTableData()
                    }
                })
        },
        // 删除指定id的变迁
        delTranstion (id) {
            return new Promise((resolve, reject) => {
                this.requestNum++
                this.setUrl(fetchDir.delTransition)
                    .setPathVariables({
                        id: id
                    })
                    .forGet((result, err) => {
                        this.requestNum--
                        if (err || !result.success) {
                            this.$Message.error(result.message || "删除失败")
                            reject()
                        } else {
                            this.$Message.success("删除成功")
                            resolve()
                        }
                    })
            })
        },
        save () {
            const data = this.tableData.filter(row => row._edit)
            if (!!data && data.length > 0) {
                this.requestNum++
                this.setUrl(fetchDir.saveTransition)
                    .setBody(data)
                    .forPost((result, err) => {
                        this.requestNum--
                        if (err || !result.success) {
                            this.$Message(result.message || "保存失败")
                        } else {
                            this.init()
                        }
                    })
            } else {
                this.$Message.info('当前没有编辑过的数据')
            }
        },
        setMeta(index) {
            this.index = index
            this.layer = true
        },
        getRelation (data) {
            if (this.setRelationFlag) {
                this.$set(this.tableData[this.index], 'rels', data)
                this.$set(this.tableData[this.index], '_edit', true)
            }
            this.setRelationFlag = false
        },
        layerOk () {
            this.setRelationFlag = true
        },
        layerCancel () {
            this.setRelationFlag = false
        },
        showDelModal (id) {
            debugger
            this.modalTitle = "是否删除"
            this.modalMessage = "请确认是否要删除当前数据"
            this.modalOK = () => {
                this.delBtnLoading = true
                this.delTranstion(id)
                    .then(() => {
                        this.init()
                        this.delBtnLoading = false
                        this.modal = false
                    })
                
            }
            this.okMsg = "确认删除"
            this.modalCancel = () => {
                this.modal = false
            }
            this.cancelMsg = "取消"

            this.modal = true
        },
        // 计算当前显示的option
        calculateShowOption() {
            // key: id value: [options]
            let tempMap = {}
            let key = ''
            for (let i = 0; i < this.configList.length; i++) {
                key = this.configList[i].value
                tempMap[key] = _.cloneDeep(this.configListMap)
                // output 与input不能相同
                delete tempMap[key][key]
            }
            // 删除当前存在的
            for (let row of this.tableData) {
                if (!!row.inputId && !!row.outputId) {
                    delete tempMap[row.inputId][row.outputId]
                }
            }
            // 构建当前需要显示的
            let inputList = _.cloneDeep(this.configList),
                outputListMap = {},
                inputFilterIdArr = []
            for (let value in tempMap) {
                // 已经都选了
                if (!tempMap[value]) {
                    inputFilterIdArr.push(value)
                    outputListMap[value] = []
                } else {
                    outputListMap[value] = []
                    for (let optionValue in tempMap[value]) {
                        outputListMap[value].push(tempMap[value][optionValue])
                    }
                }
            }
            inputList = inputList.filter(item => !inputFilterIdArr.includes(item.value))
            this.inputShowOption = inputList
            this.outputShowOption = outputListMap
        }
    }
}
</script>
<style scoped>
.transition-config {
    margin: 30px;
    margin-bottom: 200px; 
}
.button-area {
    text-align: right;
}
</style>
