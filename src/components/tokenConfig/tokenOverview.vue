<template>
    <div class="config-overview">
        <h1>活动库所配置预览</h1>
        <Card class="content-container">
            <ButtonGroup>
                <Button
                    @click="linkToEditPage"
                    type="primary"
                >
                    创建库所配置
                </Button>
                <Button
                    @click="linkTotransitionPage"
                >
                    变迁配置
                </Button>
            </ButtonGroup>
            <Table
                highlight-row
                :data="tableData"
                :columns="columns" 
                @on-current-change="currentChange"
            />
        </Card>
        <Modal
            v-model="modal"
            :title="modalTitle"
            @on-cancel="modalCancel"
        >
            <p class="modal-message">{{modalMessage}}</p>
            <div slot="footer">
                <Button 
                    type="primary" 
                    long 
                    size="large" 
                    @click="modalOK"
                >
                    {{okMsg}}
                </Button>
            </div>
        </Modal> 
    </div>
</template>
<script>
import mixin from './mixin'
import { 
    fetchDir, 
    PageNames,
    TempTemplateId, 
    ErrMsg 
} from './constant'

export default {
    mixins: [mixin],
    data () {
        return {
            pageName: PageNames.listPage,
            tableData: [],
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '模板Id',
                    key: 'id',
                    align: 'center'
                },
                {
                    title: '库所名称',
                    key: 'name',
                    align: 'center'
                }
            ]
        }
    },
    methods: {
        init() {
            this.validatePageStatus(() => {
                this.getTableData()
                this.modalCancel = () => {
                    this.modal = false
                }
            })
        },
        getTableData() {
            this.setUrl(fetchDir.overviewData)
                .forGet((result, err) => {
                    if (err) {
                        this.$Message("获取table数据失败")
                    } else {
                        this.tableData = result
                    }
                })
        },
        currentChange (row) {
            this.linkToViewPage(row.id)
        },
        // 如果store中的id与要查看的id不相同，提示信息
        linkToViewPage(id) {
            this._goToViewPage(id)
        },
        linkToEditPage() {
            this._goToEditPage()
        },
        linkTotransitionPage () {
            this._goToTransitionPage()
        }
    }
}
</script>
<style scoped>
.config-overview {
    margin: 30px;
}
.config-overview
.content-container{
    text-align: right;
}
.modal-message {
    font-size: 15px;
    text-align: center;
}
</style>

