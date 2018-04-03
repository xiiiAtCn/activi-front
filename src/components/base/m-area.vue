<template>
    <div>
        <Row>
            <Col span="10" style="margin-right: 15px" ref="cascaderCt">
                <Cascader :data="data" :modal="selectModal" :readonly="readonly" :disabled="readonly" :placeholder="this.readonly?'':'请选择省市区'" @on-change="getSelect"></Cascader>
            </Col>
            <Col span="10">
                <Input v-model="address" :placeholder="this.readonly?'':'输入详细地址'" @on-blur="addAddress" :readonly="readonly" :disabled="readonly"></Input>
            </Col>
            <Col span="2" style="text-align: center;height: 32px"  @click="showMap">
                <Icon type="android-pin" style="color:#495060;font-size:17px;margin-top: 6px;cursor:pointer;" @click.native="showMap"></Icon>
            </Col>
            <mLayer :value="showLayer" titleText="在地图上的位置" @on-cancel="handleCancel" @on-ok="handleOk" okText="选择当前位置">
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
                marker:null,
                layerData:{},
                infoWindow:null
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
            //转换字段
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
            //展示地址在地图上的位置
            showMap(){
                this.showLayer = true

                this.map = this.$refs.map.$amap

                lazyAMapApiLoaderInstance.load().then(() => {

                    let geocoder = new AMap.Geocoder({
                        radius: 1000
                    })

                    if(this.objectModel.ll){
                        this.drawMarker(this.objectModel.ll,this.objectModel.value)
                    }else{
                        geocoder.getLocation(this.searchName, (status, result)=>{
                            if (status === 'complete' && result.info === 'OK') {

                                let geocode = result.geocodes[0]

                                this.drawMarker([geocode.location.getLng(),geocode.location.getLat()],geocode.formattedAddress)
                            }
                        })
                    }

                    this.map.on('click', (e)=>{
                        this.showClick([e.lnglat.lng,e.lnglat.lat])
                    });
                })
            },
            //点击地图获得坐标点
            showClick(lnglatXY){
                let geocoder = new AMap.Geocoder({
                    radius: 1000
                })
                geocoder.getAddress(lnglatXY, (status, result)=>{
                    if (status === 'complete' && result.info === 'OK') {

                        let area = result.regeocode.addressComponent

                        this.layerData = {
                            area:[
                                area.province,
                                area.city || '直辖区',
                                area.district
                            ],
                            address:result.regeocode.formattedAddress.replace(area.province + area.city + area.district,''),
                            value:result.regeocode.formattedAddress,
                            ll:lnglatXY
                        }

                        this.drawMarker(lnglatXY,result.regeocode.formattedAddress)
                    }
                })

            },
            //根据经纬度画出坐标点
            drawMarker(ll,title){
                if(this.marker){
                    this.marker.setMap(null)
                    this.marker = null
                    this.infoWindow.close()
                }

                this.marker = new AMap.Marker({
                    map: this.map,
                    position: ll
                })

                this.infoWindow = new AMap.InfoWindow({
                    content: title,
                    offset: {x: 0, y: -30}
                })

                this.marker.on("mouseover", (e)=>{
                    this.infoWindow.open(this.map, this.marker.getPosition())
                })

                this.infoWindow.open(this.map, this.marker.getPosition())
                this.map.setZoomAndCenter(12,ll)//锁定地图中心，缩放等级和中心点

                this.map.setFitView()
            },
            handleOk(){
                this.showLayer = false
                if(!this.readonly){
                    this.objectModel = _.cloneDeep(this.layerData)
                }
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
            //拼接地址
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
