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
            console.log(this.define)
        },
        methods: {

        }
    }
</script>
<style scoped>

</style>
