<template>
    <div>
        <mBarrier :height="10"></mBarrier>
        <div  class="operation" v-if="editable.contains('add')">
            <Button v-for="(operation, index) in operations" :key="index" type="primary" style="margin-left: 20px;"
            @click="openLayer(operation.action)">{{operation.name}}</Button>
        </div>
        <div style="padding: 0 20px;clear: both; margin-bottom: 20px;">
            <Table :columns="mixColumns" :data="source" size="small">
                <h3 slot="header" class="title">{{alias}}</h3>
            </Table>
        </div>
        <mLayer v-model="visible" :loading="loading" :autoClose="false" @on-ok="submit2Table" @on-cancel="cancel">
            <Card style="width: 60%; margin: 0 auto;">
                <Form style="width: 85%; margin: 0 auto;">
                    <Row v-for="(column, index) in mixColumns" :key="index">
                        <component 
                            v-if="column['ui_define']"
                            :formTmp="formTmp" 
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
    import {CLEAR_FORM_DATA, OPEN_TABLE_LAYER, CLOSE_TABLE_LAYER } from 'store/Mutation'
    import {SUBMIT_FORM_DATA, DELETE_TABLE_DATA} from 'store/Action'
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
                type: [Boolean | String],
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
        computed: {
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
                                            this.action = 'update'
                                            this.dataIndex = mixture.index
                                            this.$store.commit(OPEN_TABLE_LAYER, {form: this.formTmp, dataKey: this.name, index: mixture.index})
                                        }
                                    }
                                }, '编辑'),
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
                                            this.$store.dispatch(DELETE_TABLE_DATA, {dataKey: this.name, index: mixture.index})
                                        }
                                    }
                                }, '删除'): undefined
                            ]
                        )
                        
                    }
                }
                columns.push(operation)
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
            }
        },
        
        data() {
            return {
                action: '',
                dataIndex: -1
            }
        },
        methods: {
            openLayer(action) {
                this.action = action
                this.$store.commit(OPEN_TABLE_LAYER, {form: this.formTmp})
            },
            submit2Table() { 
                let action = {}
                action.type = this.action
                action.value = this.name
                action.index = this.dataIndex
                this.$store.dispatch(SUBMIT_FORM_DATA, {form: this.formTmp, action: action})
            },
            cancel() {
                this.$store.commit(CLEAR_FORM_DATA, {form: this.formTmp})
                this.$store.commit(CLOSE_TABLE_LAYER, {form: this.formTmp})
            }
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

