<template>
    <div class="container">
        <h3 class="title-container">出入库记录一览</h3>
        <Row>
            <Col span="24">
                <mTableF
                    :cols="tableData"
                    :search="false"
                    :rowsContent = "rowsContent"
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
                title:'出入库记录一览',
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
                    url:'/api/stock/all/fac72b82-9b84-43df-9c63-717ccb0425c5-20180324113556/c39eba00-5d27-4115-9b99-1779890d20a6'
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
