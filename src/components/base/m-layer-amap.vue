<template>
    <div class="container">
        <el-amap ref="map" vid="amapDemo" :zoom="12" class="amap-demo"></el-amap>
        <div id="panel" style="display: none"></div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import {lazyAMapApiLoaderInstance} from 'vue-amap'

    export default {
        props: ['define'],
        data () {
            return {
                map:{},
                dataList:[],
                infoWindow:''
            }
        },
        mounted(){
            this.$nextTick(()=>{
                if(this.define.length){
                    this.showMap()
                }
            })
        },
        methods: {
            showMap(){
                this.map = this.$refs.map.$amap

                lazyAMapApiLoaderInstance.load().then(() => {

                    let placeSearch = new AMap.PlaceSearch({
                        pageSize: 1,
                        pageIndex: 1,
                        zoom:4,
                        panel:'panel'
                    })


                    for(let i=0;i<this.define.length;i++){
                        let promise = new Promise((resolve)=>{
                            placeSearch.search(this.define[i].FAddress.value, (status, result)=>{
                                resolve(result)
                            })

                        })
                        promise.then((result)=>{
                            let obj={
                                name:this.define[i],
                                result:result.poiList.pois[0]
                            }
                            this.dataList.push(obj)
                            if(this.dataList.length === this.define.length){
                                this.showMarker(this.dataList)
                            }
                        })
                    }
                })
            },
            //拿到数据画点和提示内容
            showMarker(data){
                let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                for (let i = 0; i < data.length; i++) {
                    let marker = new AMap.Marker({
                        position: [data[i].result.location.lng,data[i].result.location.lat],
                        map: this.map
                    })
                    marker.content = `
                    <div>
                        <div style="float: left;">
                            <img src="${data[i].result.photos[0].url}" alt="${data[i].result.photos[0].title}" style="width:100%;height:150px;">
                        </div>
                        <div style="float: left;padding-left: 5px">
                            <p style="font-size: 15px;padding-bottom: 3px">${data[i].name.FAddress.value}</p>
                            <p style="color: #666">${data[i].name.FCustomerName?data[i].name.FCustomerName.value?data[i].name.FCustomerName.value:data[i].name.FCustomerName?data[i].name.FCustomerName:'':''}</p>
                        </div>
                    </div>`

                    marker.on('click', (e)=>{
                        infoWindow.setContent(e.target.content);
                        infoWindow.open(this.map, e.target.getPosition());
                    });
                    marker.emit('click', {target: marker});
                }

                this.map.setFitView();
            }
        }
    }
</script>
<style scoped>
    .amap-demo {
        height: 100%;
    }
    #panel {
        display: none;
    }
    .container{
        height: 100%;
    }
</style>
