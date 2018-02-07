<template>
    <div>
        <slot></slot>
        <transition name="fade">
            <div v-if="validateState === 'error'"></div>
        </transition>
    </div>
</template>
<script>
import AsyncValidator from 'async-validator'
import * as constant from './constant'

function getPropByPath(obj, path) {
    let tempObj = obj;
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');

    let keyArr = path.split('.');
    let i = 0;

    for (let len = keyArr.length; i < len - 1; ++i) {
        let key = keyArr[i];
        if (key in tempObj) {
            tempObj = tempObj[key];
        } else {
            throw new Error('[iView warn]: please transfer a valid prop path to form item!');
        }
    }
    return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj[keyArr[i]]
    };
}

export default {
    props: {
        // 
        rules: {
            type: Array,
            default () {
                return []
            }
        },
        // 取值路径
        prop: {
            type: String
        }
    },
    data () {
        return {
            // 验证状态 
            validateState: '',
            // 验证信息
            validateMessage: ''
        }
    },
    computed: {
        table () {
            return this.$parent
        }
    },
    methods: {
        onFieldBlur () {
            this.validate('blur')
        },
        onFieldChange () {
            this.validate('change')
        },
        // 校验
        validate (trigger, callback = function () {}) {
            // 获取当前trigger对应的rules 
            const rules = this.getFilteredRule(trigger)

            if (!rules || rules.length === 0) {
                callback()
                return true
            }

            this.validateState = 'validating'

            let descriptor = {}
            descriptor[this.prop] = rules

            const validator = new AsyncValidator(descriptor)
            let model = {}

            model[this.prop] = this.fieldValue

            validator.validate(model, { firstFields: true }, errors => {
                this.validateState = !errors ? 'success' : 'error'
                this.validateMessage = errors ? errors[0].message : ''

                callback(this.validateMessage)
            })
        },
        // 不指定trigger两种情况都校验
        getFilteredRule (trigger) {
            return this.rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1)
        },
        // 获取表单元素的值
        getFieldValue () {
            const model = this.table.model
            if (!model || !this.prop) return 

            let path = this.prop
            
            return getPropByPath(model, path).v
        }
    },
    mounted () {
        if (this.prop) {
            // 触发添加事件
            this.$emit(constant.addItem, this)

            // 表单元素blur || change 进行对应的校验
            this.$on('on-form-blur', this.onFieldBlur)
            this.$on('on-form-change', this.onFieldChange)
        }
    },
    beforeDestory () {
        // 触发删除事件
        this.$emit(constant.delItem, this)
    }
}
</script>
