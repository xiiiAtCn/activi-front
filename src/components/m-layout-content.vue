<template>
    <div class="full-height">
        <Row class="full-height">
            <Col span="3" class="full-height out-use-menu-vertical">
            <m-head></m-head>
            </Col>
            <Col span="21">
            <div class="layout" v-if="leftMenu">
                <Row type="flex" class="breadMenu out-use-menu-horizontal">
                    <i-col class="iCol">
                        <Breadcrumb class="out-use-menu-horizontal" separator="<b class='demo-breadcrumb-separator'></b>">
                            <BreadcrumbItem href="/layoutContent/00/allMenu" v-if="firstShow" class="title_main">
                                <Icon type="cube"></Icon>
                                <span>全部功能</span>
                            </BreadcrumbItem>
                            <!--<BreadcrumbItem href="/layoutContent/04/workbench" class="title_main" v-if="deskShow">-->
                                <!--<Icon type="laptop"></Icon>-->
                                <!--<span>我的桌面</span>-->
                            <!--</BreadcrumbItem>-->
                            <BreadcrumbItem :href="secondUrl" v-if="secondShow" class="title_main">
                                <Icon :type="secondIcon"></Icon>
                                <span>{{secondTitle}}</span>
                            </BreadcrumbItem>
                            <BreadcrumbItem v-if="thirdShow" class="title_main">
                                <Icon :type="thirdIcon"></Icon>
                                <span>{{thirdTitle}}</span>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </i-col>
                    <div class="daJieStyle1">
                        <img class="daJieStyle2" src="../assets/img/head-portrait.jpg"/>
                        <div class="daJieStyle3" style="">
                            <div class="daJieStyle4">
                                <span class="daJieStyle5">developer</span>
                            </div>
                            <div class="daJieStyle6">
                                <a @click="myDesk" class="exit">桌面</a>
                                <a href="javascript:;" class="exit">退出</a>

                                <a href="javascript:;" class="designStyle daJieStyle7" @click="showDesign"
                                   v-if="designFlag">
                                    <Icon type="navicon-round"></Icon>
                                </a>
                                <a href="javascript:;" class="designStyle daJieStyle8" @click="showDesign"
                                   v-if="!designFlag">
                                    <Icon type="navicon-round"></Icon>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-if="designFlag" class="tools">
                        <div class="tools_title" v-for="item in signRecordMsg">
                            <Icon :type="item.icon"></Icon>
                            <a :href="item.url" target="_blank">{{item.text}}</a>
                        </div>
                    </div>
                </Row>
                <Row class="layout-container">
                    <div class="layout-content">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </div>
                </Row>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import mHead from './m-head.vue'
    export default {
        components: {mHead},
        data () {
            return {
                leftMenu: true,
                secondTitle: '',
                secondIcon: '',
                secondUrl: '',
                firstShow: true,
                secondShow: true,
                thirdShow: false,
                thirdTitle: '',
                thirdIcon: '',
                designFlag: false,
                firstMenuFlag: false,
                secondMenuFlag: false,
                signRecordMsg: [
                    {
                        icon: 'social-instagram',
                        text: '我的视图',
                        url: '/layoutContent/01'
                    },
                    {
                        icon: 'email-unread',
                        text: '我的邮件',
                        url: '/email'
                    },
                    {
                        icon: 'ios-clock',
                        text: '浏览记录',
                        url: '/layoutContent/01/workBench'
                    },
                    {
                        icon: 'ios-help',
                        text: '帮助中心',
                        url: ''
                    },
                    {
                        icon: 'ios-bell',
                        text: '最新通知',
                        url: ''
                    },
                    {
                        icon: 'android-settings',
                        text: '我的设置',
                        url: ''
                    },
                    {
                        icon: 'power',
                        text: '退出',
                        url: ''
                    }
                ],
                ids: []
            }
        },
        methods: {
            myDesk () {
                this.$router.push({
                    path: '/layoutContent/04/workbench'
                });
            },
            getLeftMenu () {
                let currentId = this.$route.params.id
                this.secondUrl = `/layoutContent/${currentId}`
                if (currentId === '04' || currentId === '00') {
                    this.firstShow = true
                    this.secondShow = false
                    this.thirdShow = false
                } else {
                    this.firstShow = true
                    this.secondShow = true
                    this.setUrl('/api/module/topMenu').forGet(res => {
                        this.ids = []
                        for (let i of res) {
                            this.ids.push(i.code)
                            if (i.code === currentId) {
                                this.secondTitle = i.title
                                this.secondIcon = i.icon
                            }
                        }
                    })
                }
            },
            getTopBread () {
                let chooseUrl = this.$route.query.url
                let path = this.$route.path
                if (chooseUrl) {
                    this.setUrl('/api/module/leftMenu?id={id}').setPathVariables({
                        id: this.$route.params.id
                    }).forGet(res => {
                        for (let i of res) {
                            if (i.url === chooseUrl) {
                                this.thirdTitle = i.title
                                this.thirdIcon = i.icon
                            }
                        }
                        this.thirdShow = true
                    })
                } else {
                    for (let i of this.ids) {
                        let currentPath = `/layoutContent/${i}`
                        if (currentPath === path) {
                            this.thirdShow = false
                        }
                    }
                }
            },
            showDesign () {
                this.designFlag = !this.designFlag
            },
            firstMenu () {
                this.firstMenuFlag = !this.firstMenuFlag
            },
            secondMenu () {
                this.secondMenuFlag = !this.secondMenuFlag
            }

        },
        mounted: function () {
            this.getLeftMenu()
        },
        watch: {
            '$route' () {
                this.getLeftMenu()
                this.getTopBread()
            }
        }
    }
