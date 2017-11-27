<template>
    <div>
        <Row>
            <div class="search">
                <Input v-model="objectModel" :placeholder="placeholder" readonly :disabled="readonly">
                    <Button slot="append" @click="handleChooseClick" :cursor="readonly?'default':'pointer'">选择</Button>
                </Input>
            </div>
            <mLayer v-if="showLayer" :value="showLayer" :titleText="placeholder" @on-cancel="handleCancel" @on-ok="handleOk">
                <component
                    :is="downData.ui_type"
                    :uid="downData.ui_id"
                    :define="downData.ui_define"
                    :form="downData.ui_form"
                ></component>
            </mLayer>
        </Row>
        <Row>
            <div v-if="isError" class="gateway-item-error">{{errorMessage}}</div>
            <div v-else class="occupation gateway-item-error">隐藏</div>
        </Row>
    </div>
</template>
<script>
    import mixin from './mixin'
    import _ from 'lodash'
    import { FORM_ELEMENT_VALUE } from 'store/Mutation'
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'
    import {getData} from 'utils/actionUtils'

export default {
    name: 'm-input-choose',
    mixins: [mixin],
    data () {
        return {
            showLayer:false,
            downData:[],
            isError:false
        }
    },
    computed: {
        url () {
            return _.get(this.define, 'url', '')
        },
        placeholder () {
            return _.get(this.define, 'placeholder', '请选择相关信息')
        },
        dataDomain () {
            return _.get(this.define, 'dataDomain', '')
        },
        tableName () {
            return _.get(this.define, 'tableName', '')
        },
        backUrl(){
            return _.get(this.define, 'backUrl', '')
        }
    },
    methods: {
        handleChooseClick(){
            if(this.readonly){return}
            getData(this.url,(data,err)=>{
                if (data) {
                    this.downData = data.ui_content[0]
                }
            })
            this.showLayer = true
        },
        handleCancel(){
            this.showLayer = false
            this.valid()
        },
        handleOk(){
            this.showLayer = false
            this.getChooseData()
        },
        getChooseData(){
            let action={
                url:this.backUrl,
                type: 'GET',
                queryParams:{
                    id:_.get(this.$store.state.formData[this.dataDomain],[this.tableName,'id'], '')
                }
            }
            getData(action,(data)=>{
                if (data) {
                    for(let key of Object.keys(data)){
                        this.$store.commit(FORM_ELEMENT_VALUE, {[key]: {value: data[key],type: 'mInput'}, form: this.formTmp})
                    }
                }

                this.valid()
                if (this.objectModel !== '') {
                    this.isError = false
                    this.errorMessage = ''
                }
            })
        },
        valid(){
            if (!this.readonly) {
                if (this.required) {
                    if (this.objectModel === '') {
                        this.isError = true
                        this.errorMessage = '请选择必填项'
                    }
                }
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: this.isError, form: this.form})
            } else {
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.form})
            }
        }
    }
}
</script>
<style scoped>

</style>
