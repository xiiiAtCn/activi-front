<template>
    <div>
        <Table
            border
            highlight-row
            :columns="columns"
            :data="data"
            @on-current-change="changeCurrentRow"
        />
    </div>
</template>
<script>
import _ from 'lodash'
import * as constant from './constant'
import bus from 'routers/bus'

var class2type = {} ;
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(e,i){
    class2type[ "[object " + e + "]" ] = e.toLowerCase();
}) ;
function _typeof(obj){
    if ( obj == null ){
        return String( obj );
    }
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[ class2type.toString.call(obj) ] || "object" :
        typeof obj;
}

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
        },
        disabled: {
            type: Boolean,
            default: false
        },
        changeModel: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            // 所有表单元素
            fields: [],
            validateResult: {}
        }
    },
    computed: {
        columns () {
            let result = []
            this.define.forEach((column, index) => {
                let render = null
                if (!!column.render) {
                    render = column.render
                } else {
                    switch (column.type) {
                        case TableFieldType.checkbox:
                            render = (h, {row, column, index}) => {
                                let disabled = false
                                if (this.disabled === true || this.disabled === false) {
                                    disabled = this.disabled
                                }
                                // if (row._compRowDisabled === false || row._compRowDisabled === true) {
                                //     disabled = row._compRowDisabled
                                // }
                                return h('Checkbox', {
                                        props: {
                                            value: row[column.key],
                                            disabled: disabled
                                        },
                                        on: {
                                            input: (value) => {
                                                this.changeModel(index, column.key, value)
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
                                let key = column.key
                                let testId = this.generateId(index, this.findColumnIndexByKey(key), row.id || row.generateId)
    
                                return h('tableItem', {
                                    props: this.getTableItemProp(index, key, testId)
                                }, [
                                    h('Input', {
                                        props: {
                                            value: row[key],
                                            disabled: this.disabled
                                        },
                                        on: {
                                            'on-blur': (event) => {
                                                this.changeModel(index, key, event.target.value)
                                                this.$nextTick(() => {
                                                    let comp = this.getFieldsById(testId)
                                                    if (comp) {
                                                        comp.validate()
                                                    }
                                                })
                                            }
                                        }
                                    })
                                ])
                            }
                            break
                        case TableFieldType.select:
                            render = (h, {row, column, index}) => {
                                let key = column.key
                                let testId = this.generateId(index, this.findColumnIndexByKey(key), row.id || row.generateId)
                                let options = []
                                // 先从data中取option取不到从define中取
                                if (row[key].options && row[key].options.length >= 0) {
                                    options = row[key].options
                                } else {
                                    options = this.define.filter(item => {
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
                                }
                                return h('tableItem', {
                                    props: this.getTableItemProp(index, key, testId)
                                }, [
                                    h('Select', {
                                        props: {
                                            value: _typeof(row[column.key]) === 'object' ? 
                                                row[column.key].value : 
                                                row[column.key],
                                            transfer: true,
                                            disabled: this.disabled
                                        },
                                        on: {
                                            'on-change': (value) => {
                                                this.changeModel(index, column.key, value)
                                                this.$nextTick(() => {
                                                    let comp = this.getFieldsById(testId)
                                                    if (comp) {
                                                        comp.validate()
                                                    }
                                                })
                                            }
                                        }
                                    }, options.map(option => {
                                        return h('Option', {
                                            props: {
                                                value: option.value
                                            }
                                        }, option.label)
                                    }))
                                ])
                            }
                            break
                        default:
                            throw new Error(`configTable不支持类型: ${column.type}`)
                    }
                }

                if (!column.width) {
                    result.push({
                        title: column.title,
                        key: column.key,
                        render
                    })
                } else {
                    result.push({
                        title: column.title,
                        key: column.key,
                        render,
                        width: column.width
                    })
                }
            })

            return result
        }
    },
    methods: {
        validate (callback) {
            return new Promise(resolve => {
                let valid = true
                let count = 0
                let validCount = 0
                console.log(`fields :${this.fields}`)
                // 没有需要校验的东西
                if (this.fields.length === 0) {
                    resolve(valid)
                    if (typeof callback === 'function') {
                        callback(valid)
                    }
                }
                this.fields.forEach(field => {
                    let colAndRow = field.$props.testId.split('-')
                    if (colAndRow[0] < this.data.length) {
                        validCount++
                        field.validate(errors => {
                            if (errors) {
                                valid = false
                            }
                            if (++count === validCount) {
                                resolve(valid)
                                if (typeof callback === 'function') {
                                    callback(valid)
                                }
                            }
                        })
                    }
                })
            })
        },
        findColumnIndexByKey (key) {
            for (let i = 0; i < this.define.length; i++) {
                if (this.define[i].key === key) {
                    return i
                }
            }
        },
        getTableItemProp (index, columnKey, id) {
            let columnIndex = this.findColumnIndexByKey(columnKey)
            return {
                rules: this.define[columnIndex].rules,
                prop: `${columnKey}`,
                testId: id,
                model: this.data[index],
                validateState: this.validateResult[id] ? this.validateResult[id].state : '',
                validateMessage: this.validateResult[id] ? this.validateResult[id].message : '',
                setValidateState: this.setValidateState,
                setValidateMessage: this.setValidateMessage
            }
        },
        generateId(row, column, id) {
            return `${row}-${column}-${id}`
        },
        getFieldsById (id) {
            for (let field of this.fields) {
                if (field.$props.testId === id) {
                    return field
                }
            }
        },
        setValidateState (state, id) {
            this.setValidateResult({state}, id)
        },
        setValidateMessage (message, id) {
            this.setValidateResult({message}, id)
        },
        setValidateResult (data, id) {
            let result = this.validateResult[id]
            if (!result) {
                result = {}
            }
            this.$set(this.validateResult, id, {...result, ...data})
        },
        // 改变当前选中行
        changeCurrentRow (currentRow, oldCurrentRow) {
            this.$emit('on-current-change', currentRow, oldCurrentRow)
        }
    },
    mounted () {
        bus.$on(constant.addItem, (newField) => {
            let fieldId = newField.$props.testId
            const idArr = fieldId.split('-')
            if (newField) {
                let index = -1
                let delArr = []
                for (let i = 0, len = this.fields.length; i < len; i++) {
                    let currentId= this.fields[i].$props.testId
                    if (fieldId === currentId) {
                        index = i
                        break
                    } else {
                        // 同行残留数据
                        let currentIdArr = currentId.split('-')
                        if (idArr[0] === currentIdArr[0] && idArr[2] !== currentIdArr[2]) {
                            delArr.push(i)
                        }
                    } 
                }
                // 有相同id直接替换
                if (index === -1) {
                    // 删除残留数据
                    for (let i = 0, len = delArr.length; i < len; i++) {
                        this.fields.splice(delArr[i] + i, 1)
                    }
                    this.fields.push(newField)
                } else {
                    this.fields[index] = newField
                }
            }
        })
    }
}
</script>
