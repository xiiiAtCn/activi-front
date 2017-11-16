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
    import {getData} from 'utils/actionUtils'

export default {
    name: 'm-input-percent',
    mixins: [mixin],
    data () {
        return {
            inputValue:'',
            showLayer:false,
            downData:[]
        }
    },
    computed: {
        url () {
            return _.get(this.define, 'url', '/api/filter/getSection/%E4%BE%9B%E5%BA%94%E5%95%86/%E5%85%83%E6%95%B0%E6%8D%AE')
        },
        placeholder () {
            return _.get(this.define, 'placeholder', '请选择相关信息')
        }
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
            //this.inputValue = _.get(this.$store.state., , '')
        }
    }
}
</script>
<style scoped>

</style>
