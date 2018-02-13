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
const data = [
    {
        id: 1,
        type: '库所类型1',
        desc: '描述1'
    },
    {
        id: 2,
        type: '库所类型2',
        desc: '描述2'
    }
]
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
                    title: '库所类型',
                    key: 'type',
                    align: 'center'
                },
                {
                    title: '描述',
                    key: 'desc',
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
        this.tableData = data
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

