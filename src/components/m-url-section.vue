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
            query:{
                type:null,
                default:''
            },
            form:{
                type:String,
                default:'form'
            }
        },
        data() {
            return {
                downData: {},
                dataUrl: '',
                statusUrl: '',
                defineUrl:''
            }
        },
        provide: {
            form: 'form'
        },
        watch: {
            $route () {
                this.handleQueryUrl(this.$route.query)
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
            this.query.url && this.handleQueryUrl(this.query)
        },
        methods:{
            //处理路由的url
            handleQueryUrl(query){
                let url = _.cloneDeep(query.url)
                console.log('handle query is ',url)
                getData(url,(data,err)=>{
                    if(err){
                        console.log('handle query error')
                    }else if (data) {
                        this.dataUrl = _.get(data,'dataUrl','')
                        this.statusUrl = _.get(data,'statusUrl','')
                        this.defineUrl = _.get(data,'defineUrl','')
                        this.handleDefineUrl(this.defineUrl)
                    }
                })
            },
            //处理defineUrl
            handleDefineUrl(defineUrl){
                let url = _.cloneDeep(defineUrl)
                if(url === '' || Object.keys(url).length === 0){return}
                getData(url,(data,err)=>{
                    if(err){
                        console.log('url-section error')
                    }else if (data) {
                        this.downData = data
                    }
                })
            },
            //重载数据
            reloadData(dataUrl){
                if(!dataUrl){return}
                let url = _.cloneDeep(dataUrl)
                getData(url,(data)=>{
                    if (data) {
                        this.downData = data
                    }
                })
            }
        }
    }
</script>
