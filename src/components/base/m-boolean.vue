<template>
    <div>
        <Row>
            <Checkbox v-model="objectModel" :disabled="readonly" @on-change="valid">{{define.title}}</Checkbox>
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
                let hasError = false
                if(this.required){
                    if(!this.objectModel){
                        hasError = true
                        this.errorMessage = '必须勾选项！'
                    }
                }
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.fixForm})
            }
        }
    }
</script>

