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
    import Vue from 'vue'
    import {dispatch} from '../../../utils/actionUtils'
    import _ from 'lodash'
    import VueResource from 'vue-resource'
    Vue.use(VueResource)
export default {
        data () {
            return {
//                获取节点详细URL
                getNodeDetails: '/api/fileTree/view/infoDetails',
                columns: [],
                data: [],
                childInfo: [],
//                去掉tab切换css动画
                noCssTransition: false
            }
        },
        methods: {
            getQuery: function (query) {
                console.log('路由传参： ', query)
                this.$http.post(this.getNodeDetails, query).then((res) => {
                    console.log('node端返回处理数据', res.body)
                    this.columns = res.body.columns
                    this.data = res.body.data
                    this.childInfo = res.body.childInfo
                })
            }
        },
        mounted () {
            this.getQuery(this.$route.query)
    },
        watch: {
            '$route' () {
                this.getQuery(this.$route.query)
            }
        }
    }
</script>

<style scoped>
    .toTop {
        margin-top: 26px;
    }
</style>
