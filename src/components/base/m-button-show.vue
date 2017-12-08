<template>
    <div>
        <Button :type="define.type || 'default'" :size="define.size || 'default'" @click="handleClick">{{define.text}}</Button>
        <mLayer :value="showLayer" :titleText="define.text"  @on-cancel="handleCancel" @on-ok="handleOk">
            <iframe
                v-if="iframeUrl"
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
                iframeUrl:''
            }
        },
        methods: {
            handleClick(){
                this.iframeUrl = urlToString(this.define.action)
                this.showLayer =true
            },
            handleCancel(){
                this.showLayer = false
            },
            handleOk(){
                this.showLayer = false
            }
        }
    }
</script>
<style scoped>

</style>
