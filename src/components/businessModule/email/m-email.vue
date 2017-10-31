<template>
    <div class="layout">
        <Menu mode="horizontal" active-name="1">
            <div class="layout-assistant">
                 <div style="height:60px;float:left">
                      <img src="../../../assets/img/yushi-logo.png" style="width:100px;height:60px;margin-left:50px;float:left"/>
                      <div style="float:left;height:60px;">
                        <p style="height:30px;line-height: 30px;"><span>宇宙无敌美少女</span><span> <1506461525@qq.com></span></p>
                        <p style="height:30px;line-height: 30px;font-size:12px;"><a href="/email/home">邮箱首页</a>  <span style="margin:0 8px">|</span>  <a>设置</a></p>
                      </div>
                 </div>
                 <div style="height:60px;float:right">
                     <p style="font-size: 12px;"><a href="">帮助中心</a><span style="margin:0 8px">|</span><a style="margin-right:10px;margin-top:-5px;" @click="goback">退出</a> </p>
                 </div>
            </div>
        </Menu>
        <div class="layout-content">
            <Row>
                <Col span="3">
                    <Menu active-name="0" style="width: 83%;height:95%">
                        <MenuGroup>
                            <MenuItem :name="index" v-for="(item,index) in routers" :key="item.code" style="height:62px;line-height: 62px;text-align:center">
                                <router-link :to="item.url" style="padding:0">
                                    {{item.text}}
                                </router-link>
                            </MenuItem>
                        </MenuGroup>
                    </Menu>
                </Col>
                <Col span="20">
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
  /* eslint-disable */
    import {dispatch} from  '../../../utils/skipUtils'
    export default {
        data () {
            return {
                routers: [],
            }
        },
        methods: {
            changetitle() {
                document.title = this.$route.params.title
            },
            goback(){
                this.$router.push({
                    path:'/workbench'
                });
            }
        },
        mounted () {
            this.changetitle();
            this.$router.push({
                path:'/email/home'
            });
            let urls = [
                {
                    text: '写信',
                    url: '/email/writeEmail',
                    code: '101'
                },
                {
                    text: '收信',
                    url: '/email/checkEmail',
                    code: '102'
                },
                {
                    text: '通讯录',
                    url: '',
                    code: '103'
                },
                {
                    text: '收件箱',
                    url: '',
                    code: '104'
                },
                {
                    text: '星标邮件',
                    url: '',
                    code: '105'
                },
                {
                    text: '群邮件',
                    url: '',
                    code: '106'
                },
                {
                    text: '草稿箱 ',
                    url: '',
                    code: '107'
                },
                {
                    text: '已发送',
                    url: '',
                    code: '108'
                },
                {
                    text: '已删除',
                    url: '',
                    code: '109'
                },
                {
                    text: '垃圾箱',
                    url: '',
                    code: '110'
                },
            ];
            this.routers = urls;
        }
    }
</script>

<style scoped>
    /*路由*/
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 0
    }
    .ivu-menu-item a {
        display: block;
        padding: 14px 24px;
        color: #aaa;
    }
    .ivu-menu-item-selected a {
        color: #2d8cf0;
    }
    .layout{
        background: #89b5e9;
        width: 120%;
        height:100%;
    }
    .layout-assistant{
       height:60px;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        margin: 15px;
        background: #fff;
        border-radius: 4px;
        height:785px;
    }
    .layout-content-main{
        padding: 10px;
        margin-left:20px;
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
</style>
