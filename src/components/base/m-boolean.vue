<template>
    <div>
        <Row>
            <Switch v-model="switchValue" @on-change="change"></Switch>
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
        name: 'm-boolean',
        mixins: [mixin],
        data(){
          return {
              switchValue:false,
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

