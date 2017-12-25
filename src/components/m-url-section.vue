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
            },
            query:{
                type:null,
                default () {
                    return {}
                }
            }
        },
        data() {
            return {
                downData: {}
            }
        },
        provide: {
            foo: 'bar'
        },
        watch: {
            $route () {
                this.handleMainUrl(this.$route.query.url)
            },
        },
        mounted() {
            if(Object.keys(this.query).length !== 0){
                this.handleMainUrl(this.query)
            }else if(Object.keys(this.define).length !== 0){
                this.handleUrl(this.define.urlObject)
            }else{
                console.log('URL输入错误')
            }
        },
        methods:{
            handleMainUrl(url){
                fetch(url, (err, post) => {
                    if (err) {
                        console.log('main error:', err.message)
                    } else {
                        this.downData = post
                    }
                })
            },
            handleUrl(url){
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
