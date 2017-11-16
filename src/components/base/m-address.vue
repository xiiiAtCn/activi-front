<template>
    <div>
        <Row>
            <Cascader
                v-model="objectModel.split(',')"
                :data="items"
                :transfer="transfer"
                :disabled="readonly"
                :not-found-text="notFound"
                :clearable="clearable"
                @on-change="select">
            </Cascader>
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
    import { FORM_ELEMENT_VALUE } from 'store/Mutation'

    const test = 'beijing,tiantan'

    export default {
        name: 'm-select',
        mixins: [mixin],
        computed: {
            items () {
                return _.get(this.define, 'items', [])
            },
            transfer () {
                return _.get(this.define, 'transfer', false)
            },
            notFound () {
                return _.get(this.define, 'notFound', '无匹配数据')
            },
            clearable () {
                return _.get(this.define, 'clearable', true)
            }
        },
        methods: {
            select (value) {
                this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: value.toString(), form: this.form})
                if (!this.reset) { this.valid() }
            },
            valid () {
                if (!this.readonly) {
                    let value = this.objectModel
                    let hasError = false
                    if (this.required && (value === '' || value.length === 0)) {
                        hasError = true
                        this.errorMessage = '请输入必填项'
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.form})
                }
            }
        }
    }
</script>
