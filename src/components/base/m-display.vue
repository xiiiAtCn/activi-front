<template>
    <div>
        <Row >
            <Input :element-id="focusId"
                   v-model="objectModel"
                   disabled
            >
            </Input>
        </Row>
        <Row >
            <div class="box"></div>
        </Row>
    </div>
</template>
<script>
    import mixin from './mixin'
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'
    export default {
        name: 'm-display',
        mixins: [mixin],
        computed: {
        },
        methods: {
            valid() {
                let formFix = this.tmpForm?this.tmpForm: this.form
                console.log('valid will do nothing except commit no error')
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: formFix})
            }
        }
    }
</script>
<style scoped>
    .box{
        padding: 16px;
    }
</style>
