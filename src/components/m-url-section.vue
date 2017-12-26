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
    import fetch from '../utils/DefineFetcher'
    import { FETCH_FORM_DATA} from 'store/Action'
    import _ from 'lodash'

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
                downData: {},
                dataUrl: null,
                statusUrl: null,
            }
        },
        provide: {
            form: 'form'
        },
        watch: {
            // $route () {
            //     this.handleMainUrl(this.$route.query.url)
            // },
            define () {
                this.handleDefine(this.define)
            },
            dataUrl(newUrl) {
                if(newUrl){
                    this.$store.dispatch(FETCH_FORM_DATA, {url: newUrl})
                }
            },
            statusUrl(newUrl) {
                if (newUrl) {
                    this.$store.dispatch('putStatus',newUrl)
                }
            }
        },
        mounted() {
            if(Object.keys(this.define).length !== 0){
                this.handleDefine(this.define)
            }else{
                console.log('URL输入错误')
            }
        },
        methods:{
            handleDefine(data){
                this.dataUrl = data.dataUrl
                this.statusUrl = data.statusUrl
                this.handleUrl(data.defineUrl)
            },
            handleUrl(defineUrl){
                let url = _.cloneDeep(defineUrl)
                if(url === '' || Object.keys(url).length === 0){return}
                getData(url,(data)=>{
                    if (data) {
                        this.downData = data
                    }
                })
            }
        }
    }
</script>

<style scoped>
</style>
