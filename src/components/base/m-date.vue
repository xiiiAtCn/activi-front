<template>
    <div v-show="visible">
        <Row>
            <Date-picker 
                :value="objectModel" 
                :format="format" 
                :type="type" 
                :placeholder="placeholder" 
                :disabled="readonly" 
                @on-change="handleChange"
                class="full-opacity">
            </Date-picker>
        </Row>
        <Row>
            <div v-if="hasError" class="gateway-item-error">{{errorMessage}}</div>
            <div v-else class="occupation gateway-item-error">隐藏</div>
        </Row>
    </div>
</template>

<script>
    import _ from 'lodash'
    import mixin from './mixin'
    import { ELEMENT_VALIDATE_RESULT } from 'store/Action'
    export default {
        name: 'm-date',
        mixins: [mixin],
        computed: {
            type () {
                return _.get(this.define, 'type', 'date')
            },
            format () {
                return _.get(this.define, 'format', 'yyyy-MM-dd')
            },
            placeholder () {
                return _.get(this.define, 'placeholder', '请选择日期')
            }
        },
        methods: {
            valid () {
                if (!this.readonly) {
                    let value = this.objectModel
                    let hasError = false
                    if (this.required && value.length === 0) {
                        this.errorMessage = '请输入必填项'
                        hasError = true
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.form})
                } else {
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.form})
                }
            },
            handleChange (value) {
                console.log('date changed')
                this.objectModel = value
                if (!this.reset) { this.valid() }
            }
        }
    }
</script>

