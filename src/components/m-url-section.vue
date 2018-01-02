<template>
    <component
        v-if="downData"
        :is="downData.ui_type"
        :define="downData.ui_define"
        :content="downData.ui_content"
        :form="form"
    ></component>
</template>

<script>
    import {getData} from 'utils/actionUtils'

    export default {
        props:{
            define:{
                type:null,
                default () {
                    return {}
                }
            },
            form:{
                type:String,
                default:'form'
            }
        },
        data() {
            return {
                downData: {}
            }
        },
        mounted() {
            this.handleUrl(this.define.urlObject)
        },
        methods:{
            handleUrl(url){
                if(url === '' || Object.keys(url).length === 0){return}
                getData(url,(data)=>{
                    if (data) {
                        this.downData= data
                    }
                })
            }
        }
    }
</script>

<style scoped>
</style>
