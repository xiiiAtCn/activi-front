<template>
    <div>
        <Row type="flex" justify="center" align="middle">
            <Col :span="labelLength" :offset="labelOffset">
                <span>
                    {{title}}
                </span>
            </Col>
            <Col :span="contentLength" :offset="contentOffset">
                <Date-picker 
                    v-model="objectModel" 
                    :format="format" 
                    :type="type" 
                    :placeholder="placeholder" 
                    :readonly="readonly" 
                    @on-change="handleChange"
                    class="full-opacity">
                </Date-picker>
            </Col>
        </Row>
        <Row>
            <Col :offset="errorOffset" :span="contentLength">
                <div v-if="hasError" class="gateway-item-error">{{errorMessage}}</div>
                <div v-else class="occupation gateway-item-error">隐藏</div>
            </Col>
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
            type() {
                return _.get(this.define, 'type', 'date')
            },
            format() {
                return _.get(this.define, 'format', 'yyyy-MM-dd')
            },
            placeholder() {
                return _.get(this.define, 'placeholder', '请选择日期')
            }
        },
        methods: {
            valid() {
                if(!this.readonly) {
                    let value = this.objectModel
                    let hasError = false
                    if (this.required && value.length === 0) {
                        this.errorMessage = '请输入必填项'
                        hasError = true
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]:hasError, form: this.form})
                }
            },
            handleChange(value) {
                debugger
                console.log('date changed')
                this.objectModel = {value}
                if(!this.reset)
                    this.valid()
            }
        }
    }
</script>

