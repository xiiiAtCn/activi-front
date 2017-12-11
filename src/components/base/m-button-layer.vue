<template>
    <div>
        <Button :type="define.type || 'default'" :size="define.size || 'default'" @click="handleClick">{{define.text}}</Button>
        <mLayer :value="showLayer" :titleText="define.text" @on-cancel="handleCancel" @on-ok="handleOk">
            <component
                v-if="item"
                v-for="item in downData.ui_content"
                :is="item.ui_type"
                :define="item.ui_define"
                :form="item.ui_form"
            ></component>
        </mLayer>
    </div>
</template>
<script>
    import _ from 'lodash'
    import {getData,dispatch} from 'utils/actionUtils'

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
        methods: {
            handleClick(){
                getData(this.define.getDataAction.url,(data)=>{
                    if (data) {
                        this.downData= data
                    }
                })
                this.showLayer =true
            },
            handleOk(){
                let action=this.define.saveDataAction.url
                action.body=_.get(this.$store.state.formData['form'],'list', '')
                if(action.type === 'serverAction'  || action.type === 'link') {
                    dispatch(action)
                }
                this.showLayer = false
            },
            handleCancel(){
                this.showLayer = false
            }
        }
    }
</script>
<style scoped>

</style>
