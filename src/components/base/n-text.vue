<template>
    <Input
            v-model="modelData"
            :placeholder="define.placeholder"
            :disabled="define.readonly"
            type="textarea"
    >
    </Input>
</template>
<script>

    export default {
        name: 'n-text',
        props: ['define', 'content', 'modelText', 'form', 'formIndex'],
        data() {
            return {
                modelData: ''
            }
        },
        computed: {},
        watch: {
            modelData() {
                this.$emit('dataChange', {
                    form: this.form,
                    name: this.define.name,
                    data: this.modelData,
                })
            },
            modelText(newData) {
                if (newData) {
                    this.modelData = newData
                }
            }
        },
        mounted() {
            this.modelData = this.modelText
        },
        methods: {}
    }
</script>
