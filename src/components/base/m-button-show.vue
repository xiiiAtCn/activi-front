<template>
    <div>
        <Button :type="define.type || 'default'" :size="define.size || 'default'" @click="handleClick">{{define.text}}</Button>
        <mLayer :value="showLayer" :titleText="define.text">
            <iframe
                :src="iframeUrl"
                frameborder="0"
                scrolling="no"
                style="width: 100%; min-height:600px;"
            ></iframe>
        </mLayer>
    </div>
</template>
<script>
    import {urlToString} from 'utils/actionUtils'

    export default {
        props:['define'],
        data () {
            return {
                showLayer:false,
            }
        },
        computed: {
            iframeUrl () {
                return urlToString(this.define.action.url)
            }
        },
        methods: {
            handleClick(){
                this.showLayer =true
            }
        }
    }
</script>
<style scoped>

</style>
