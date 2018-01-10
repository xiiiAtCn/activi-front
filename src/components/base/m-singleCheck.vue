<template>
    <div v-show="visible">
        <Row >
            <RadioGroup 
                v-model="objectModel" 
                :size="size" 
                :vertical="vertical" 
                @on-change="selectChange">
                <Radio 
                    v-for="(item, index) in items" 
                    :key="index" 
                    :label="item.id" 
                    :disabled="item.disabled || readonly">
                    <template v-if="item.icon">
                        <Icon :type="item.icon"></Icon>
                    </template>
                    <span>
                        {{item.name}}
                    </span>
                </Radio>
            </RadioGroup>
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
    import { FORM_ELEMENT_VALUE } from 'store/Mutation'

    export default {
        name: 'm-radio',
        mixins: [mixin],
        computed: {
            items () {
                return _.get(this.define, 'items', [])
            },
            size () {
                return _.get(this.define, 'size', 'large')
            },
            vertical () {
                return _.get(this.define, 'vertical', false)
            }
        },
        methods: {
            selectChange (value) {
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
                this.valid()
            },
            valid () {
                if (!this.readonly) {
                    let hasError = false
                    let value = this.objectModel
                    if (value === '') {
                        hasError = true
                        this.errorMessage = '请输入必填项'
                    }
                    setTimeout(() => {
                        this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.fixForm})
                    }, 1000)
                } else {
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.fixForm})
                }
            }
        }
    }
</script>