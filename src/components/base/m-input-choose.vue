<template>
    <div>
        <div class="search">
            <Input v-model="inputValue" :placeholder="placeholder" readonly disabled >
                <Button slot="append" @click="handleChooseClick">选择</Button>
            </Input>
        </div>
        <mLayer v-if="showLayer" :value="showLayer" :titleText="placeholder" @on-cancel="handleCancel" @on-ok="handleOk">
            <component
                :is="downData.ui_content[0].ui_type"
                :uid="downData.ui_content[0].ui_id"
            ></component>
        </mLayer>
    </div>
</template>
<script>
    import mixin from './mixin'
    import _ from 'lodash'
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'

export default {
    props: {
        url: {
            type: null,
            default:'/api/filter/getPage/'
        },
        placeholder:{
            type:String,
            default:'请选择'
        }
    },
    data () {
        return {
            inputValue:'',
            showLayer:false,
            downData:[]
        }
    },
    computed: {
    },
    watch: {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
        handleChooseClick(){
            getData(this.url,(data,err)=>{
                if (data) {
                    this.downData = data
                }
            })
            this.showLayer = true
        },
        handleCancel(){
            this.showLayer = false

        },
        handleOk(){
            this.showLayer = false

        },
        getChooseData(){
            //this.inputValue = this.$store.state     _.get(this.$store.state., , '')
        }
    }
}
</script>
<style scoped>

</style>
