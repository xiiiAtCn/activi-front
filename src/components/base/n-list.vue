<template>
    <div>
        <Card>
            <Table
                :data="data"
                :columns="columns"
            >
            </Table>
        </Card>
    </div>
</template>
<script>
    import { getData } from 'utils/actionUtils'
    export default {
        name: 'n-list',
        props: {
            define: {
                required: true
            }
        },
        data() {
            return {
                data: [],
                columns: []                
            }
        },
        mounted() {
            this.columns = this.define.cols
            let { dataUrl } = this.define
            getData(dataUrl, (data) => {
                this.data = data
            })
        },
        methods: {

        }
    }
</script>
<style scoped>

</style>
