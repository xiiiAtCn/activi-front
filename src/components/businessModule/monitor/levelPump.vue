<template lang="html">
  <div class="">
    <Row>
      <Col span="8">&nbsp;</Col>
      <Col span="16" class="level-tab-menu">
        <Menu mode="horizontal" theme="light" class="right-nav-bar" :active-name="activeName" style="line-height:30px;height:30px;">
          <Submenu name="monitorNow">
            <template slot="title">
              <Icon type="monitor"></Icon>
              实时监控
            </template>
            <Menu-item name="produceMonitor">
              <router-link :to="'/monitor/levelPump/tabProduceMonitor/'+$route.params.pumpGroupId">生产监控</router-link>
            </Menu-item>
            <Menu-group title="图表">
              <Menu-item name="curveNow">
                <router-link :to="'/monitor/levelPump/tabCurveNow/'+$route.params.pumpGroupId">实时曲线</router-link>
              </Menu-item>
            </Menu-group>
          </Submenu>
          <Menu-item name="safeManage">
            <router-link :to="'/monitor/levelPump/tabFaultHistory/'+$route.params.pumpGroupId">
              <Icon type="medkit"></Icon>
              安全管理
            </router-link>
          </Menu-item>
          <Submenu name="analysis">
            <template slot="title">
              <Icon type="stats-bars"></Icon>
              统计分析
            </template>
            <Menu-item name="tabStartStopAnls">
              <router-link :to="'/monitor/levelPump/tabStartStopAnls/'+$route.params.pumpGroupId">启停分析</router-link>
            </Menu-item>
          </Submenu>
          <Submenu name="safeMonitor">
            <template slot="title">
              <Icon type="pinpoint"></Icon>
              安防监控
            </template>
            <Menu-item name="video">视频监控</Menu-item>
            <Menu-item name="door">门禁监控</Menu-item>
          </Submenu>
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
/* eslint-disable */
export default {
    data: function() {
        return {
            activeName: '',

        }
    },
    mounted: function() {

        if (this.$route.path.split('\/').length > 3) {
            if (this.$route.path.split('\/')[3] === "tabFaultHistory") {
                this.activeName = "safeManage";
            } else {
                this.activeName = this.$route.path.split('\/')[3];
            }
        }
    }
}
</script>

<style lang="css">
.ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item-selected a, .ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item-selected:hover a{
    color: #fff;
}
</style>
