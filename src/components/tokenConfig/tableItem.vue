<template>
    <div :class="classes">
        <slot @on-blur="test"></slot>
        <transition name="fade">
            <div
                :class="[prefixCls + '-error-tip']" 
                v-if="validateState === 'error'">
                {{ validateMessage }}
            </div>
        </transition>
    </div>
</template>
<script>
import AsyncValidator from 'async-validator'
import * as constant from './constant'
import bus from 'routers/bus'

const prefixCls = 'config-table-item'

export default {
    props: {
        // 验证规则
        rules: {
            type: Array,
            default () {
                return []
            }
        },
        // 取值路径
        prop: {
            type: String
        },
        testId: {
            type: String
        },
        validateState: {
            type: String
        },
        validateMessage: {
            type: String
        },
        setValidateState: {
            type: Function
        },
        setValidateMessage: {
            type: Function
        },
        model: {
            type: Object
        }
    },
    data () {
        return {
            prefixCls
        }
    },
    computed: {
        table () {
            return this.$parent.$parent.$parent.$parent.$parent.$parent
        },
        classes () {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-error`]: this.validateState === 'error'
                }    
            ]
        }
    },
    methods: {
        // 校验
        validate (callback = function () {}) {
            // 获取当前trigger对应的rules 
            const rules = this.rules

            if (!rules || rules.length === 0) {
                callback()
                return true
            }

            this.setValidateState('validating', this.testId)

            let descriptor = {}
            descriptor[this.prop] = rules
            const validator = new AsyncValidator(descriptor)
            let model = {}

            model[this.prop] = this.getFieldValue()
            validator.validate(model, { firstFields: true }, errors => {
                this.$nextTick(() => {
                    let validateMessage = errors ? errors[0].message : ''
                    this.setValidateState(!!errors ? 'error' : 'success', this.testId)
                    this.setValidateMessage(validateMessage, this.testId)

                    callback(validateMessage)
                })
            })
        },
        // 获取表单元素的值
        getFieldValue () {
            return this.model[this.prop]
        }
    },
    mounted () {
        if (this.prop) {
            // 触发添加事件
            bus.$emit(constant.addItem, this)
        }
    }
}
</script>
<style>
.config-table-item {
    height: 80px;
    display: flex;
    align-items: left;
    flex-direction: column;
    justify-content: center;
}
.config-table-item-error 
.ivu-input,
.config-table-item-error 
.ivu-select-selection {
    border: 1px solid #ed3f14 !important;
}
.config-table-item
.config-table-item-error-tip {
    line-height: 1;
    color: #ed3f14;
    margin-top: 6px;
}
</style>

