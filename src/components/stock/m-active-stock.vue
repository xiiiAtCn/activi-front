<template>
    <div class="container">
        <h3 class="title-container">活动一览</h3>
        <Row>
            <Col span="24">
                <mTableF
                    :cols="tableData"
                    :search="false"
                    :rowsContent = "rowsContent"
                    :showModalBtn = "true"
                    :customBtn="true"
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
            }
        },
        mounted() {
            this.getTableData()
        },
        methods: {
            getTableData(){
                const url = {
                    method:'GET',
                    queryParams:{
                        resourceTemplateId:'75e2e700-b7b7-48ae-82ea-19e8dc840e73-20180301115636',
                        metaKey:'cable'
                    },
                    url:'/api/actives'
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
