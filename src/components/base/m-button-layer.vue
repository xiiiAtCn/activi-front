<template>
    <div>
        <Button :type="define.type || 'default'" :size="define.size || 'default'" @click="handleClick">{{define.text}}</Button>
        <mLayer :value="showLayer" :titleText="define.text" @on-cancel="handleCancel" @on-ok="handleOk">
            <component
                :is="downData.ui_type"
                :uid="downData.ui_id"
                :define="downData.ui_define"
                :form="downData.ui_form"
            ></component>
            <!--<iframe
                v-else
                :src="iframeUrl"
                frameborder="0"
                scrolling="no"
                style="width: 100%; min-height:600px;"
            ></iframe>-->
        </mLayer>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { FORM_ELEMENT_VALUE } from 'store/Mutation'
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'
    import {getData} from 'utils/actionUtils'

    export default {
        props:{
            define:{}
        },
        data () {
            return {
                showLayer:false,
                downData:{}
            }
        },
        computed: {
        },
        mounted(){
            getData(this.define.getDataAction.url,(data)=>{
                if (data) {
                    this.downData= data.ui_content[0]
                }
            })
        },
        methods: {
            handleClick(){
                this.showLayer =true
            },
            handleOk(){
                let action=this.define.saveDataAction.url
                action.body=_.get(this.$store.state.formData['form'],'list', '')
                if(action.type === 'serverAction'  || action.type === 'link') {
                    dispatch(action)
                }
            },
            handleCancel(){}
        }
    }
</script>
<style scoped>

</style>
