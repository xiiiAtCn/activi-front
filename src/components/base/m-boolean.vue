<template>
    <div>
        <Row>
            <Checkbox v-model="objectModel" :disabled="readonly">{{define.title}}</Checkbox>
        </Row>
        <Row>
            <div v-if="isError" class="gateway-item-error">{{errorMessage}}</div>
            <div v-else class="occupation gateway-item-error">隐藏</div>
        </Row>
    </div>
</template>
<script>
    import mixin from './mixin'
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'

    export default {
        mixins: [mixin],
        data(){
          return {
              isError:true
          }
        },
        methods: {
            change(){
                if(this.readonly){return}
                this.isError = false
            },
            valid(){
                if (!this.readonly) {
                    if (this.required) {
                        if(this.isError) { this.errorMessage = '请选择必填项'}
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: this.isError, form: this.form})
                } else {
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.form})
                }
            }
        }
    }
</script>

