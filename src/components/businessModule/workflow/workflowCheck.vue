<template>
    <div class="CheckWrap">
        <Row>
            <Col span="23">
                <h2 class="marBot" style="float: left">{{flowName}}</h2>
                <Button @click="goBack" style="float: right">返回</Button>
            </Col>
        </Row>
        <Row>
            <Col span="9">
                <Table :columns="checkColumns" :data="checkData" :border="tableBorder"></Table>
            </Col>
            <Col span="13" push="1">
            <Row>
                <Button type="info" @click=" showFrame = false">文字信息</Button>
                <Button type="success" @click="showFrame = true">图形信息</Button>
            </Row>
            <div class="detailsBox top_16">
                <div v-if="!showFrame">
                    <Row>
                        <ButtonGroup>
                            <Button>检查项</Button>
                            <Button>CHECK-LIST</Button>
                            <Button>输入单据</Button>
                            <Button>输出单据</Button>
                            <Button>状态转换</Button>
                            <Button>单据转换规则</Button>
                        </ButtonGroup>
                    </Row>
                    <Row class="top_16">
                        <h3 class="lh_24">{{ flowName }} --> 负责人：{{ leaderName }}</h3>
                        <h3 class="lh_24">目标：</h3>
                    </Row>
                    <Row class="top_16">
                        <h3 class="lh_24">CHECK-LIST一览：</h3>
                        <Table :columns="columns" :data="data_1" :border="tableBorder"></Table>
                    </Row>
                    <Row class="top_16">
                        <h3 class="lh_24">关联实体：</h3>
                        <Table :columns="columns" :data="data_1" :border="tableBorder"></Table>
                    </Row>
                    <Row class="top_16">
                        <h3 class="lh_24">输入单据：</h3>
                        <Table :columns="columns" :data="inputObjList" :border="tableBorder"></Table>
                    </Row>
                    <Row class="top_16">
                        <h3 class="lh_24">输出单据：</h3>
                        <Table :columns="columns" :data="outputObjList" :border="tableBorder"></Table>
                    </Row>
                </div>
                <div v-else>
                    <iframe id="is-iframe" :src="iframeUrl" frameborder="0" scrolling="no"></iframe>
                </div>
            </div>
            </Col>
        </Row>
    </div>

</template>


<script>
    export default{
        data(){
            return {
                urls: {
                    // 获取 checkData
                    getCheckData: '/prowf/prowf/repo/findJobMeta4Dis/'
                },
                // 默认不显示纵向边框
                tableBorder: false,
                // 负责人名字
                leaderName: '',
                checkColumns: [
                    {
                        "type":"index",
                        "width":60,
                        "align":"center"
                    },
                    {
                        "title":"名称",
                        "key":"name",
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    on: {
                                        click: () => {
                                            this.showDetails(params.row)
                                        }
                                    }
                                }, params.row.name)
                            ])
                        }
                    },
                    {
                        "title":"负责人",
                        "key":"dutyName"
                    },
                    {
                        "title":"任务类型",
                        "key":"jobNodeType"
                    }
                ],
                checkData: [],
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    }
                ],
                data_1: [],
                // 输入单据
                inputObjList: [],
                // 输出单据
                outputObjList: [],
                //切换信息
                showFrame:false,
                iframeUrl:""
            }
        },
        computed: {
            flowName() {
                return this.$route.params.rowName
            }
        },
        methods: {
            goBack () {
                this.$router.back(-1)
            },
            showDetails(row) {
                this.leaderName = row['dutyName']
                let dataAry = ['data_1', 'inputObjList', 'outputObjList']
                for (let i of dataAry){
                    row[i] ? this[i] = row[i] : this[i] = []
                }
            },
            getRequest (url, argument, key, returnKey) {
                let reqUrl = `${url}${argument}`
                this.setUrl(reqUrl).forGet(res => {
                    returnKey === '' ? this[key] = res : this[key] = res[returnKey]
                })
            }
        },
        mounted(){
            this.getRequest(this.urls.getCheckData, this.$route.params.rowId, 'checkData', '')
            //在画图需要的id
            this.iframeUrl=`/static/drawFormStatusChart.html?wfMetaId=${this.$route.params.rowId}`
        }
    }
</script>

<style scoped>
    /*外层*/
    .CheckWrap {
        padding: 20px;
    }
    .detailsBox {
        padding: 20px;
        background: #FCFCFC;
        border: 1px solid #dddddd;
    }
    .top_16 {
        margin-top: 16px;
    }
    .lh_24 {
        line-height: 24px;
    }
    /*iframe 配置*/
    .detailsBox{
        position: relative;
    }
    #is-iframe{
        /*border: 1px solid #000 ;*/
        width:100%;
        min-height:600px;
    }
    .marBot {
        margin-bottom: 14px;
    }
</style>
