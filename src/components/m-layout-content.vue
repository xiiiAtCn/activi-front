<template>
  <div class="layout" v-if="leftMenu">
    <Row type="flex" span="24" class="breadMenu out-use-menu-horizontal">
      <i-col style="position:absolute;top:0;left:0">
        <Breadcrumb class="out-use-menu-horizontal" separator="<b class='demo-breadcrumb-separator' style='color: #2d8cf0; font-size: 15px; font-weight: normal'></b>">
          <BreadcrumbItem href="/layoutContent/00/allMenu" v-if="firstShow" class="title_main">
            <Icon type="cube"></Icon> <span>全部功能</span>
          </BreadcrumbItem>
          <BreadcrumbItem href="/layoutContent/04/workbench" class="title_main" v-if="deskShow">
            <Icon type="laptop"></Icon> <span>我的桌面</span>
          </BreadcrumbItem>
          <BreadcrumbItem :href="secondUrl" v-if="secondShow" class="title_main">
            <Icon :type="secondIcon"></Icon> <span>{{secondTitle}}</span>
          </BreadcrumbItem>
          <BreadcrumbItem v-if="thirdShow" class="title_main">
            <Icon :type="thirdIcon"></Icon> <span>{{thirdTitle}}</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </i-col>
      <div style="position:absolute;top:0;right:0">
        <img style="width: 60px; height: 60px; border-radius: 50%;margin-top:7px;float:left" src="../assets/img/head-portrait.jpg" />
        <div style="height:60px;float:right;margin:0 20px;margin-top:7px;">
          <div style="height:30px;line-height:30px">
            <span style="color: #888888;font-size: 14px;margin-left:2px">developer</span>
          </div>
          <div style="height:30px;line-height:30px;">
            <a href="javascript:;" class="exit">退出</a>
            <a href="javascript:;" class="designStyle" style="color:#2db7f5" @click="showDesign" v-if="designFlag">
              <Icon type="navicon-round"></Icon>
            </a>
            <a href="javascript:;" class="designStyle" style="color:#888888" @click="showDesign" v-if="!designFlag">
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
</template>
<script>
  export default {
    data() {
      return {
        leftMenu: true,
        secondTitle: '',
        secondIcon: '',
        secondUrl: '',
        firstShow: true,
        secondShow: true,
        deskShow: true,
        thirdShow: false,
        thirdTitle: '',
        thirdIcon: '',
        designFlag: false,
        firstMenuFlag:false,
        secondMenuFlag:false,
        signRecordMsg: []
      }
    },
    methods: {
      getLeftMenu() {
        let currentId = this.$route.params.id;
        this.secondUrl = `/layoutContent/${currentId}`
        if (currentId === '04') {
          this.firstShow = true;
          this.secondShow = false;
          this.thirdShow = false
        } else if (currentId === '00') {
          this.firstShow = true;
          this.deskShow = false;
          this.secondShow = false;
          this.thirdShow = false
        } else {
          this.firstShow = true;
          this.secondShow = true;
          this.deskShow = false;
          this.setUrl('/api/module/topMenu').forGet(res => {
            for (let i of res) {
              if (i.code === currentId) {
                this.secondTitle = i.title;
                this.secondIcon = i.icon
              }
            }
          })
        }
      },
//      getTopBread() {
//        let chooseUrl = this.$route.query.url;
//        let path = this.$route.path;
//        if (chooseUrl) {
//            第三个不显示
//          Vue.http.get("/api/module/leftMenu", {
//            'params': { id: this.$route.params.id }
//          }).then(data => {
//            let topMenuAry = data.body;
//            for (let i of topMenuAry) {
//              if (i.url === chooseUrl) {
//                this.thirdTitle = i.title;
//                this.thirdIcon = i.icon
//              }
//            }
//            this.thirdShow = true;
//          }, data => {
//            console.error('error');
//          });
//        } else if (path === '/layoutContent/01') {
//          this.thirdShow = false;
//        } else if (path === '/layoutContent/05') {
//          this.thirdShow = false;
//        } else if (path === '/layoutContent/21') {
//          this.thirdShow = false;
//        } else if (path === '/layoutContent/03') {
//          this.thirdShow = false;
//        } else if (path === '/layoutContent/02') {
//          this.thirdShow = false;
//        } else if (path === '/layoutContent/06') {
//          this.thirdShow = false;
//        } else if (path === '/layoutContent/07') {
//          this.thirdShow = false;
//        } else if (path === '/layoutContent/09') {
//          this.thirdShow = false;
//        } else if (path === '/layoutContent/10') {
//          this.thirdShow = false;
//        } else {}
//      },
      dispatchAction(url) {
        dispatch(url);
      },
      showDesign() {
        this.designFlag = !this.designFlag
      },
      firstMenu(){
        this.firstMenuFlag=!this.firstMenuFlag
      },
      secondMenu(){
        this.secondMenuFlag=!this.secondMenuFlag
      }

    },
    mounted: function() {
      this.getLeftMenu();
      let signRecord = [
        // {
        //     icon: 'cube',
        //     text: '工作中心',
        //     url:'/layoutContent/01/mWorkCenter',
        // },
        {
          icon: 'social-instagram',
          text: '我的视图',
          url:'/layoutContent/01',
        },
        {
          icon: 'email-unread',
          text: '我的邮件',
          url:'/email',
        },
        {
          icon: 'ios-clock',
          text: '浏览记录',
          url:'',
        },
        {
          icon: 'ios-help',
          text: '帮助中心',
          url:'',
        },
        {
          icon: 'ios-bell',
          text: '最新通知',
          url:'',
        },
        {
          icon: 'android-settings',
          text: '我的设置',
          url:'',
        },
        {
          icon: 'power',
          text: '退出',
          url:'',
        },
      ]
      this.signRecordMsg = signRecord;
    },
    watch: {
      '$route' () {
        this.getLeftMenu();
//        this.getTopBread();
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
  }
  .layout-container{
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

  .tools_title:hover a,
  .tools_title:hover i {
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

</style>
