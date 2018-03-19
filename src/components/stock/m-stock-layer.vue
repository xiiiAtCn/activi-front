<template>
    <div class="container">
        <mTableF
            v-if="tableData"
            :cols="tableData.meta.ui_define.cols"
            :search="false"
            :justTable="true"
            :rowsContent = "tableData.data.data"
        ></mTableF>
    </div>
</template>
<script>
    import { getData } from 'utils/actionUtils'

    export default {
        props:['define'],
        watch:{
            define () {
                this.init()
            }
        },
        data() {
            return {
                tableData:''
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init(){
                if(!this.define || !this.define.id){return}
                let url = {
                    method:'GET',
                    pathParams:{
                        resourcePlaceId: this.define.id
                    },
                    url:`/api/stock/6317d954-65ce-4051-8597-24a3d1a74ab8-20180301120827/aa6220ff-b145-4ec3-980c-c0a3e9c3b969/{resourcePlaceId}`
                }
                getData(url, (result) => {
                    if(result){
                        this.tableData = result
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
