<template>
    <div class="layout">
        <Menu mode="horizontal" active-name="1">
            <div class="layout-assistant">
                <div style="height:60px;float:left">
                    <img src="../../../assets/img/yushi-logo.png" style="width:100px;height:60px;margin-left:50px;float:left"/>
                    <div style="float:left;height:60px;">
                        <p style="height:60px;line-height: 60px;font-size:12px;margin-left:60px;">
                            <a href="/email/home">邮箱首页</a>
                            <span style="margin:0 8px">|</span>
                            <a>设置</a>
                        </p>
                    </div>
                </div>
                <div style="height:60px;float:right;">
                    <img src="../../../assets/img/mail/user-guojiajia.png">
                    <div style="float:right;height:60px;">
                        <p style="height:60px;line-height:60px;font-size:12px;">
                            <span style="margin-right:100px;">朱珊珊</span>
                            <a href="">帮助中心</a>
                            <span style="margin:0 8px">|</span>
                            <a href="javascript:window.close()" style="margin-right:10px;">退出</a>
                        </p>
                    </div>
                </div>
            </div>
        </Menu>
        <div class="layout-content">
            <Row>
                <Col span="3" class="layout_title">
                <Menu active-name="0" style="width: 100%;height:95%">
                    <MenuGroup>
                        <MenuItem :name="index" v-for="(item,index) in routers" :key="item.code" style="height:62px;line-height: 62px;text-align:center;padding-top:10px">
                            <router-link :to="item.url" style="padding:0">
                                <Icon :type="item.icon" style="font-size:20px;margin-right:10px;text-align:right;"></Icon>
                                <span>{{item.text}}</span>
                            </router-link>
                        </MenuItem>
                    </MenuGroup>
                </Menu>
                </Col>
                <Col span="21">
                <div class="layout-content-main">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
                </Col>
            </Row>
        </div>
        <div class="layout-copy">
            2011-2020 &copy; Y
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {dispatch} from '../../../utils/actionUtils'
    import VueQuillEditor from 'vue-quill-editor'
    Vue.use(VueQuillEditor)
    export default {
        data () {
            return {
                routers: []
            }
        },
        methods: {
            changetitle () {
                document.title = '邮件'
            }
        },
        mounted () {
            this.changetitle()
            this.$router.push({
                path: '/email/home'
            })
            let urls = [
                {
                    icon: 'android-create',
                    text: '写 信',
                    url: '/email/writeEmail',
                    code: '101'
                },
                {
                    icon: 'email-unread',
                    text: '收 信',
                    url: '/email/checkEmail',
                    code: '102'
                },
                {
                    icon: 'person-stalker',
                    text: '通讯录',
                    url: '/email/emailDirectory',
                    code: '103'
                },
                {
                    icon: 'android-archive',
                    text: '收件箱',
                    url: '',
                    code: '104'
                },
                {
                    icon: 'pricetags',
                    text: '标签组',
                    url: '',
                    code: '105'
                },
                {
                    icon: 'chatboxes',
                    text: '群邮件',
                    url: '',
                    code: '106'
                },
                {
                    icon: 'filing',
                    text: '草稿箱 ',
                    url: '',
                    code: '107'
                },
                {
                    icon: 'ios-upload',
                    text: '已发送',
                    url: '',
                    code: '108'
                },
                {
                    icon: 'trash-a',
                    text: '已删除',
                    url: '',
                    code: '109'
                },
                {
                    icon: 'trash-b',
                    text: '垃圾箱',
                    url: '',
                    code: '110'
                }
            ]
            this.routers = urls
    }
    }
</script>

<style scoped>
    /*路由*/
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        border-right:1px solid #e0e3e6;
    }

    .router-link-active{
        width:70%;
        height:40px;
        line-height: 40px;
        border-radius: 20px;
        background:#65bef2;
        margin:0 auto;
        color:#fff !important;
    }
    .router-link-active a{
        color:#fff !important;
    }
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 0
    }
    .ivu-menu-item a {
        display: block;
        padding: 14px 24px;
        color: #aaa;
    }
    .layout{
        background: #d9dfe8;
        width: 100%;
        height:100%;
    }
    .layout-assistant{
        height:60px;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        margin: 5px;
        background: #fff;
        border-radius: 4px;
        height:785px;
    }
    .layout-content-main{
        /*  padding: 10px;
          margin-left:20px;*/
    }
    .layout-copy{
        height:65px;
        line-height: 65px;
        text-align: center;
        margin-top:50px;
        background:#fff;
        position:fixed;
        width:100%;
        bottom:0;
        left:0;
    }
    .layout-content ul{
        background:#fff;
    }

    .layout-content ul li a:hover{
        background:#fff
    }
    .layout-content ul li a:hover span{
        color:#65bef2;
    }
    .layout-content ul li a:hover i{
        color:#65bef2;
    }


</style>
