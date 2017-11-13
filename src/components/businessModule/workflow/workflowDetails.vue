<template>
    <div class="childWrap">
        <Card class="cardBorder">
            <a slot="title" @click="close">
                <Icon type="close-round"></Icon>
                关闭
            </a>
            <p slot="extra">
                流程名称：{{ flowName }}
            </p>
            <Row>
                <Col span="11">
                    <Card class="childCard">
                        <p slot="title">应用模块</p>
                        <ul>
                            <li v-for="(item,index) in modules" class="li-dashed">
                                <a>{{ item.name }}</a>
                            </li>
                        </ul>
                    </Card>
                </Col>
            </Row>
            <Row class="top_20">
                <Col span="11" class="toRight">
                    <Card class="childCard">
                        <p slot="title">关联实体</p>
                        <ul>
                            <li v-for="(item,index) in bo" class="li-dashed">
                                <a>{{ item.name }}</a>
                            </li>
                        </ul>
                    </Card>
                </Col>
                <Col span="11">
                    <Card class="childCard">
                        <p slot="title">关联单据</p>
                        <ul>
                            <li v-for="(item,index) in bill" class="li-dashed">
                                <a>{{ item.name }}</a>
                            </li>
                        </ul>
                    </Card>
                </Col>
            </Row>
            <Row class="top_20">
                <Table :columns="detailColumns" :data="detailData" :border="tableBorder"></Table>
                <Page :total="dataCount" :page-size="pageSize" @on-change="pageChange" class="page"></Page>
            </Row>
        </Card>
    </div>

</template>


<script>
    export default{
        data () {
            return {
                urls: {
                    // 获取 detailsColumns
                    getDetailColumns: '/api/workflow/view/getDetailColumns',
                    // 获取 detailsData
                    getDetailData: '/api/workflow/view/getDetailData/'
                },
                detailColumns: [],
                detailData: [],
                // 默认不显示纵向边框
                tableBorder: false,
                // 初始化信息总条数
                dataCount: 0,
                // 每页显示多少条
                pageSize: 6,
                // 模块 实体 单据 前台数据
                modules: [
                    {
                        name: '应用模块1',
                        url: ''
                    }, {
                        name: '应用模块2',
                        url: ''
                    }, {
                        name: '应用模块3',
                        url: ''
                    }
                ],
                bo: [
                    {
                        name: 'BO-META 1',
                        url: ''
                    }, {
                        name: 'BO-META 2',
                        url: ''
                    }, {
                        name: 'BO-META 3',
                        url: ''
                    }
                ],
                bill: [
                    {
                        name: 'BILL-META 1',
                        url: ''
                    }, {
                        name: 'BILL-META 2',
                        url: ''
                    }, {
                        name: 'BILL-META 3',
                        url: ''
                    }
                ]
            }
        },
        computed: {
            flowName () {
                return this.$route.params.rowName
            }
        },
        methods: {
            format (time) {
                let temp = new Date(time)
                let y = temp.getFullYear()
                let m = temp.getMonth() + 1
                let d = temp.getDate()
                m < 10 ? m = `0${m}` : m
                d < 10 ? d = `0${d}` : d
                return `${y}-${m}-${d}`
            },
            close () {
                this.$router.push({ path: '/layoutContent/01/workflow' })
            },
            pageChange (currentPage) {
                this.getDetailChild(this.$route.params.rowId, currentPage - 1, this.pageSize, 'detailData')
            },
            getDetailChild (wfMetaId, pageNumber, pageSize, key) {
                let pageParams = `${wfMetaId}/${pageNumber}/${pageSize}`
                this.getRequest(this.urls.getDetailData, pageParams, key, '')
            },
            getRequest (url, argument, key, returnKey) {
                let reqUrl = `${url}${argument}`
                this.setUrl(reqUrl).forGet(res => {
                    if (key === 'detailData') {
                        for (let i of res['content']) {
                            let dataAry = ['planStart', 'planEnd', 'realStart', 'realEnd']
                            for (let j of dataAry) {
                                if (i[j]) {
                                    i[j] = this.format(i[j])
                                }
                            }
                        }
                        this.detailData = res['content']
                        this.dataCount = res['totalElements']
                    } else if (returnKey === '') {
                        this[key] = res
                    } else {
                        this[key] = res[returnKey]
                    }
                })
            }
        },
        mounted () {
            this.getRequest(this.urls.getDetailColumns, '', 'detailColumns', '')
            this.getDetailChild(this.$route.params.rowId, 0, this.pageSize, 'detailData')
        },
        watch: {
            '$route' () {
                this.getDetailChild(this.$route.params.rowId, 0, this.pageSize, 'detailData')
            }
        }
    }
</script>

<style scoped>
    /*外层*/
    .childWrap {
        position: absolute;
        width: 70%;
        top: 60px;
        right: 20px;
        z-index: 1000;
    }
    .cardBorder {
        border: 16px solid #eeeeee
    }
    .childCard {
        background: #F7F7F7;
    }
    .top_20 {
        margin-top: 20px
    }
    .toRight {
        margin-right: 20px;
    }
    .li-dashed {
        border-bottom: 1px dashed #dddddd; line-height: 28px
    }
    .page {
        float: right;
        margin-top: 10px
    }
</style>