</script>

<!--新导航-->
<style scoped>
    .title_main {
        display: inline-block;
        width: 130px;
        height: 30px;
        line-height: 30px;
        background: #0f7cee;
        border-radius: 3px;
        text-align: center;
    }

    .title_main i,
    .title_main span {
        color: #fff;
    }

    .breadMenu {
        height: 75px;
        width: 100%;
        line-height: 75px;
        border-bottom: 5px solid #e5e8f0;
        position: relative
    }

    .ivu-breadcrumb-item-separator {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .demo-breadcrumb-separator {
        color: #333333;
        padding: 0 5px;
        color: #2d8cf0;
        font-size: 15px;
        font-weight: normal
    }

    .layout-container {
        width: 100%;
        overflow-y: auto;
        height: calc(100vh - 75px);
    }

    .layout-content {
        width: 100%;
        background: #fff;
        border-left: 5px solid #e5e8f0;
    }

    .tools {
        width: 300px;
        height: 350px;
        position: absolute;
        right: 0;
        top: 70px;
        border-radius: 5px;
        background: #fff;
        z-index: 999;
        box-shadow: 0px 0px 15px 5px #ccc;
        padding: 0 20px;
    }

    .tools_title {
        width: 75px;
        height: 75px;
        float: left;
        text-align: center;
        margin: 5px 5px;
        cursor: pointer;
    }

    .tools_title i {
        font-size: 40px;
        color: #c1c1c1;
    }

    .tools_title a {
        color: #c1c1c1;
        display: block;
        line-height: 0;
        margin-top: -12px;
        font-size: 14px;
    }

    .tools_title:hover a, .tools_title:hover i {
        color: #2db7f5;
    }

    .designStyle {
        font-size: 16px;
        cursor: pointer;
        position: relative;
        top: 2px;
    }

    .designStyle:hover {
        color: #2db7f5 !important
    }

    .deskStyle {
        font-size: 60%;
        font-weight: bold;
        cursor: pointer;
        text-decoration: underline
    }

    a.deskStyle:hover {
        color: #2db7f5 !important
    }

    .iCol {
        position:absolute;
        top:0;
        left:0
    }

    .exit {
        font-size: 60%;
        font-weight: bold;
        color: #888888;
        cursor: pointer;
        text-decoration: underline;
        margin: 0 5px;
    }

    .exit:hover {
        color: #2db7f5
    }

    .daJieStyle1 {
        position: absolute;
        top: 0;
        right: 0
    }

    .daJieStyle2 {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-top: 7px;
        float: left
    }

    .daJieStyle3 {
        height: 60px;
        float: right;
        margin: 0 20px;
        margin-top: 7px
    }

    .daJieStyle4 {
        height: 30px;
        line-height: 30px
    }

    .daJieStyle5 {
        color: #888888;
        font-size: 14px;
        margin-left: 2px
    }

    .daJieStyle6 {
        height: 30px;
        line-height: 30px;
    }

    .daJieStyle7 {
        color: #2db7f5
    }

    .daJieStyle8 {
        color: #888888
    }

</style>
