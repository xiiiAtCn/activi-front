import Vue from 'vue'
import _ from 'lodash'
import { FETCH_TABLE_DATA } from 'store/Action'
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
                formTmp: this.uid,
                name: this.name,
                editable: this.editable
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
        uid: {
            type: String,
            required: true
        }
    },
    computed: {
        columns() {
            let cols = this.define['columns'] || []
            let columns = this.handleColumns(cols)
            let tmp = _.get(this.$store.state.formData, this.uid)
            if(tmp === undefined) {
                this.$store.commit(ADD_NEW_OBJECT,
                    {
                        attribute: this.uid,
                        value: {
                            loading: true,
                            reset: false,
                            validate: false,
                            visible: false
                        }
                    }
                )
                this.$store.commit(FORM_ELEMENT_VALUE, {checkCount: columns.length, form: this.uid})
            }
            return columns
        },
        dataSource() {
            let form = _.get(this.$store.state.formData, this.form || 'form')
            if(form === undefined) {
                this.$store.commit(ADD_NEW_OBJECT,
                    {
                        attribute: this.form || 'form',
                        value: {
                            reset: false,
                            validate: false
                        }
                    }
                )
            }
            let source = _.get(this.$store.state.formData, ['form', this.name, 'value'])
            if(source === undefined )
                this.$store.commit(FORM_ELEMENT_VALUE, {form: 'form', [this.name]: {
                    value: [],
                    type: this.$options._componentTag
                }})
            source = _.get(this.$store.state.formData, ['form', this.name, 'value'])
            if(source.type === undefined) 
                this.$store.commit(FORM_ELEMENT_VALUE, {form: 'form', [this.name]: {
                    value: source,
                    type: this.$options._componentTag
                }})
            return _.get(this.$store.state.formData, ['form', this.name, 'value'])
        },
        editable() {
            let editable = _.get(this.$store.state.pageStatus, ['status', this.name])
            if(editable === 'editable') {
                return true
            }
            return false
        },
        visible() {
            return _.get(this.$store.state.formData, [this.uid, 'visible'], false)
        },
        loading() {
            return _.get(this.$store.state.formData, [this.uid, 'loading'], true)
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
    mounted() {
        this.$nextTick(() => {
            console.log('add table define is ', this.define)
        })
    },  
    methods: {
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
            console.log(columns)
            return columns
        }
    }
})
