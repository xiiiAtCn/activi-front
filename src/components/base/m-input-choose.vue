<template>
    <div>
        <Row>
            <div class="search">
                <Input v-model="objectModel" :placeholder="placeholder" readonly :disabled="readonly">
                    <Button slot="append" @click="handleChooseClick" :style="{cursor:readonly?'default':'pointer'}">选择</Button>
                </Input>
            </div>
            <mLayer :value="showLayer" :titleText="placeholder" @on-cancel="handleCancel" @on-ok="handleOk">
                <component
                    :is="downData.ui_type"
                    :define="downData.ui_define"
                    :form="downData.ui_form"
                ></component>
            </mLayer>
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
    import { FORM_ELEMENT_VALUE } from 'store/Mutation'
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'
    import {getData} from 'utils/actionUtils'
    import bus from '../../router/bus'

    export default {
        name: 'm-input-choose',
        mixins: [mixin],
        data () {
            return {
                showLayer:false,
                downData:[]
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
            },
            eventId(){
                return _.get(this.define, 'event', '')
            }
        },
        mounted(){
        },
        methods: {
            handleChooseClick(){
                if(this.readonly){return}
                getData(this.url,(data,err)=>{
                    if (data) {
                        this.downData = data
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
                        id:_.get(this.$store.state.formData['_' + this.dataDomain],[this.tableName], '')
                    }
                }
                getData(action,(data)=>{
                    let formFix = this.tmpForm?this.tmpForm: this.form
                    if (data) {
                        for(let i=0;i<data.length;i++){
                            this.$store.commit(FORM_ELEMENT_VALUE, { [ data[i].key ]: { value: data[i].value, type: ( this.define.name === data[i].key ? 'mInputChoose' : 'mDisplay')}, form: formFix})
                        }
                    }
                    //bus.$emit()
                    this.valid()
                    if (this.objectModel !== '') {
                        this.errorMessage = ''
                    }
                })
            },
            valid(){
                let hasError =false
                if (!this.readonly) {
                    if (this.required) {
                        if (this.objectModel === '') {
                            hasError = true
                            this.errorMessage = '请选择必填项'
                        }
                    }
                }
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.fixForm})
            }
        }
    }
</script>
