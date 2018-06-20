<template>
    <div>
        <Row>
            <Date-picker
                    :value="modelData"
                    :format="format"
                    :type="type"
                    :placeholder="placeholder"
                    :disabled="readonly"
                    @on-change="handleChange"
                    v-model="modelData"
                    class="full-opacity">
            </Date-picker>
        </Row>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: 'n-date',
        props: ['define', 'content', 'modelText', 'form'],
        data() {
            return {
                modelData: '',
            }
        },
        computed: {
            type() {
                return _.get(this.define, 'type', 'date')
            },
            format() {
                return _.get(this.define, 'format', 'yyyy-MM-dd')
            },
            placeholder() {
                return this.readonly ? '' : _.get(this.define, 'placeholder', '请选择日期')
            },
            readonly() {
                return _.get(this.define, 'readonly', false)
            }

        },
        mounted() {
            this.modelData = this.modelText
        },
        // watch: {
        //     modelData() {
        //         this.$emit('dataChange', {
        //             form: this.form,
        //             name: this.define.name,
        //             data: this.modelData
        //         })
        //     }
        // },
        methods: {
            handleChange: function () {
                this.$emit('dataChange', {
                    form: this.form,
                    name: this.define.name,
                    data: this.modelData
                })
            }
        }
    }
</script>

