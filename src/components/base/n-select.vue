<template>
    <div>
        <Select v-model="modelData" filterable>
            <Option v-for="(k,v) in options" :value="v" :key="k">{{k}} ({{v}})</Option>
        </Select>
    </div>
</template>
<script>
    import _ from 'lodash'

    export default {
        name: 'n-input',
        props: ['define', 'content', 'modelText', 'form'],
        data() {
            return {
                modelData: '',
            }
        },
        computed: {
            options() {
                return _.get(this.define, 'options', ['abc'])
            }
        },
        watch: {
            modelData() {
                this.$emit('dataChange', {
                    form: this.form,
                    name: this.define.name,
                    data: this.modelData
                })
            }
        },
        mounted() {
        },
        methods: {}
    }
</script>
