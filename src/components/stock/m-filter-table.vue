<template>
    <div class="container">
        <Tabs v-show="tableData">
            <TabPane v-for="(item,key) in tableData" :key="key" :label="item.name||' '" :name="item.name||' '" >
                <mTableF
                    :cols="item.meta.ui_define.cols"
                    :search="false"
                    :justTable="true"
                    :rowsContent = "item.data.data"
                ></mTableF>
            </TabPane>
        </Tabs>
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
                tableData: []
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
                    url:'/actives/{resourcePlaceId}'
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
