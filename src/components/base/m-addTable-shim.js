import Vue from 'vue'
import _ from 'lodash'
import { FETCH_TABLE_DATA } from 'store/Action'
import {ADD_NEW_OBJECT, DESTROY_FORM_DATA } from 'store/Mutation'
Vue.component('mDetailTable', {
    render: function (h) {
        return h('mTable2', {
            props: {
                form: this.form,
                alias: this.alias, 
                operations: this.operations, 
                columns: this.columns,
                dataSource: this.dataSource,
                visible: this.visible,
                loading: this.loading
            }
        })
    },
    props: {
        uid: {
            type: String,
            default: 'tb'
        },
        define: {
            type: Object,
            default() {
                return {
                    ui_alias: '',
                    data_url: '',
                    ui_id: '',
                    operations: [],
                    cols: []
                }
            }
        },
        content: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
        form() {
            return this.uid || ''
        },
        dataSource() {
            return _.get(this.$store.state.formData, 'table', [])
        },
        visible() {
            let tmp = _.get(this.$store.state.formData, this.form)
            if(tmp === undefined) {
                this.$store.commit(ADD_NEW_OBJECT,
                    {
                        attribute: this.form,
                        value: {
                            loading: true,
                            reset: false,
                            validate: false,
                            visible: false
                        }
                    }
                )
            }
            return _.get(this.$store.state.formData, [this.form, 'visible'], false)
        },
        loading() {
            return _.get(this.$store.state.formData, [this.form, 'loading'], true)
        },
        alias() {
            let alias = this.define['alias'] || ''
            return alias
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
        columns() {
            let cols = this.define['columns'] || []
            let columns = this.handleColumns(cols)
            return columns
        }
    },
    methods: {
        getDataFromUrl(url) {
            this.$store.dispatch(FETCH_TABLE_DATA, {url})
        },
        //初始化表格配置数据
        //处理表头数据
        handleColumns(cols) {
            let columns = []
            if(Array.isArray(cols)) {
                cols.forEach(col => {
                    let column = {
                        title: col['ui_define']['title'],
                        key: col.ui_id,
                        type: col.ui_type,
                        ui_id: col.ui_id,
                        define: col.ui_define || {}
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
