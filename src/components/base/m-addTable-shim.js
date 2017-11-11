import Vue from 'vue'
import _ from 'lodash'
import { warning } from 'utils/console'
import { FETCH_TABLE_DATA } from 'store/Action'

const tableShim = Vue.component('detailTableShim', {
    render: function (h) {
        return h('mDetailTable', {
            props: {
                alias: this.alias, 
                operations: this.operations, 
                columns: this.columns,
                dataSource: this.dataSource,
                visible: this.visible,
                loading: this.loading
            }
        })
    },
    data() {
        return {
            userUrl: false,
            alias: '',
            url: '',
            operations: null,
            columns: [{}]
        }
    },
    props: {
        uid: {
            type: String,
            default: 'tb'
        },
        define: {
            type: Object,
            default: function() {
                return {
                    ui_alias: '测试表格数据',
                    data_url: '/api/formsNew/targetAchievement/fetchAoRoot',
                    ui_id: 'ef945940',
                    operations: [
                        {
                            action: 'add',
                            name: '添加'
                        },
                        {
                            action: 'edit',
                            name: '修改'
                        },
                        {
                            action: 'view',
                            name: '查看'
                        },
                        {
                            action: 'delete',
                            name: '删除'
                        }
                    ],
                    cols: [
                        {
                            alias: '名称',
                            field: 'name',
                            ui_id: 'a3a6f5a9',
                            config: {
                                type: 'router-link',
                                config: {
                                    props: {
                                        to: '/table'
                                    }
                                },
                                content: 'name'
                            },
                            type: 'm-number',
                            define: {
                                name: 'name',
                                title: '名称',
                                dataType: 'String',
                                form: '75d8706',
                                isRelated: false,
                            }
                        },
                        {
                            alias: '负责人',
                            field: 'charger',
                            type: 'm-number',
                            ui_id: 'a3d9d66a',
                            define: {
                                name: 'charger',
                                title: '负责人',
                                dataType: 'String',
                                form: '75d8706',
                                isRelated: true,
                                relation: {
                                    target: 'name'
                                }
                            }
                        },
                        {
                            alias: '类型',
                            field: 'ao_metaname',
                            type: 'm-radio',
                            ui_id: 'f22061b7',
                            define: {
                                items:[
                                    {
                                        id: 'apple',
                                        name: '苹果',
                                        icon: 'social-apple'
                                    },
                                    {
                                        id: 'banana',
                                        name: '香蕉',
                                    },
                                    {
                                        id: 'orange',
                                        name: '橘子',
                                    },
                                    {
                                        id: 'strawberry',
                                        name: '草莓',
                                    }
                                ],
                                name: 'ao_metaname',
                                title: '类型',
                                dataType: 'String',
                                form: '75d8706'
                            }
                        },
                        {
                            alias: '版本号',
                            field: 'version',
                            type: 'm-select',
                            ui_id: '185e6fad',
                            define: {
                                name: 'version',
                                items: [
                                    {
                                        id: '1',
                                        name: '初代'
                                    },
                                    {
                                        id: '2',
                                        name: '次代'
                                    },
                                    {
                                        id: '3',
                                        name: '三代'
                                    }
                                ],
                                title: '版本号',
                                dataType: 'String',
                                form: '75d8706'
                            }
                        },
                        {
                            alias: '任务数目',
                            field: 'taskNum',
                            type: 'm-number',
                            ui_id: 'f5bf0258',
                            define: {
                                name: 'taskNum',
                                title: '任务数目',
                                dataType: 'String',
                                form: '75d8706'
                            }
                        },
                        {
                            alias:'问题数目',
                            field: 'issueNum',
                            type: 'm-number',
                            ui_id: 'be8fa2a7',
                            define: {
                                name: 'issueNum',
                                title: '问题数目',
                                dataType: 'String',
                                form: '75d8706'
                            }
                        },
                        {
                            alias:'最后更新',
                            field: 'lastTime',
                            type: 'm-date',
                            ui_id: '78cc714a',
                            define: {
                                name: 'lastTime',
                                title: '最后更新',
                                dataType: 'Date',
                                form: '75d8706',
                                labelLength: 5,
                                contentLength: 19
                            }
                        },
                        {
                            alias:'部门',
                            field: 'department',
                            type: 'm-input',
                            ui_id: 'd0f065e5',
                            define: {
                                name: 'department',
                                title: '部门',
                                dataType: 'String',
                                form: '75d8706',
                            }
                        },
                    ]
                }
            }
        },
        content: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    computed: {
        dataSource() {
            return _.get(this.$store.state.formData, 'table', [])
        },
        visible() {
            return _.get(this.$store.state.formData['75d8706'], 'visible', false)
        },
        loading() {
            return _.get(this.$store.state.formData['75d8706'], 'loading', true)
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        getDataFromUrl(url) {
            this.$store.dispatch(FETCH_TABLE_DATA, {url})
        },
        //初始化表格配置数据
        init() {
            // 表格名称
            this.alias = this.define['ui_alias'] || ''
            // 表格处理按钮
            this.operations = this.define['operations'] || []
            // 列(原始)
            let cols = this.define['cols'] || []
            // 列转型
            this.columns = this.handleColumns(cols)
            this.url = this.define['data_url'] || null
            if (this.url !== null) {
                this.getDataFromUrl(this.url)
            }
        },
        //处理表头数据
        handleColumns(cols) {
            let columns = []
            if(Array.isArray(cols)) {
                cols.forEach(col => {
                    let column = {
                        title: col.alias,
                        key: col.field,
                        type: col.type,
                        ui_id: col.ui_id,
                        define: col.define || {}
                    }
                    columns.push(column)
                })
                if(cols.length === 0) {
                    columns.push({})
                }
            } else {
                warning(`unexpected arguments. expect Array, but get ${Object.prototype.toString.apply(cols)}\n`,
                    `arguments ${JSON.parse(cols)} will be ignored and return an array width an empty object`)
                columns.push({})
            }
            console.log(columns)
            return columns
        }
    }
})

export default tableShim