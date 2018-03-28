<template>
    <div class="container">
        <h3 class="title-container">库存一览</h3>
        <Row>
            <Col span="24">
                <mTableF
                    :cols="tableData"
                    :search="false"
                    :rowsContent = "rowsContent"
                    :showModalBtn = "true"
                    :customBtn="true"
                    :layerComponent="layerComponent"
                    :layerTitle="title"
                ></mTableF>
            </Col>
        </Row>
    </div>
</template>
<script>
    import { getData } from 'utils/actionUtils'

    export default {
        data() {
            return {
                tableData: [],
                rowsContent:[],
                title:'库存一览详情',
                layerComponent:'mStockLayer',
            }
        },
        mounted() {
            this.getTableData()
        },
        methods: {
            getTableData(){
                const url = {
                    method:'GET',
                    url: this.$route.query.url.split('?')[0]
                }
                getData(url, (result) => {
                    if(result){
                        this.tableData = result.meta.ui_define.cols || []
                        this.rowsContent = result.data.data || []
                    }
                })
            }
        },
    }
</script>

<style scoped>
    .container {
        margin: 15px 30px auto;
    }

    .title-container {
        padding-bottom: 10px;
        margin-bottom: 15px;
        font-size: 18px;
        border-bottom: 1px solid #ccc;
    }
</style>
