<template>
    <div>
        <Row>
            <div class="search">
                <Input v-model="objectModel" :placeholder="placeholder" readonly :disabled="readonly">
                    <Button slot="append" @click="handleDeleteChoose" v-show="objectModel === '' ? 0: 1" :style="{cursor:readonly?'default':'pointer'}" icon="close"></Button>
                    <Button slot="append" @click="handleChooseClick" :style="{cursor:readonly?'default':'pointer'}">选择</Button>
                </Input>
            </div>
            <mLayer :value="showLayer" :titleText="layerTitle" @on-cancel="handleCancel" @on-ok="handleOk">
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
                downData:[],
                showClose:false
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
            layerTitle(){
                return  '请选择' + _.get(this.define, 'title', '相关信息')
            },
            key(){
                return _.get(this.define, 'ral_key', '')
            }
        },
        mounted(){
            //bus接收双击确定事件
            bus.$on(this.dataDomain + '_dbclick', id =>{
                if(id && _.isString(id)){
                    this.showLayer = false
                    this.getChooseData(id)
                }
            })
        },
        methods: {
            handleChooseClick(){
                if(this.readonly){return}
                getData(this.url,(data)=>{
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
                let id = _.get(this.$store.state.formData['_' + this.dataDomain],['id'], '')
                this.getChooseData(id)
            },
            getChooseData(id){
                let action={
                    url:this.backUrl,
                    type: 'GET',
                    queryParams:{
                        id:id
                    }
                }
                getData(action,(data)=>{
                    if (data) {
                        this.handleData(data)
                    }

                })
            },
            handleData(data){
                bus.$emit(this.dataDomain + 'add',data)

                this.objectModel = data[this.key]

                this.valid()
                if (this.objectModel !== '') {
                    this.errorMessage = ''
                }
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
            },
            //处理删除事件
            handleDeleteChoose(){
                bus.$emit(this.dataDomain + 'delete')
                this.objectModel = ''
            }
        }
    }
</script>
