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
    import bus from '../../router/bus'

    export default {
        name: 'm-display',
        mixins: [mixin],
        computed: {
            dataDomain () {
                return _.get(this.define, 'dataDomain', '')
            },
            key(){
                return _.get(this.define, 'ral_key', '')
            }
        },
        mounted(){
            bus.$on(this.dataDomain + 'add',data=>{
                this.objectModel = data[this.key]||''
            })
            bus.$on(this.dataDomain + 'delete',()=>{
                this.objectModel = ''
            })
        },
        methods: {
            valid() {
                console.log('valid will do nothing except commit no error')
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.fixForm})
            }
        }
    }
</script>
<style scoped>
    .box{
        padding: 16px;
    }
</style>
