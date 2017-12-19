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
              isError:false
          }
        },
        mounted(){
            (this.objectModel === '') && (this.objectModel = false)
        },
        methods: {
            valid(){
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.form})
            }
        }
    }
</script>

