<template>
    <component
        v-if="downData"
        :is="downData.ui_type"
        :define="downData.ui_define"
        :content="downData.ui_content"
    ></component>
</template>

<script>
    import fetch from '../utils/DefineFetcher'

    export default {
        props:{
            url:{
                type:null,
                default:''
            }
        },
        data() {
            return {
                downData: {}
            }
        },
        mounted() {
            this.handleUrl(this.url)
        },
        methods:{
            handleUrl(url){
                if(url === '' || Object.keys(url).length === 0){return}
                fetch(url, (err, data) => {
                    if (err) {
                        console.log('url-section error:', err.message)
                    } else {
                        this.downData = data
                    }
                })
            }
        }
    }
</script>

<style scoped>
</style>
