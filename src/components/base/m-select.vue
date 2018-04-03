<template>
    <div v-show="visible">
        <Row>
            <Select
                v-model="objectModel"
                :multiple="multiple"
                :disabled="readonly"
                :clearable="clearable"
                :loading="loading"
                :size="size"
                :placeholder="placeholder"
                :not-found-text="notFound"
                :placement="placement"
                :transfer="transfer"
                @on-change="valueChange">
                <Option
                    v-for="(item, index) in items"
                    :key="index"
                    :value="item.id">
                    <template v-if="item.icon">
                        <Icon :type="item.icon"></Icon>
                    </template>
                    {{item.name}}
                </Option>
            </Select>
        </Row>
        <Row>
            <div
                v-if="hasError"
                class="gateway-item-error">
                {{errorMessage}}
            </div>
            <div
                v-else
                class="occupation gateway-item-error">
                隐藏
            </div>
        </Row>
    </div>
</template>
<script>
    import _ from 'lodash'
    import mixin from './mixin'
    import { ELEMENT_VALIDATE_RESULT } from 'store/Action'
    import { FORM_ELEMENT_VALUE } from 'store/Mutation'

    export default {
        name: 'm-select',
        mixins: [mixin],
        computed: {
            items () {
                return _.get(this.define, 'items', [])
            },
            clearable () {
                return _.get(this.define, 'clearable', true)
            },
            multiple () {
                return _.get(this.define, 'multiple', false)
            },
            size () {
                return _.get(this.define, 'szie', 'default')
            },
            placeholder () {
                return this.readonly?'':_.get(this.define, 'placeholder', '请选择')
            },
            notFound () {
                return _.get(this.define, 'notFound', '无匹配数据')
            },
            placement () {
                return _.get(this.define, 'placement', 'bottom')
            },
            transfer () {
                return _.get(this.define, 'transfer', false)
            }
        },
        data () {
            return {
                loading: false
            }
        },
        methods: {
            valueChange (value) {
                let list = this.items
                let model = {}
                for (let i = 0; i < list.length; i++) {
                    let tmp = list[i]
                    if (tmp['id'] === value) {
                        model['name'] = tmp['name']
                        model['value'] = tmp['id']
                        break
                    }
                }
                this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: model, form: this.form})
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
                } else {
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.form})
                }
            }
        }
    }
</script>
