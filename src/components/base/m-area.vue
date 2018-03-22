<template>
    <div>
        <Row>
            <Col span="10" style="margin-right: 15px" ref="cascaderCt">
                <Cascader :data="data" :modal="selectModal" :readonly="readonly" :disabled="readonly" placeholder="请选择省市区" @on-change="getSelect"></Cascader>
            </Col>
            <Col span="10">
                <Input v-model="address" placeholder="输入详细地址" @on-blur="addAddress" :readonly="readonly" :disabled="readonly"></Input>
            </Col>
            <Col span="2" style="text-align: center;height: 32px"  @click="showMap">
                <Icon type="android-pin" style="color:#495060;font-size:17px;margin-top: 6px;cursor:pointer;" @click.native="showMap"></Icon>
            </Col>
            <mLayer :value="showLayer" titleText="在地图上的位置" @on-cancel="handleCancel" @on-ok="handleOk">
                <el-amap ref="map" vid="amapDemo" :zoom="12" class="amap-demo"></el-amap>
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
    import {lazyAMapApiLoaderInstance} from 'vue-amap'
    import addressData from '../../assets/jsonData/address.json'

    export default {
        mixins: [mixin],
        data () {
            return {
                data:[],
                address:'',
                showLayer:false,
                selectModal:'',
                map:'',
                searchName:'',
            }
        },
        watch:{
            objectModel(){
                this.handleDefault()
            }
        },
        mounted(){
            this.data = addressData
            this.handleDefault()
        },
        methods: {
            handleDefault(){
                if(this.objectModel){
                    this.selectModal = this.objectModel.area
                    this.address = this.objectModel.address
                    this.searchName = this.objectModel.value
                    this.$nextTick(()=>{
                        this.$refs.cascaderCt.$el.querySelectorAll('.ivu-input')[0].value = this.objectModel.area.join('/')
                    })
                }
            },
            showMap(){
                this.showLayer = true

                this.map = this.$refs.map.$amap

                lazyAMapApiLoaderInstance.load().then(() => {

                    let placeSearch = new AMap.PlaceSearch({
                        pageSize: 1,
                        pageIndex: 1,
                        map: this.map
                    })

                    placeSearch.search(this.searchName);
                })
            },

            handleOk(){
                this.showLayer = false
            },
            handleCancel(){
                this.showLayer = false
            },
            getSelect(arg){
                this.selectModal = _.cloneDeep(arg)
                this.concatAddress(arg,this.address)
            },
            addAddress(){
                this.concatAddress(this.selectModal,this.address)
            },
            concatAddress(arg,address){
                if(arg.length >0){
                    this.searchName = ''
                    arg.forEach(v=>{
                        this.searchName += v
                    })
                }

                this.searchName += address

                this.objectModel ={
                    area : this.selectModal,
                    address : address,
                    value: this.searchName
                }
            },
            valid(){
                let hasError = false
                if (!this.readonly) {
                    if (this.required) {
                        if (this.objectModel.area || this.objectModel.address) {
                            hasError = true
                            this.errorMessage = '请填写地址信息'
                        }
                    }
                }
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.fixForm})
            },
        }
    }
</script>
<style scoped>
    .amap-demo {
        height: 100%;
    }

    .search-box {
        position: absolute;
        top: 25px;
        left: 20px;
    }

    .placeSearch {
        width: 100%;
        height: 500px;
    }
</style>
