<template>
    <component
        v-if="downData"
        :is="downData.ui_type"
        :define="downData"
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
            }
        },
        data() {
            return {
                downData: {}
            }
        },
        watch: {
            $route () {
                this.handleUrl(this.$route.query.url)
            },
        },
        mounted() {
            this.query.url && this.handleUrl('/api/menu/getPage/'+this.query.url)
        },
        methods:{
            handleUrl(query){
                let url = _.cloneDeep(query)
                getData(url,(data)=>{
                    if (data) {
                        this.downData = data
                        this.downData.ui_type = 'm-url-section'
                    }
                })
            }
        }
    }
</script>

<style scoped>
</style>
