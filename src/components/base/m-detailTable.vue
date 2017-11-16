<template>
    <div>
        <mBarrier :height="10"></mBarrier>
        <div  class="operation" v-if="editable">
            <Button v-for="(operation, index) in operations" :key="index" type="primary" style="margin-left: 20px;"
            @click="openLayer(operation.action)">{{operation.name}}</Button>
        </div>
        <div style="padding: 0 20px;clear: both; margin-bottom: 20px;">
            <Table :columns="columns" :data="dataSource" size="small">
                <h3 slot="header" class="title">{{alias}}</h3>
            </Table>
        </div>
        <mLayer v-model="visible" :loading="loading" :autoClose="false" @on-ok="submit2Table" @on-cancel="cancel">
            <Form>
                <Row v-for="column in columns" :key="column.ui_id">
                    <component 
                        :formTmp="formTmp" 
                        :statusKey="name"
                        :is="column['ui_define']['ui_type']" 
                        :define="column['ui_define']['ui_define']" 
                        :content="column['ui_define']['ui_content']"
                    >
                    </component>
                </Row>
            </Form>
        </mLayer>
    </div>
</template>
<script>
    import {CLEAR_FORM_DATA, OPEN_TABLE_LAYER, CLOSE_TABLE_LAYER } from 'store/Mutation'
    import {SUBMIT_FORM_DATA} from 'store/Action'
    import _ from 'lodash'
    export default {
        props: {
            alias: {
                type: String
            },
            operations: {
                type: Array,
                default:() => {
                    return []
                }
            },
            name: {
                type: String,
                required: true
            },
            columns: {
                type: Array,
                required: true
            },
            dataSource: {
                type: Array,
                default:() => {
                    return []
                }
            },
            visible: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: true
            },
            formTmp: {
                type: [String, Number],
                required: true
            }
        },
        data() {
            return {
                action: ''
            }
        },
        methods: {
            openLayer(action) {
                debugger
                let editable = _.get(this.$store.state.pageStatus, ['status', this.name])
                if(editable !== 'editable') {
                    return
                }
                this.action = action
                this.$store.commit(OPEN_TABLE_LAYER, {form: this.formTmp})
            },
            submit2Table() { 
                let action = {}
                action.type = this.action
                action.value = this.name
                action.index = 0
                this.$store.dispatch(SUBMIT_FORM_DATA, {form: this.formTmp, action: action})
            },
            cancel() {
                this.$store.commit(CLEAR_FORM_DATA, {form: this.formTmp})
                this.$store.commit(CLOSE_TABLE_LAYER, {form: this.formTmp})
            }
        },
        mounted() {
            debugger
        }
    }

</script>

<style>
    .form-item {
        margin-bottom: 0px;
    }
</style>

<style scoped>
    .title {
        margin: 0 20px 5px;
    }

    .operation {
        margin: 0 20px 5px;
        float: right;
    }
</style>

