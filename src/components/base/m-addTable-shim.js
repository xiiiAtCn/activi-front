import Vue from 'vue'
import _ from 'lodash'
import { FETCH_TABLE_DATA, ELEMENT_VALIDATE_RESULT } from 'store/Action'
import {ADD_NEW_OBJECT, FORM_ELEMENT_VALUE} from 'store/Mutation'
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
                formTmp: this.name,
                name: this.name,
                editable: this.readonly
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
            let source = _.get(this.$store.state.formData, ['form', this.name, 'value'])
            if(source === undefined )
                this.$store.commit(FORM_ELEMENT_VALUE, 
                    {   
                        form: 'form', 
                        [this.name]: {
                            value: [],
                            type: this.$options._componentTag
                        },
                        checkKey: this.name,
                        required: this.required
                    })
            source = _.get(this.$store.state.formData, ['form', this.name, 'value'])
            let type = _.get(this.$store.state.formData, ['form', this.name, 'type'])
            if(type === undefined) 
                this.$store.commit(FORM_ELEMENT_VALUE, 
                    {
                        form: 'form', 
                        [this.name]: {
                            value: source,
                            type: this.$options._componentTag
                        },
                        checkKey: this.name,
                        required: this.required
                    }
                )
            return _.get(this.$store.state.formData, ['form', this.name, 'value'])
        },
        readonly() {
            let editable = _.get(this.$store.state.pageStatus, ['status', this.name], '')
            return editable
        },
        visible() {
            return _.get(this.$store.state.formData, [this.name, 'visible'], false)
        },
        loading() {
            return _.get(this.$store.state.formData, [this.name, 'loading'], true)
        },
        alias() {
            let alias = this.define['alias'] || ''
            return alias
        },
        name() {
            return this.define['name']
        },
        operations() {
            let operations = this.define['operations'] || [{
                action: 'add',
                name: '添加'
            }]
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
            this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.ui_form})
        },
        getDataFromUrl(url) {
            this.$store.dispatch(FETCH_TABLE_DATA, {url})
        },
        //处理表头数据
        handleColumns(cols) {
            let columns = []
            columns.push({
                type: 'index',
                title: '编号',
                width: 60,
                align: 'center'
            })
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
    }
})
