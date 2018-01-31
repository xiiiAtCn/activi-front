<template>
    <div>
        <mBarrier :height="10"></mBarrier>
        <div  class="operation">
            <Button 
                v-for="(operation, index) in operations" 
                v-if="!operation.own || (operation.own && addable)" 
                :key="index" 
                :type="operation.type" 
                style="margin-left: 20px;"
                @click="tableAction(operation.action)"
            >
                {{operation.text}}
            </Button>
        </div>
        <div style="padding: 0 20px;clear: both; margin-bottom: 20px;">
            <Table 
                :columns="columns" 
                :data="dataSource" 
                size="small" 
                @on-selection-change="selectRow"
            >
                <h3 slot="header" class="title">
                    {{alias}}
                </h3>
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
                    <Row v-for="(column, index) in columns" :key="index">
                        <component
                            v-if="column['ui_define']"
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
    import {
        CLEAR_FORM_DATA, 
        OPEN_TABLE_LAYER, 
        CLOSE_TABLE_LAYER ,
        ERASURE_DATA, 
        ADD_NEW_OBJECT, 
        FORM_ELEMENT_VALUE,
        ELEMENT_VALIDATE_RESULT 
    } from 'store/Mutation'
    import {SUBMIT_FORM_DATA, DELETE_TABLE_DATA} from 'store/Action'
    import _ from 'lodash'
    import { dispatch} from 'utils/actionUtils'
    import { VALIDATION } from 'utils/consts'
    export default {
        provide() {
            return {
                baseForm: this.form,
                tmpForm: this.temporary_form
            }
        },
        props: {
            define: {
                type: Object,
                required: true
            }
        },
        computed: {
            addable() {
                return this.editable.split('_').indexOf('add') !== -1
            },
            editable() {
                return _.get(this.define, 'status', '')
            },
            visible() {
                return _.get(this.$store.state.formData, [this.temporary_form, '_visible'], false)
            },
            loading() {
                return _.get(this.$store.state.formData, [this.temporary_form, '_loading'], true)
            },
            alias() {
                let alias = this.define['alias'] || ''
                return alias
            },
            name() {
                return this.define['name']
            },
            temporary_form() {
                return '_' + this.name + this.form
            },
            required() {
                return _.get(this.define, 'required', true)
            },
            operations() {
                let operations = this.define['buttons'] || []
                operations.unshift({
                    type: 'primary',
                    text: '添加',
                    own: true,
                    action: {
                        type: 'add'
                    }
                })
                return operations
            },
            form() {
                return _.get(this.define, 'ui_form', 'form')
            },
            validate () {
                return _.get(this.$store.state.formData[this.form], '_validate', false)
            },
            columns() {
                let cols = this.define['columns'] || []
                let columns = this.handleColumns(cols)
                let tmp = _.get(this.$store.state.formData, this.temporary_form)
                if(tmp === undefined) {
                    this.$store.commit(ADD_NEW_OBJECT,
                        {
                            attribute: this.temporary_form,
                            value: {
                                _loading: true,
                                _reset: false,
                                _validate: false,
                                _visible: false,
                                ['_' + this.temporary_form + 'waitCheck']: []
                            }
                        }
                    )
                }
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
                                            if(actions.indexOf('del') !== -1) {
                                                this.action = {
                                                    type: 'update'
                                                }
                                            } else {
                                                this.action = {
                                                    type: 'view'
                                                }
                                            }
                                            console.log(this.action)
                                            this.dataIndex = mixture.index
                                            this.$store.commit(
                                                OPEN_TABLE_LAYER, 
                                                {
                                                    form: this.temporary_form, 
                                                    formName: this.form, 
                                                    dataKey: this.name, 
                                                    index: mixture.index
                                                }
                                            )
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
                                            this.$store.dispatch(
                                                DELETE_TABLE_DATA, 
                                                {
                                                    dataKey: this.name,
                                                    formName: this.form,
                                                    index: mixture.index
                                                }
                                            )
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
            dataSource() {
                let form = _.get(this.$store.state.formData, this.form)
                if(form === undefined) {
                    this.$store.commit(ADD_NEW_OBJECT,
                        {
                            attribute: this.form,
                            value: {
                                _loading: true,
                                _reset: false,
                                _validate: false,
                                _visible: false,
                                [ '_' + this.form + 'waitCheck']: []
                            }
                        }
                    )
                }
                let source = _.get(this.$store.state.formData, [ this.form, this.name, 'value'])
                if(source === undefined )
                    this.$store.commit(FORM_ELEMENT_VALUE,
                        {
                            form: this.form,
                            [this.name]: {
                                value: [],
                                type: this.$options._componentTag
                            },
                            checkKey: this.name,
                        })
                source = _.get(this.$store.state.formData, [ this.form, this.name, 'value'])
                let type = _.get(this.$store.state.formData, [ this.form, this.name, 'type'])
                if(type === undefined)
                    this.$store.commit(FORM_ELEMENT_VALUE,
                        {
                            form: this.form,
                            [this.name]: {
                                value: source,
                                type: this.$options._componentTag
                            },
                            checkKey: this.name,
                        }
                    )
                source = _.get(this.$store.state.formData, [this.form , this.name, 'value'])
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
        watch: {
            validate(newVal) {
                if (newVal) {
                    this.valid()
                }
            }
        },
        methods: {
            tableAction(action) {
                action = _.cloneDeep(action)
                if(action.type === 'add') {
                    this.action = action
                    this.$store.commit(OPEN_TABLE_LAYER, {form: this.temporary_form})
                } else if (action.type !== 'link') {
                    let ids = this.rowSelected.map(element => element['id']['value'])
                    action['url']['body'] = ids
                    dispatch(action)
                } else {
                    dispatch(action)
                }
            },
            valid() {
                if(this.dataSource.length == 0 && this.addable) {
                    this.$Message.error(`请至少在${this.alias}中填入一条数据`)
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: true, form: this.form})
                } else {
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.form})
                }
            },
            submit2Table() {
                let action = {}
                action = {
                    ...this.action
                }
                action.value = this.name
                action.index = this.dataIndex
                action.form = this.form
                this.$store.dispatch(SUBMIT_FORM_DATA, {form: this.temporary_form, action: action})
            },
            cancel() {
                this.$store.commit(CLEAR_FORM_DATA, {form: this.temporary_form})
                this.$store.commit(CLOSE_TABLE_LAYER, {form: this.temporary_form})
            },
            selectRow(selection ) {
                console.log('selection ' ,selection)
                this.rowSelected = selection
            },
            handleColumns(cols) {
                let columns = []
                if(Array.isArray(cols)) {
                    cols.forEach(col => {
                        let column = {
                            ...col,
                            align: 'center',
                            ui_define: col['uiObject'],
                            render: (h, column) => {
                                return _.get(column, ['row', col['key'], 'value'], '')
                            }
                        }
                        columns.push(column)
                    })
                    if(cols.length === 0) {
                        columns.push({})
                    }
                } else {
                    console.warn(`unexpected arguments. expect Array, but get ${Object.prototype.toString.apply(cols)}\n`,
                        `arguments ${JSON.parse(cols)} will be ignored and return an array width an empty object`)
                    columns.push({})
                }
                return columns
            }
        },
        destroyed() {
            let formFix = this.temporary_form
            this.$store.commit(ERASURE_DATA, { form: formFix + VALIDATION, name : this.name})
            this.$store.commit(ERASURE_DATA, { form: this.baseForm || 'form', name : this.name})
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

