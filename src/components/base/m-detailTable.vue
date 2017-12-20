<template>
    <div>
        <mBarrier :height="10"></mBarrier>
        <div  class="operation">
            <Button v-for="(operation, index) in operations" v-if="!operation.own || (operation.own && addable)" :key="index" :type="operation.type" style="margin-left: 20px;"
            @click="tableAction(operation.action)">{{operation.text}}</Button>
        </div>
        <div style="padding: 0 20px;clear: both; margin-bottom: 20px;">
            <Table :columns="mixColumns" :data="source" size="small" @on-selection-change="selectRow">
                <h3 slot="header" class="title">{{alias}}</h3>
            </Table>
        </div>
        <mLayer
            v-model="visible"
            :loading="loading"
            :autoClose="false"
            @on-ok="submit2Table"
            @on-cancel="cancel">
            <Card style="width: 60%; margin: 0 auto;">
                <Form style="width: 85%; margin: 0 auto;">
                    <Row v-for="(column, index) in mixColumns" :key="index">
                        <component
                            v-if="column['ui_define']"
                            :ui_form="ui_form"
                            :form="formName"
                            :statusKey="name"
                            :is="column['ui_define']['ui_type']"
                            :define="column['ui_define']['ui_define']"
                            :content="column['ui_define']['ui_content']"
                        >
                        </component>
                    </Row>
                </Form>
            </Card>
        </mLayer>
    </div>
</template>
<script>
    import {CLEAR_FORM_DATA, OPEN_TABLE_LAYER, CLOSE_TABLE_LAYER ,ERASURE_DATA} from 'store/Mutation'
    import {SUBMIT_FORM_DATA, DELETE_TABLE_DATA} from 'store/Action'
    import _ from 'lodash'
    import { dispatch} from 'utils/actionUtils'
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
                type: [String],
                default: false
            },
            loading: {
                type: Boolean,
                default: true
            },
            ui_form: {
                type: [String, Number],
                required: true
            },
            formName:{
                type: [String],
                default: 'form'
            }
        },
        computed: {
            addable() {
                return this.editable.split('_').indexOf('add') !== -1
            },
            mixColumns() {
                let columns = this.columns
                let actions = this.editable.split('_')
                let operation = {
                    title: '操作',
                    render: (h, mixture) => {
                        return h('div',
                            {
                            },
                            [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size:'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.action = {
                                                type: 'update'
                                            }
                                            this.dataIndex = mixture.index
                                            this.$store.commit(OPEN_TABLE_LAYER, {form: this.ui_form, formName: this.formName, dataKey: this.name, index: mixture.index})
                                        }
                                    }
                                }, actions.indexOf('del') !== -1 ?'编辑':'查看'),
                                actions.indexOf('del') !== -1 ? h('Button', {
                                    props: {
                                        type: 'error',
                                        size:'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$store.dispatch(DELETE_TABLE_DATA, {dataKey: this.name, formName: this.formName, index: mixture.index})
                                        }
                                    }
                                }, '删除'): ''
                            ]
                        )
                    }
                }
                columns.unshift(operation)
                columns.unshift({
                    type: 'index',
                    title: '编号',
                    width: 60,
                    align: 'center'
                })
                let index = {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }
                columns.unshift(index)
                return columns
            },
            source() {
                let source = this.dataSource
                source = source.filter(element => {
                    if(element['flag'] && element['flag']['value'] === 'delete') {
                        return false
                    }
                    return true
                })
                return source
            },
        },
        data() {
            return {
                action: '',
                dataIndex: -1,
                rowSelected: []
            }
        },
        methods: {
            tableAction(action) {
                action = _.cloneDeep(action)
                if(action.type === 'add') {
                    this.action = action
                    this.$store.commit(OPEN_TABLE_LAYER, {form: this.ui_form})
                } else if (action.type !== 'link') {
                    let ids = this.rowSelected.map(element => element['id']['value'])
                    action['url']['body'] = ids
                    dispatch(action)
                } else {
                    dispatch(action)
                }
            },
            submit2Table() {
                let action = {}
                action = {
                    ...this.action
                }
                action.value = this.name
                action.index = this.dataIndex
                action.form = this.formName
                this.$store.dispatch(SUBMIT_FORM_DATA, {form: this.ui_form, action: action})
            },
            cancel() {
                this.$store.commit(CLEAR_FORM_DATA, {form: this.ui_form})
                this.$store.commit(CLOSE_TABLE_LAYER, {form: this.ui_form})
            },
            selectRow(selection ) {
                console.log('selection ' ,selection)
                this.rowSelected = selection
            }
        },
        destroyed: function () {

            let formFix = this.ui_form ? this.ui_form : this.form
            this.$store.commit(ERASURE_DATA, { form: formFix, name : this.name})
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
        margin: 5px 0;
    }
</style>

