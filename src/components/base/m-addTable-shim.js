import Vue from 'vue'
import _ from 'lodash'
import { FETCH_TABLE_DATA, ELEMENT_VALIDATE_RESULT} from 'store/Action'
import {ADD_NEW_OBJECT, FORM_ELEMENT_VALUE,CLEAR_FORM_STATUS, DESTROY_FORM_DATA } from 'store/Mutation'
Vue.component('mDetailTable', {
    render: function (h) {
        return h('mTable2', {
            props: {
                alias: this.alias,
                operations: this.operations,
                columns: this.columns,
                dataSource: this.dataSource,
                visible: this.visible,
                loading: this.loading,
                ui_form: this.temporary_form,
                name: this.name,
                editable: this.readonly,
                formName:this.ui_form
            }
        })
    },
    name: 'm-detail-table',
    props: {
        define: {
            type: Object,
        },
        content: {
            type: Object,
            default() {
                return {}
            }
        },
        ui_form: {
            type: String,
            default: 'form'
        },
    },
    computed: {
        temporary_form() {
            return this.name + this.ui_form
        },
        required() {
            return _.get(this.define, 'required', true)
        },
        columns() {
            let cols = this.define['columns'] || []
            let columns = this.handleColumns(cols)
            let tmp = _.get(this.$store.state.formData, this.name)
            if(tmp === undefined) {
                this.$store.commit(ADD_NEW_OBJECT,
                    {
                        attribute: this.name,
                        value: {
                            loading: true,
                            reset: false,
                            validate: false,
                            visible: false,
                            [this.name + 'waitCheck']: []
                        }
                    }
                )
            }
            return columns
        },
        validate () {
            return _.get(this.$store.state.formData[this.ui_form], 'validate', false)
        },
        dataSource() {
            let form = _.get(this.$store.state.formData, this.ui_form || 'form')
            if(form === undefined) {
                this.$store.commit(ADD_NEW_OBJECT,
                    {
                        attribute: this.ui_form || 'form',
                        value: {
                            loading: true,
                            reset: false,
                            validate: false,
                            visible: false,
                            [(this.ui_form || 'form') + 'waitCheck']: []
                        }
                    }
                )
            }
            let source = _.get(this.$store.state.formData, [ this.ui_form, this.name, 'value'])
            if(source === undefined )
                this.$store.commit(FORM_ELEMENT_VALUE,
                    {
                        form: this.ui_form,
                        [this.name]: {
                            value: [],
                            type: this.$options._componentTag
                        },
                        checkKey: this.name,
                        required: this.required
                    })
            source = _.get(this.$store.state.formData, [ this.ui_form, this.name, 'value'])
            let type = _.get(this.$store.state.formData, [ this.ui_form, this.name, 'type'])
            if(type === undefined)
                this.$store.commit(FORM_ELEMENT_VALUE,
                    {
                        form: this.ui_form,
                        [this.name]: {
                            value: source,
                            type: this.$options._componentTag
                        },
                        checkKey: this.name,
                        required: this.required
                    }
                )
            return _.get(this.$store.state.formData, [this.ui_form , this.name, 'value'])
        },
        readonly() {
            let editable = _.get(this.$store.state.pageStatus, ['status', this.temporary_form], '')
            return editable
        },
        visible() {
            return _.get(this.$store.state.formData, [this.temporary_form, 'visible'], false)
        },
        loading() {
            return _.get(this.$store.state.formData, [this.temporary_form, 'loading'], true)
        },
        alias() {
            let alias = this.define['alias'] || ''
            return alias
        },
        name() {
            return this.define['name']
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
        url() {
            let url = this.define['data_url'] || null
            return url
        },
    },
    watch: {
        validate(newVal) {
            if (newVal) {
                this.valid()
            }
        }
    },
    methods: {
        valid() {
            if(this.dataSource.length == 0) {
                this.$Modal.error({
                    title:'警告',
                    content: `请至少在${this.alias}中填入一条数据`
                })
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: true, form: this.ui_form})
            } else {
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.ui_form})
            }
        },
        getDataFromUrl(url) {
            this.$store.dispatch(FETCH_TABLE_DATA, {url})
        },
        //处理表头数据
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
    beforeDestroy() {
        this.$store.commit(DESTROY_FORM_DATA, {form: this.ui_form})
        this.$store.commit(CLEAR_FORM_STATUS)
    }
})
