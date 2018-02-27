<template>
    <div class="extract-config-container">
        <Row>
            <Col span="12">
                <h1>抽取一览规则</h1>
            </Col>
            <Col span="12" class="button-area">
                <ButtonGroup>
                    <Button @click="save">保存</Button>
                    <Button @click="addRule">添加规则</Button>
                    <Button @click="delRule">删除选中规则</Button>
                    <Button @click="exit">退出</Button>
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
import { fetchDir } from './constant'
import _ from 'lodash'

const tableDefine = [
    {
        key: 'metaId',
        title: 'metaId',
        type: 'select'
    },
    {
        key: 'key',
        title: '字段key',
        type: 'select'
    },
    {
        key: 'rule',
        title: '规则',
        type: 'select'
    }
]

const ruleTypeList = [
    {
        label: 'item',
        value: 'item'
    },
    {
        label: 'avg',
        value: 'avg'
    },
    {
        label: 'sum',
        value: 'sum'
    },
    {
        label: 'count',
        value: 'count'
    }
]

// table添加行的行id
let generateId = 0

export default {
    components: {
        ConfigTable
    },
    data () {
        return {
            tableDefine: [],
            tableData: [],
            tableDataWidthOption: [],
            currentRow: null,
            templateId: '',
            metaList: [],
            showMetaList: [],
            // 缓存的keyList key: metaid, value: 下拉选项
            cacheKeyList: {},
            // 显示的keyList key：metaid, value: 下拉选项
            showKeyList: {}
        }
    },
    mounted () {
        this.templateId = this.$router.currentRoute.params.tokenId
        this.$watch('tableData', () => {
            this.addOptionToTableData()
        }, {
            deep: true
        })
        this.init()
    },
    methods: {
        exit () {
            let params = this.$router.currentRoute.params
            this.$router.push({
                path: `/layoutContent/${params.id}/tokenOverview`
            })
        },
        // 添加行
        addRule () {
            this.tableData.push({
                'generateId': ++generateId
            })
        },
        delRule () {
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
        // 设置规则列option（以后应该从后台取得）
        addOptionToTableDefine () {
            tableDefine[2].option = ruleTypeList
            this.tableDefine = tableDefine
        },
        init () {
            this.addOptionToTableDefine()

            this.getTableData().then(this.getMetaList())
        },
        getTableData () {
            return new Promise((resolve, reject) => {
                this.setUrl(fetchDir.ruleTableData)
                    .setPathVariables({templateId: this.templateId})
                    .forGet((result, err) => {
                        if (err) {
                            this.$Message.error('获取table数据失败')
                            reject()
                        } else {
                            this.tableData = result
                            resolve()
                        }
                    })
            })
        },
        getMetaList () {
            this.setUrl(fetchDir.ruleMetaList)
                .setPathVariables({templateId: this.templateId})
                .forGet((result, err) => {
                    if (err) {
                        this.$Message.error('获取MetaList数据失败')
                    } else {
                        this.metaList = result
                    }
                })
        },
        getKeyList (id) {
            return new Promise((resolve, reject) => {
                this.setUrl(fetchDir.ruleKeyList)
                    .setPathVariables({
                        templateId: this.templateId,
                        tokenMetaId: id
                    })
                    .forGet((result, err) => {
                        if (err) {
                            this.$Message.error('获取keyList数据失败')
                            reject
                        } else {
                            this.$set(this.cacheKeyList, id, result)
                            resolve(result)
                        }
                    })
            })
        },
        async addOptionToTableData() {
            let tableData = _.cloneDeep(this.tableData)
            let metaList = _.cloneDeep(this.metaList)
            // table中所有行的metaId
            let tableMataList = []
            // key值为 metaId value为metaId对应的key数组
            let tableKeyList = {}
            let metaTable = {}
            let keyTable = {}
            for (let row of tableData) {
                let metaId = row.metaId
                tableMataList.push(metaId)

                if (tableKeyList[metaId]) {
                    tableKeyList[metaId].push(row.key)
                } else {
                    tableKeyList[metaId] = [row.key]
                }
            }
            // 生成没有选中的metaList
            this.showMetaList = []
            for (let meta of metaList) {
                if (!tableMataList.includes(meta.value)) {
                    this.showMetaList.push(meta)
                }
                metaTable[meta.value] = meta.label
            }

            this.showKeyList = {}
            let func = (rowKeyList, metaId) => {
                for (let key of rowKeyList) {
                    if (!tableKeyList[metaId].includes(key.value)) {
                        if (!this.showKeyList[metaId]) {
                            this.$set(this.showKeyList, metaId, [key])
                        } else {
                            let old = this.showKeyList[metaId].find(item => {
                                item.value === key.value
                            })
                            if (!old) {
                                debugger
                                this.showKeyList[metaId].push(key)
                            }
                        }
                    }
                    keyTable[key.value] = key.label
                }
            }
            let idList = []
            for (let row of tableData) {
                let metaId = row.metaId
                // metaId 存在
                if (!!metaId) {
                    let rowKeyList = this.cacheKeyList[metaId]
                    // 如果有缓存取缓存, 没有发请求
                    if (!rowKeyList) {
                        idList.push(metaId)
                    } else {
                        func(rowKeyList, metaId)
                    } 
                }
            }
            const getRowKeyList = async () => {
                // 发送请求
                const promises = idList.map(async id => {
                    const res = await this.getKeyList(id)
                    return res
                })
                for (let i = 0; i < promises.length; i++) {
                    const options = await promises[i]
                    func(options, idList[i])
                }
            }
            await getRowKeyList()
            
            for (let row of tableData) {
                let metaOptions = [...this.metaList]
                let metaId = row.metaId
                let key = row.key
                // if (metaId) {
                //     metaOptions.push({
                //         value: metaId, 
                //         label: metaTable[metaId]
                //     })
                // }
                let keyOptions = this.showKeyList[metaId] ? [...this.showKeyList[metaId]] : []
                if (key) {
                    keyOptions.push({
                        value: key,
                        label: keyTable[key]
                    })
                }
                row.metaId = {
                    value: metaId || '',
                    options: metaOptions
                }
                row.key = {
                    value: row.key || '',
                    options: keyOptions
                }
                row.rule = row.rule || ''
            }
            debugger
            this.tableDataWidthOption = tableData
        },

        changeModel (index, key, value) {
            this.$set(this.tableData[index], key, value)
        },
        currentChange(newRow, oldRow) {
            this.currentRow = newRow
        },
        save () {
            this.setUrl(fetchDir.saveRule)
                .setBody({
                    templateId: this.templateId,
                    rules: this.tableData
                })
                .forPost((res, err) => {
                    if (err || res.result === false) {
                        this.$Message.err(res.message ? res.message : '保存失败')
                    } else {
                        this.$Message.success("保存成功")
                        this.init()
                    }
                })
        }
    }
}
</script>
<style scoped>
.extract-config-container {
    margin: 30px;
}
.button-area {
    text-align: right;
}
</style>

