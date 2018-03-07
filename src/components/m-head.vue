<template>
    <div class="s-nav">
        <div class="logo-container">
            <div class="posRea">
                <a @click="logout" ><img src="../assets/img/yushi-logo.png" alt=""></a>
                <!--<a href="http://www.sohu.com/" target="_blank" class="aMain">[ 主 页 ]</a>-->
                <!--<a href="/layoutContent/04/workbench" class="deskStyle">[ 桌 面 ]</a>-->
            </div>
            <div style="clear: both"></div>
        </div>
        <Menu active-name="" theme="light" class="themeLight" style="width:auto;">
            <div class="custom-menu">
                <Menu-item v-for="item in items" :name="item.code" class="customItem" :key="item.code" :id="item.code">
                    <router-link class="business-module" :to="'/layoutContent/' + item.code">
                        <Icon :type="item.icon" class="item-icon"></Icon>
                        <span class="func-title">{{item.title}}</span>
                    </router-link>
                </Menu-item>
            </div>
        </Menu>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                items: [],
                username: 'developer'
            }
        },
        mounted: function () {
            this.getLeftMenu()
        },
        methods: {
            logout(e) {
                e.preventDefault()
                this.setUrl('/api/logout').forPost(() => location.href = '/')
            },
            getLeftMenu () {
                let systemKey = localStorage.getItem('systemKey')
                let queries = {}
                if(systemKey !== '') {
                    queries = {
                        ...queries,
                        systemKey
                    }
                }
                this.setUrl('/api/module/topMenu')
                .setQuery(queries)
                .forGet(res => {
                    this.items = res
                })
            },
            chooseId () {
                document.getElementById(this.$router.currentRoute.params.id).click()
            }
        },
        watch: {
            '$route': function () {
                this.chooseId()
            }
        }
    }
</script>

<style scoped>


    /*背景： #595959*/

    .ivu-menu-vertical .ivu-menu-item:hover,
    .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: #364558 !important;
    }

    .business-module:hover {
        /*background: #dddddd;*/
    }

    .business-module:hover .func-title {
        /*color: #454c5b;*/
    }

    /*分割*/

    .ivu-menu-vertical.ivu-menu-light:after {
        background: white;
    }

    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        border-left: 6px solid #117aec;
        border-right: 0;
    }

    .ivu-menu-item:hover a span,
    .ivu-menu-item:hover a i {
        color: #fff;
    }

    .ivu-menu-item-selected {
        background: #364558;
        color: #fff !important;
    }

    .ivu-menu-item-selected i {
        color: #fff !important;
    }

    .ivu-menu-item-selected span {
        color: #fff !important;
        font-weight: bold;
    }

    .func-title {
        color: #fff;
        line-height: 26px;
    }

    .ivu-menu-item-selected .func-title,
    .ivu-menu-item-selected .item-icon {
        color: #ed3f14;
    }

    .layout-logo {
        border-bottom: 5px solid #e5e8f0;
    }

    .layout-logo img {
        position: relative;
        width: 100px;
        height: 70px;
        border-radius: 50%;
        float: left;
        margin: 0 69px 0 0;
        margin-left: 15px;
    }

    .layout-assistant {
        width: 300px;
        margin: 0 auto;
        height: inherit;
    }

    .layout-breadcrumb {
        padding: 10px 15px 0;
    }

    .layout-content {
        min-height: 850px;
        margin: 15px 0;
        overflow: hidden;
        background: #fff;
        border-radius: 5px;
    }

    .layout-content-main {
        padding: 10px;
    }

    .layout-copy {
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }

    .layout-ceiling-main {
        /*float: right;
            margin-right: 15px;*/
    }

    .custom-menu {
        border-top: 5px solid #e5e8f0;
        background: #3e4a58;
    }

    .customItem {
        height: 56px;
    }

    .custom-menu a {
        display: inline-block;
        line-height: 15px;
    }

    .custom-menu .ivu-menu-item {
        padding: 0;
    }

    .custom-menu .ivu-menu-item a {
        padding: 14px 24px;
    }

    .custom-menu a img {
        margin-top: 5px;
    }

    .ivu-menu-horizontal .ivu-menu-item {
        float: left;
        padding: 0 10px;
        position: relative;
        cursor: pointer;
        z-index: 3;
        transition: all .2s ease-in-out;
    }

    .s-nav {
        height: 100%;
        background: #3e4a58
    }

    .s-nav a {
        color: #999;
        display: block;
    }

    .s-nav .ivu-menu-item:hover a,
    .s-nav .ivu-menu-item.ivu-menu-item-active a {
        color: #117aec;
    }

    .item-icon {
        margin-top: 3px;
        font-size: 20px;
        width: 30px;
        color: #fff !important;
    }

    .func-title.dropdown {
        position: absolute;
        left: 21px;
        top: 16px;
    }

    .nav-dropdown .ivu-menu-submenu-title i {
        margin-right: -20px;
    }

    .ivu-menu-vertical.ivu-menu-light:after {
        width: 0;
    }

    .themeLight {
        width: 100%;
        background: white;
    }

    .posRea {
        position: relative;
    }

    .aMain {
        position: absolute;
        right: 20px;
        top: 13px;
        color: #333333;
    }

    .deskStyle {
        position: absolute;
        right: 20px;
        top: 38px;
        color: #333333;
    }

    .logo-container{
        background: #fff;
        position: fixed;
        z-index: 999;
        top: 0;
        width: 12.5%;
    }
    .posRea {
        height: 70px;
        /*text-align: center;*/
    }
    .posRea img{
        margin-left: 20px;
    }
    .s-nav{
        padding-top: 70px;
    }
</style>
