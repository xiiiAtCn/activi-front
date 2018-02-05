<template>
    <div>
        <Table
            border
            :columns="columns"
            :data="tableData"
        />
    </div>
</template>
<script>
import deepCopy from 'utils/utils'
import * as constant from './constant'

const TableFieldType = {
    checkbox: 'checkbox',
    text: 'text',
    input: 'input',
    select: 'select'
}

export default {
    props: {
        define: {
            type: Array,
            default () {
                return []
            }
        },
        data: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data() {
        return {
            tableData: [],
            // 所有表单元素
            fields: []
        }
    },
    computed: {
        columns () {
            let result = []
            this.define.forEach((column, index) => {
                let render = null
                switch (column.type) {
                    case TableFieldType.checkbox:
                        render = (h, {row, column, index}) => {
                            return h('Checkbox', {
                                props: {
                                    value: row[column.key]
                                },
                                on: {
                                    input: (value) => {
                                        this.bindValue(index, column.key, value)
                                    }
                                }
                            })
                        }
                        break
                    case TableFieldType.text:
                        render = (h, {row, column, index}) => {
                            return h('span', row[column.key])
                        }
                        break
                    case TableFieldType.input:
                        render = (h, {row, column, index}) => {
                            return h('Input', {
                                props: {
                                    value: row[column.key]
                                },
                                on: {
                                    input: (value) => {
                                        this.bindValue(index, column.key, value)
                                    }
                                }
                            })
                        }
                        break
                    case TableFieldType.select:
                        render = (h, {row, column, index}) => {
                            let options = this.define.filter(item => {
                                if (item.key === column.key) {
                                    return true
                                } else {
                                    return false
                                }
                            })
                            if (!options || options.length === 0 
                                         || !options[0].option 
                                         || options[0].option.length === 0) {
                                throw new Error(`configTable中select组件的define没有设置option数据`)
                            }
                            options = options[0].option
                            return h('Select', {
                                props: {
                                    value: row[column.key]
                                },
                                on: {
                                    input: (value) => {
                                        this.bindValue(index, column.key, value)
                                    }
                                }
                            }, options.map(option => {
                                return h('Option', {
                                    props: {
                                        value: option.value
                                    }
                                }, option.label)
                            }))
                        }
                        break
                    default:
                        throw new Error(`configTable不支持类型: ${column.type}`)
                }

                result.push({
                    title: column.title,
                    key: column.key,
                    render
                })
            })

            return result
        }
    },
    watch: {
        data(data) {
            this.tableData = deepCopy(data)
        }
    },
    methods: {
        bindValue (index, key, value) {
            this.$set(this.tableData[index], key, value)
        }
    },
    created () {
        this.$on(constant.addItem, (field) => {
            if (field) this.fields.push(field)
        })
        this.$on(constant.delItem, (field) => {
            this.fields.splice(this.fiedls.indexOf(field), 1)
        })
    }
}
</script>
