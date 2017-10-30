<template>
    <div>
        <Row>
            <Table :columns="columns" :data="data"></Table>
        </Row>
        <Row class="toTop">
            <Tabs type="card" :animated="noCssTransition" v-if="childInfo.length > 0">
                <TabPane v-for="(item,index) in childInfo" :label="item.childMeta">
                    <Table :columns="item.childColumns" :data="item.childData"></Table>
                </TabPane>
            </Tabs>
        </Row>
    </div>
</template>

<script>
    export default {
        data () {
            return {
//                获取节点详细URL
                getNodeDetails: '/api/boTree/view/infoDetails',
                columns: [],
                data: [],
                childInfo: [],
//                去掉tab切换css动画
                noCssTransition: false
            }
        },
        methods: {
//            进行对比的数组, 参数ary为数组,key为要对比的key值
            unqAry: function (ary, key) {
                let newAry = [];
                for (let i of ary){
                    newAry.push(i[key])
                }
                return newAry
            },
//            抽取数组间不同的元素
            getDifference: function (arr, existArr, key) {
                let arr1 = this.unqAry(arr, key)
                let arr2 = this.unqAry(existArr, key)
                let difference = arr1.filter(x => arr2.indexOf(x) === -1).concat(arr2.filter(x => arr1.indexOf(x) === -1))
                return difference
            },
            getQuery: function (query) {
                this.setUrl(this.getNodeDetails).setBody(query).forPost(res => {
                    this.columns = res.body.columns
                    this.data = res.body.data
                    let existArr = res.body.childInfo
                    if (existArr.length > 0){
                        let arr = [];
                        arr.push(existArr[0])
                        existArr.splice(0,1)
                        let difference = this.getDifference(arr, existArr, 'childMeta')
                        for (let i of arr){
                            for (let j of existArr){
                                if (i.childMeta === j.childMeta){
                                    i.childData.push(j.childData[0])
                                }
                            }
                        }
                        for (let o of existArr){
                            for (let k of difference){
                                if (o.childMeta === k){
                                    arr.push(o)
                                }
                            }
                        }
                        this.childInfo = arr
                    } else {
                        this.childInfo = []
                    }
                })
            }
        },
        mounted(){
            this.getQuery(this.$route.query);
        },
        watch: {
            '$route' () {
                this.getQuery(this.$route.query);
            }
        }
    }
</script>

<style scoped>
    .toTop {
        margin-top: 26px;
    }
</style>
