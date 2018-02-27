<template>
    <div class="config-overview">
        <h1>库所预览</h1>
        <Card class="content-container">
            <ButtonGroup>
                <Button
                    @click="linkToEditPage()"
                    type="primary"
                >
                    创建库所
                </Button>
            </ButtonGroup>
            <Table
                :data="tableData"
                :columns="columns" />
        </Card>
    </div>
</template>
<script>
import { fetchDir } from './constant'

export default {
    data () {
        return {
            tableData: [],
            columns: [
                {
                    title: '序号',
                    render: (h, {row, cloumn, index}) => {
                        return h('Button', {
                            props: {
                                type: 'text'
                            },
                            on: {
                                'click': () => {
                                    this.linkToViewPage(row.id)
                                }
                            }
                        }, index)
                    }
                },
                {
                    title: '库所Id',
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
        linkToViewPage(id) {
            this.$router.push({
                path: `/layoutContent/${this.$router.currentRoute.params.id}/tokenView/${id}`
            })
        },
        linkToEditPage() {
            this.$router.push({
                path: `/layoutContent/${this.$router.currentRoute.params.id}/tokenConfig?tokenId=`
            })
        }
    },
    mounted () {
        this.setUrl(fetchDir.overviewData)
            .forGet((result, err) => {
                if (err) {
                    this.$Message("获取table数据失败")
                } else {
                    this.tableData = result
                }
            })
        
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
</style>

