<template>
    <div>
        <Row >
            <Input
                v-model="objectModel"
                :placeholder="placeholder"
                :disabled="readonly"
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
        name: 'm-decimal',
        mixins: [mixin],
        computed: {
            placeholder () {
                return this.readonly?'':_.get(this.define, 'placeholder', '请输入一个小数')
            },
            minValue () {
                return _.get(this.define, 'minValue', Number.MIN_VALUE)
            },
            maxValue () {
                return _.get(this.define, 'maxValue', Number.MAX_VALUE)
            },
            precision() {
                return _.get(this.define, 'precision', 10)
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
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.fixForm})
                } else {
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.fixForm})
                }
            },
            inputNumber (e, flag) {
                let value = e.target.value
                if (value.startsWith('-') && value.length === 1) {
                    if (flag) {
                        value = ''
                    }
                } else {
                    let regex = /\./g
                    let pointCount = value.match(regex)
                    if (!value.endsWith('.')) {
                        let appendix = ''
                        let hasDot = false
                        let radixLength = 0
                        if(/(0*$)/.test(value)) {
                            appendix = /(0*$)/.exec(value)[1]
                            if(value.indexOf('.') != -1) {
                                hasDot = true
                                radixLength = value.split('.')[1].length
                            }
                            value = parseFloat(value)
                        }
                        if (isNaN(value)) {
                            value = ''
                        }
                        if(hasDot && value!== '' && String(value).indexOf('.') === -1) {
                            value += '.'
                        }
                        if(hasDot) {
                            if(radixLength < 15) {
                                value += appendix
                            } else {
                                value = parseFloat(value).toFixed(14)
                            }
                        }
                    } else {
                        if (pointCount.length > 1) {
                            if (value[value.length - 2] === '.') {
                                value = parseFloat(value)
                                if (isNaN(value)) {
                                    value = ''
                                }
                                value += '.'
                            } else {
                                value = parseFloat(value)
                            }
                        }
                    }
                }
                this.$nextTick(() => {
                    e.target.value = value
                })
                if(!isFinite(value)) {
                    value = 1.0000000000000003e+219
                }
                this.objectModel = String(value)
                this.valid()
            }
        }
    }
</script>
