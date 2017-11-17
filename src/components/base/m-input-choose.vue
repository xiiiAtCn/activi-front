<template>
    <div>
        <Row>
            <div class="search">
                <Input v-model="inputValue" :placeholder="placeholder" readonly disabled >
                    <Button slot="append" @click="handleChooseClick">选择</Button>
                </Input>
            </div>
            <mLayer v-if="showLayer" :value="showLayer" :titleText="placeholder" @on-cancel="handleCancel" @on-ok="handleOk">
                <component
                    :is="downData.ui_content[0].ui_type"
                    :uid="downData.ui_content[0].ui_id"
                    :define="downData.ui_content[0].ui_define"
                ></component>
            </mLayer>
        </Row>
        <Row>
            <div v-if="hasError" class="gateway-item-error">{{errorMessage}}</div>
            <div v-else class="occupation gateway-item-error">隐藏</div>
        </Row>
    </div>
</template>
<script>
    import mixin from './mixin'
    import _ from 'lodash'
    import {ELEMENT_VALIDATE_RESULT} from 'store/Action'
    import {getData} from 'utils/actionUtils'

export default {
    name: 'm-input-choose',
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
            this.inputCheck()
        },
        handleOk(){
            this.showLayer = false
            this.getChooseData()
            this.inputCheck()
        },
        getChooseData(){
            //this.inputValue = _.get(this.$store.state., , '')
        },
        valid () {
            if (!this.readonly) {
                let hasError = false
                let value = String(this.objectModel == undefined ? '' : this.objectModel)
                if (this.required) {
                    if (value === '') {
                        hasError = true
                        this.errorMessage = '请输入必填项'
                    } else if (value.length < this.minLength) {
                        hasError = true
                        this.errorMessage = `输入最小长度应不小于${this.minLength}`
                    } else if (value.length > this.maxLength) {
                        hasError = true
                        this.errorMessage = `输入最大长度应不大于${this.maxLength}`
                    } else {
                        let regex = new RegExp(this.pattern)
                        if (!regex.test(this.objectModel)) {
                            hasError = true
                            this.errorMessage = '输入不符合要求, 请重新输入'
                        }
                    }
                }
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.form})
            }
        },
        inputCheck () {
            this.valid()
        }
    }
}
</script>
<style scoped>

</style>
