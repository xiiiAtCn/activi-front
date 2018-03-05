<template>
    <div class="resource-select">
        <Row>
            <Col span="12">
                <h1>资源选择</h1>
            </Col>
            <Col span="12" class="button-area">
                <ButtonGroup>
                    <Button
                        type="primary"
                        @click="save"
                    >
                        保存
                    </Button>
                    <Button @click="exit">
                        退出
                    </Button>
                </ButtonGroup>
            </Col>
        </Row>
        <div class="table-container">
            <ConfigTable
                :define="tableColumns"
                :data="tableData"
                :changeModel="changeModel"
                ref="table"
            />
        </div>
        <mLoading
            :event-bus="bus"
            event-show="token-config-show"
            event-hide="token-config-hide"
        >
        </mLoading>
    </div>
</template>
<script>
import ConfigTable from './configTable'
import mixin from './mixin'
import {
    fetchDir,
    PageNames,
    TempTemplateId
} from './constant'


export default {
    mixins: [mixin],
    components: {
        ConfigTable
    },
    data () {
        return {
            pageName: PageNames.resourcePage,
            tableColumns: [
                {
                    width: 60,
                    key: '_checked',
                    type: 'checkbox'
                },
                {
                    key: 'id',
                    title: 'ID',
                    type: 'text'
                },
                {
                    key: 'name',
                    title: '资源名称',
                    type: 'text'
                }
            ],
            tableData: []
        }
    },
    methods: {
        init () {
            this.tableData = []
            this.validatePageStatus(() => {
                // 获取table数据
                this.getTableData()
            })
        },
        getTableData () {
            this.requestNum++
            this.setUrl(fetchDir.resourceList)
                .forGet((result, err) => {
                    this.requestNum--
                    if (err) {
                        this.$Message("获取table数据失败")
                    } else {
                        this.tableData = result
                    }
                })
        },
        selectChange (data, row) {
            let idArr = []
            idArr.push(row.id)
            this.tableData.forEach((row, index) => {
                if (!idArr.includes(row.id)) {
                    this.$set(row, '_checked', false)
                } else {
                    this.$set(row, '_checked', true)
                }
            })
        },
        changeModel (index, key, value) {
            this.$set(this.tableData[index], key, value)
            this.tableData.forEach((row, i) => {
                if (i != index) {
                    this.$set(this.tableData[i], key, false)
                }
            })
        },
        save () {
            const selectedRow = this.tableData.filter(row => row._checked)
            const data = []
            if (!!selectedRow && selectedRow.length > 0) {
                selectedRow.forEach(row => {
                    data.push(row.id)
                })
            }
            this.requestNum++
            this.setUrl(fetchDir.saveResource)
                .setBody({
                    templateId: this.templateId,
                    resources: data
                })
                .forPost((res, err) => {
                    this.requestNum--
                    if (err || res.result === false) {
                        this.$Message.err(res.message ? res.message : '保存失败')
                    } else {
                        this.$Message.success("保存成功")
                        this.store.setItem(TempTemplateId, res.data.id)
                        this.activeId = res.data.id
                        this.init()
                    }
                })
        }
    }
}
</script>
<style scoped>
.button-area {
    text-align: right;
}
.resource-select {
    margin: 30px;
}
</style>

