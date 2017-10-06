<template>
  <div class="s-nav" style="height: 100%; background: #595959">
    <Menu active-name="" theme="light" style="width: 200px; background: white;">
      <li class="layout-logo">
        <div style="width: 48px; height: 48px; float: left; margin: 20px 0 0 22px">
          <img style="width: 100%; height: 100%; border-radius: 50%" src="../assets/img/head-portrait.jpg"/>
        </div>
        <div>
          <!--<img src="../assets/img/yushi-logo.png" alt="" style="width: 100px; height: 70px; border-radius: 50%; float: right; margin: 14px 20px 0 0">-->
        </div>
        <div style="clear: both"></div>
      </li>
      <li>
        <div style="margin: 16px 0 16px 23px; ">
          <Icon type="person"></Icon>
          <span style="font-weight: bold; color: #888888">{{username}}</span>
          <span style="font-size: 60%; font-weight: bold; color: #2db7f5; cursor: pointer">&nbsp;&nbsp;&nbsp;&nbsp;退出</span>
        </div>
      </li>
      <div class="custom-menu" style="background: #595959">
        <Menu-item name="allMenu" style="height:60px;" id="00">
          <router-link class="business-module" to="/layoutContent/00/allMenu" style="height: 100%">
            <Icon type="cube" class="item-icon"></Icon>
            <span class="func-title">全部功能</span>
          </router-link>
        </Menu-item>
        <!--<Menu-item name="workbench" style="height:60px;" id="0">-->
        <!--<router-link class="business-module" to="/layoutContent/0/workbench" style="height: 100%">-->
        <!--<Icon type="laptop" class="item-icon"></Icon>-->
        <!--<span class="func-title">我的桌面</span>-->
        <!--</router-link>-->
        <!--</Menu-item>-->
        <Menu-item v-for="item in items" :name="item.code" style="height:56px;" :key="item.code" :id="item.code">
          <router-link class="business-module" :to="'/layoutContent/' + item.code">
            <Icon :type="item.icon" class="item-icon"></Icon>
            <span class="func-title">{{item.title}}</span>
          </router-link>
        </Menu-item>
        <!--我的桌面隐藏,再改动就把它删掉了-->
        <Menu-item name="04" style="height:5px; width: 1%; background: rgb(89,89,89); border-left: 1px solid rgb(89,89,89)" key="04" id="04">
          <router-link class="business-module" to=""></router-link>
        </Menu-item>
      </div>
    </Menu>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  //  import VueResource from 'vue-resource'
  import axios from 'axios'

  //  Vue.use(VueResource)
  export default {
    data: function () {
      return {
        items: [],
        username: 'developer'
      }
    },
    mounted: function () {
//      axios.get('/api/module/topMenu', {}).then(data => { this.items = data.body }, data => { console.log('error') })
      axios.get('/api/module/topMenu', {})
        .then(response => {
          this.items = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    methods: {
      chooseId: function () {
        let chooseId = this.$router.currentRoute.params.id
        document.getElementById(chooseId).click()
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
    /*border-left: 6px solid #2d8cf0;*/
    border-left: 6px solid #ed3f14;
    border-right: 0;
  }

  .ivu-menu-item:hover a span, .ivu-menu-item:hover a i {
    color: #595959;
  }

  .ivu-menu-item-selected {
    background: white;
    color: #2d8cf0;
  }

  .ivu-menu-item-selected i {
    color: #2d8cf0;
  }

  .ivu-menu-item-selected span {
    color: #2d8cf0;
    font-weight: bold;
  }

  .func-title {
    color: #d9d9d9;
    line-height: 26px;
  }

  .ivu-menu-item-selected .func-title, .ivu-menu-item-selected .item-icon {
    color: #ed3f14;
  }

  .layout-logo img {
    height: 60px;
    position: relative;
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
    border-top: 1px solid #ddd;
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
    /*position: fixed;
    left:0;*/
  }

  .s-nav a {
    color: #999;
    display: block;
  }

  .s-nav .ivu-menu-item:hover a, .s-nav .ivu-menu-item.ivu-menu-item-active a {
    color: #333;
  }

  .item-icon {
    margin-top: 3px;
    font-size: 20px;
    width: 30px;
  }

  .func-title.dropdown {
    position: absolute;
    left: 21px;
    top: 16px;
  }

  .nav-dropdown .ivu-menu-submenu-title i {
    margin-right: -20px;
  }

</style>
