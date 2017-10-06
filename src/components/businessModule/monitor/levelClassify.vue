<template>
  <div class="">
    <Row>
      <Col span="10">&nbsp;</Col>
      <Col span="14" class="level-tab-menu">
        <Menu mode="horizontal" theme="light" class="right-nav-bar" :active-name="activeName" style="line-height:30px;height:30px;">
          <Menu-item name="tabMapMonitor">
            <router-link to="/monitor/levelClassify/tabMapMonitor">
              <Icon type="map"></Icon>
              地图监控
            </router-link>
          </Menu-item>
          <Menu-item name="tabGridMonitor">
            <router-link to="/monitor/levelClassify/tabGridMonitor">
              <Icon type="grid"></Icon>
              列表监控
            </router-link>
          </Menu-item>
          <Menu-item name="tabFaultHistory">
            <router-link to="/monitor/levelClassify/tabFaultHistory">
              <Icon type="information"></Icon>
              历史故障
            </router-link>
          </Menu-item>
          <Menu-item name="tabFaultNow">
            <router-link to="/monitor/levelClassify/tabFaultNow">
              <Icon type="information-circled"></Icon>
              实时故障
            </router-link>
          </Menu-item>
        </Menu>
      </Col>
    </Row>
    <Row>
      <transition name="fade" mode="out-in">
      <router-view></router-view>
      </transition>
    </Row>
  </div>
</template>
<script>
  /* eslint-disable indent,key-spacing,comma-dangle,space-before-function-paren,space-before-blocks,no-useless-escape,space-infix-ops,semi */

  export default {
        data:function() {
            return {
              activeName:'tabMapMonitor',
              // routerId:this.$route.params.id
            }
        },
        mounted:function(){
          if (this.$route.path.split('\/').length > 3) {
              this.activeName=this.$route.path.split('\/')[3];
          }
        },
        // watch:{
        //   "$route":function(){
        //     console.log(val);
        //     console.log(oldVal);
        //   }
        // }
    }
</script>

<style lang="css">
.right-nav-bar.ivu-menu-horizontal.ivu-menu-light:after{
  background:none;
}
.level-tab-menu a{
  color:#495060;
  display: block;
}
</style>
