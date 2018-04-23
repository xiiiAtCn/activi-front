<template>
    <div>
        <Select >
            <Option 
                v-for="(item, index) in data"
                :key="index"
            >
            </Option>
        </Select>
    </div>
</template>
<script>
    import { getData } from 'utils/actionUtils'
    export default {
        props: {
            define: {
                required: true
            }
        },
        name: 'n-resource',
        data() {
            return {
                data: []
            }
        },
        mounted() {
            debugger
            console.log(this.define)
            let { url } = this.define
            getData(url, data => {
                this.data = data
            })
        }
    }
</script>
<style>

</style>
