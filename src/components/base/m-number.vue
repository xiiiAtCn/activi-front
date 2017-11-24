<template>
    <div v-show="visible">
        <Row >
            <Input 
                v-model="objectModel"
                :placeholder="placeholder" 
                :readonly="readonly" 
                :icon="icon" 
                @on-change="inputNumber($event)"  
                @on-blur="inputNumber($event, true)" >
            </Input>
        </Row>
        <Row>
            <div v-if="hasError" class="gateway-item-error">{{errorMessage}}</div>
            <div v-else class="occupation gateway-item-error">隐藏</div>
        </Row>
    </div>
</template>
<script>
    import mixin from './mixin'
    import _ from 'lodash'
    import { ELEMENT_VALIDATE_RESULT } from 'store/Action'

    export default {
        name: 'm-number',
        mixins: [mixin],
        computed: {
            placeholder () {
                return _.get(this.define, 'placeholder', '请输入一个数字')
            },
            icon () {
                if (this.hasError) {
                    return 'alert'
                }
                if (this.readonly) {
                    return 'locked'
                }
                return ''
            },
            minValue () {
                return _.get(this.define, 'minValue', Number.MIN_SAFE_INTEGER)
            },
            maxValue () {
                return _.get(this.define, 'maxValue', Number.MAX_SAFE_INTEGER)
            }
        },
        methods: {
            valid () {
                if (!this.readonly) {
                    let hasError = false
                    let value = this.objectModel
                    if (this.required && value === '') {
                        hasError = true
                        this.errorMessage = '请输入必填项'
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.form})
                } else {
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.form})
                }
            },
            inputNumber (e, flag) {
                let value = e.target.value
                if (value.startsWith('-') && value.length === 1) {
                    if (flag) {
                        value = ''
                    }
                } else {
                    value = parseInt(value)
                    if (isNaN(value)) {
                        value = ''
                    }
                }
                this.$nextTick(() => {
                    e.target.value = value
                })
                this.objectModel = String(value)
                this.valid()
            }
        }
    }
</script>
