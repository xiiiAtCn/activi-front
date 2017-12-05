<template>
    <div>
        <Button :type="define.type || 'default'" :size="define.size || 'default'" @click="handleClick">{{define.text}}</Button>
        <mLayer :value="showLayer" :titleText="define.text"  @on-cancel="handleCancel" @on-ok="handleOk">
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
                return urlToString(this.define.action)
            }
        },
        methods: {
            handleClick(){
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
