<template>
    <div>
        <Row>
            <Checkbox v-model="objectModel" :disabled="readonly">{{define.title}}</Checkbox>
        </Row>
        <Row>
            <div v-if="hasError" class="gateway-item-error">{{errorMessage}}</div>
            <div v-else class="occupation gateway-item-error">隐藏</div>
        </Row>
    </div>
</template>
<script>
    import mixin from './mixin'
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'

    export default {
        mixins: [mixin],
        mounted(){
            (this.objectModel === '') && (this.objectModel = false)
        },
        methods: {
            valid(){
                if(this.required){
                    let hasError = false
                    if(this.objectModel){
                        this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.fixForm})
                    }else{
                        hasError = true
                        this.errorMessage = '必须勾选项！'
                        this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.fixForm})
                    }
                }else{
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.fixForm})
                }
            }
        }
    }
</script>

