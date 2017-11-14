<template>
    <div>
        <Row>
            <Input :element-id="focusId"
                v-model="objectModel"
                :placeholder="placeholder"
                :readonly="readonly"
                :icon="icon"
                @on-blur="inputCheck"
            >
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
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'
    export default {
        name: 'm-input',
        mixins: [mixin],
        computed: {
            maxLength () {
                return _.get(this.define, 'maxLength', Number.MAX_SAFE_INTEGER)
            },
            minLength () {
                return _.get(this.define, 'minLength', 0)
            },
            pattern () {
                return _.get(this.define, 'pattern', '.*')
            },
            placeholder () {
                return _.get(this.define, 'placeholder', '请输入相关信息')
            },
            icon () {
                if (this.hasError) {
                    return 'alert'
                }
                if (this.readonly) {
                    return 'locked'
                }
                return ''
            }
        },
        methods: {
            valid () {
                if (!this.readonly) {
                    let hasError = false
                    let value = String(this.objectModel == undefined ? '' : this.objectModel)
                    if (this.required) {
                        if (value === '') {
                            hasError = true
                            this.errorMessage = '请输入必填项'
                        } else if (value.length < this.minLength) {
                            hasError = true
                            this.errorMessage = `输入最小长度应不小于${this.minLength}`
                        } else if (value.length > this.maxLength) {
                            hasError = true
                            this.errorMessage = `输入最大长度应不大于${this.maxLength}`
                        } else {
                            let regex = new RegExp(this.pattern)
                            if (!regex.test(this.objectModel)) {
                                hasError = true
                                this.errorMessage = '输入不符合要求, 请重新输入'
                            }
                        }
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.form})
                }
            },
            inputCheck () {
                this.valid()
            }
        }
    }
</script>
