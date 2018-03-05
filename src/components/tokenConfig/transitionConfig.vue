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
                    <Button @click="delRow">
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
    </div>
</template>
<script>
import ConfigTable from './configTable'
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
        ConfigTable
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
                    key: 'input',
                    title: '输入',
                    type: 'select'
                },
                {
                    key: 'output',
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
                                        this.setMeta()
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
            configList: []
        }
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
            this.getConfigList()
        },
        addRow () {
            this.tableData.push({
                'generateId': ++generateId
            })
        },
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
        changeModel (index, key, value) {
            this.$set(this.tableData[index], key, value)
        },
        currentChange (newRow, oldRow) {
            this.currentRow = newRow
        },
        addOptionToTableData () {
            let tableData = _.cloneDeep(this.tableData)

            for (let row of tableData) {
                row.input = {
                    value: row.input,
                    options: this.configList
                }
                row.output = {
                    value: row.output,
                    options: this.configList
                }
            }

            this.tableDataWidthOption = tableData
        },
        getConfigList () {
            this.setUrl(fetchDir.configList)
                .forGet((result, err) => {
                    if (err) {
                        this.$Message("获取table数据失败")
                    } else {
                        this.configList = result
                    }
                })
        },
        save () {

        },
        setMeta() {
            debugger
        }
    }
}
</script>
<style scoped>
.transition-config {
    margin: 30px;
}
.button-area {
    text-align: right;
}
</style>
