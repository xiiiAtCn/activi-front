<template>
  <div class="layout" v-if="leftMenu">
    <Row type="flex">
      <i-col span="24">
        <Breadcrumb class="breadMenu out-use-menu-horizontal" separator="<b class='demo-breadcrumb-separator' style='color: #2d8cf0; font-size: 15px; font-weight: normal'>/</b>">
          <BreadcrumbItem href="/layoutContent/04/workbench" style="font-size: 15px; font-weight: normal;">
            <Icon type="laptop"></Icon>
            我的桌面 xxx
          </BreadcrumbItem>
          <BreadcrumbItem href="/layoutContent/00/allMenu" v-if="firstShow" style="font-size: 15px; font-weight: normal">
            <Icon type="cube"></Icon>
            全部功能 dk
          </BreadcrumbItem>
          <BreadcrumbItem :href="secondUrl" v-if="secondShow" style="font-size: 15px; font-weight: normal">
            <Icon :type="secondIcon"></Icon>
            {{secondTitle}}
          </BreadcrumbItem>
          <BreadcrumbItem v-if="thirdShow" style="font-size: 15px; font-weight: normal">
            <Icon :type="thirdIcon"></Icon>
            {{thirdTitle}}
          </BreadcrumbItem>
        </Breadcrumb>
      </i-col>
    </Row>
    <Row>
      <div class="layout-content">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </Row>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  //  import VueResource from 'vue-resource'
  import { dispatch } from '../utils/skipUtils'
  import axios from 'axios'

  //  Vue.use(VueResource)

  export default {
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
        thirdIcon: ''
//                firstUrl: ''
      }
    },
    methods: {
      getLeftMenu: function () {
        let currentId = this.$route.params.id
//                this.firstUrl = '/layoutContent/' + currentId + '/allMenu';
        this.secondUrl = '/layoutContent/' + currentId
        if (currentId === '04') {
          this.firstShow = false
          this.secondShow = false
          this.thirdShow = false
        } else if (currentId === '00') {
          this.firstShow = true
          this.secondShow = false
          this.thirdShow = false
        } else {
          this.firstShow = true
          this.secondShow = true
          axios.get('/api/module/topMenu').then(
            response => {
//              let leftMenuAry = data.body
              let leftMenuAry = response.data
              for (let i of leftMenuAry) {
                if (i.code === currentId) {
                  this.secondTitle = i.title
                  this.secondIcon = i.icon
                }
              }
            }).catch(error => console.log(error))
        }
      },
      getTopBread: function () {
        let chooseUrl = this.$route.query.url
        let path = this.$route.path
        if (chooseUrl) {
          axios.get('/api/module/leftMenu', {
            'params': {id: this.$route.params.id}
          }).then(response => {
            let topMenuAry = response.data
            for (let i of topMenuAry) {
              if (i.url === chooseUrl) {
                this.thirdTitle = i.title
                this.thirdIcon = i.icon
              }
            }
            this.thirdShow = true
          }).catch(error => console.log(error))
        } else if (path === '/layoutContent/01') {
          this.thirdShow = false
        } else if (path === '/layoutContent/05') {
          this.thirdShow = false
        } else if (path === '/layoutContent/21') {
          this.thirdShow = false
        } else if (path === '/layoutContent/03') {
          this.thirdShow = false
        } else if (path === '/layoutContent/02') {
          this.thirdShow = false
        } else if (path === '/layoutContent/06') {
          this.thirdShow = false
        } else if (path === '/layoutContent/07') {
          this.thirdShow = false
        } else if (path === '/layoutContent/09') {
          this.thirdShow = false
        } else if (path === '/layoutContent/10') {
          this.thirdShow = false
        } else {}
      },
      dispatchAction: function (url) {
        dispatch(url)
      }
    },
    mounted: function () {
      this.getLeftMenu()
    },
    watch: {
      '$route': function () {
        this.getLeftMenu()
        this.getTopBread()
      }
    }
  }
</script>

<!--新导航-->
<style scoped>

  .ivu-breadcrumb-item-separator {
    color: #2d8cf0;
  }

  .breadMenu {
    border-bottom: 1px solid #2d8cf0;
    line-height: 30px;
    padding-top: 12px;
  }

  .demo-breadcrumb-separator {
    color: #333333;
    padding: 0 5px;
  }


</style>

<!--旧版导航-->
<style scoped>

  /*a {*/
  /*display: block;*/
  /*color: #bbbbbb;*/
  /*}*/
  /*.ivu-menu-item-selected a {*/
  /*color: #2d8cf0;*/
  /*}*/
  /*.ivu-menu-light .ivu-menu-item:hover {*/
  /*border-bottom: 2px solid #aaaaaa;*/
  /*}*/
  /*.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active {*/
  /*border-bottom: 2px solid #2d8cf0;*/
  /*}*/
  /*.h-sec-menu.ivu-menu-horizontal {*/
  /*height: 60px;*/
  /*line-height: 60px;*/
  /*}*/
  /*.ivu-menu-horizontal .ivu-menu-submenu .ivu-menu-item.c-left-menu {*/
  /*padding-left: 0;*/
  /*}*/

  /*.ivu-menu-horizontal .ivu-menu-submenu .ivu-menu-item.c-left-menu a {*/
  /*padding-left: 43px;*/
  /*}*/

  /*.ivu-menu-horizontal .ivu-menu-item.c-left-menu {*/
  /*height: 60px;*/
  /*padding: 0;*/
  /*}*/

  /*.ivu-menu-horizontal .ivu-menu-item.c-left-menu a {*/
  /*padding: 0 20px;*/
  /*}*/

</style>
