<template>
    <div>
        <Row>
            <Col :span="labelLength" :offset="labelOffset">
                <span>
                    {{title}}
                </span>
            </Col>
            <Col :span="contentLength" :offset="contentOffset">
                <CheckboxGroup
                    v-model="objectModel" 
                    :size="size" 
                    :vertical="vertical" 
                    @on-change="selectChange">
                        <Checkbox 
                            v-for="(item, index) in items" 
                            :label="item.id"
                            :disabled="item.diabled || readonly" 
                            :key="index">
                                {{item.name}}
                        </Checkbox>
                </CheckboxGroup>
            </Col>
        </Row>
        <Row >
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
        name: 'm-checkbox',
        mixins: [mixin],
        computed: {
            items() {
                console.log(this.define)
                return _.get(this.define, 'items', [])
            },
            size() {
                return _.get(this.define, 'size', 'large')
            },
            vertical() {
                return _.get(this.define, 'vertical', false)
            }
        },
        methods: {
            selectChange(value) {
                console.log('select change ' , value)
                this.valid()
            },
            valid() {
                if(!this.readonly) {
                    let value = this.objectModel
                    let hasError = false
                    if(this.required && value.length === 0) {
                        hasError = true
                        this.errorMessage = '请输入必填项'
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]:hasError, form: this.form})
                }
            }
        },
    }
</script>