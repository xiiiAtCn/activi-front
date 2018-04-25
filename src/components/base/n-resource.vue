<template>
    <div>
        <Select
            @on-change="selectChange" 
            :value="value"
            :disabled="define.readonly"
        >
            <Option 
                v-for="(item, index) in data"
                :key="index"
                :value="item.id"
                :label="item.value"
            >
            {{item.option}}
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
            },
            value: {
                default: ''
            },
            form: {
                
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
            let { url } = this.define
            getData(url, data => {
                this.data = data
            })
        },
        methods: {
            selectChange(value) {
                this.$emit('dataChange', {
                    form: this.form,
                    name: this.define.name,
                    data: value,
                })
            }
        }
    }
</script>
<style>

</style>
