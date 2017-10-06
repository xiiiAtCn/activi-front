<template lang="html">
  <div style="padding:20px;">
    <div class="" style="width:921px;float:left;margin-right:20px;">
      <div style="position: relative;margin-bottom: 20px;">
        <img src="../../../assets/img/pump-house.png" style="width:921px;border:1px solid #ddd;">
        <img src="../../../assets/img/pump.png" style="position: absolute;left:300px;top: 268px;width: 228px;" v-if="pumpGroupData.pcount>=2">
        <img src="../../../assets/img/pump.png" style="position: absolute;left:360px;top: 268px;width: 228px;" v-if="pumpGroupData.pcount>=3">
        <img src="../../../assets/img/pump.png" style="position: absolute;left:420px;top: 268px;width: 228px;" v-if="pumpGroupData.pcount>=4">
        <img src="../../../assets/img/pump.png" style="position: absolute;left:480px;top: 268px;width: 228px;" v-if="pumpGroupData.pcount>=5">
        <img src="../../../assets/img/pump.png" style="position: absolute;left:540px;top: 268px;width: 228px;" v-if="pumpGroupData.pcount>=6">
      </div>
      <div class="list" style="width: 100%;border-radius:5px;">
         <h4 class="list-title">泵信息</h4>
         <table cellspacing="0" cellpadding="0" width="100%">
             <tr>
               <td width="10%"></td>
               <td >1#泵</td>
               <td >2#泵</td>
               <td >3#泵</td>
               <td >4#泵</td>
               <td >5#泵</td>
               <td >6#泵</td>
             </tr>
             <tr>
               <td>运行时长(H)</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].runtime">{{pumpGroupData.pumps[0].runtime}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].runtime">{{pumpGroupData.pumps[1].runtime}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].runtime">{{pumpGroupData.pumps[2].runtime}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].runtime">{{pumpGroupData.pumps[3].runtime}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].runtime">{{pumpGroupData.pumps[4].runtime}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].runtime">{{pumpGroupData.pumps[5].runtime}}</span></td>
             </tr>
             <tr>
               <td>启动次数</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].start_times">{{pumpGroupData.pumps[0].start_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].start_times">{{pumpGroupData.pumps[1].start_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].start_times">{{pumpGroupData.pumps[2].start_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].start_times">{{pumpGroupData.pumps[3].start_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].start_times">{{pumpGroupData.pumps[4].start_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].start_times">{{pumpGroupData.pumps[5].start_times}}</span></td>
             </tr>
             <tr>
               <td>故障次数</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].failure_times">{{pumpGroupData.pumps[0].failure_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].failure_times">{{pumpGroupData.pumps[1].failure_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].failure_times">{{pumpGroupData.pumps[2].failure_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].failure_times">{{pumpGroupData.pumps[3].failure_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].failure_times">{{pumpGroupData.pumps[4].failure_times}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].failure_times">{{pumpGroupData.pumps[5].failure_times}}</span></td>
             </tr>
             <!--
             <tr>
               <td>电压(V)</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].voltage">{{pumpGroupData.pumps[0].voltage}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].voltage">{{pumpGroupData.pumps[1].voltage}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].voltage">{{pumpGroupData.pumps[2].voltage}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].voltage">{{pumpGroupData.pumps[3].voltage}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].voltage">{{pumpGroupData.pumps[4].voltage}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].voltage">{{pumpGroupData.pumps[5].voltage}}</span></td>
             </tr>
             <tr>
               <td>电流(A)</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].current">{{pumpGroupData.pumps[0].current}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].current">{{pumpGroupData.pumps[1].current}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].current">{{pumpGroupData.pumps[2].current}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].current">{{pumpGroupData.pumps[3].current}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].current">{{pumpGroupData.pumps[4].current}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].current">{{pumpGroupData.pumps[5].current}}</span></td>
             </tr>
           -->
             <tr>
               <td>变频电压(V)</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].vfv">{{pumpGroupData.pumps[0].vfv}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].vfv">{{pumpGroupData.pumps[1].vfv}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].vfv">{{pumpGroupData.pumps[2].vfv}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].vfv">{{pumpGroupData.pumps[3].vfv}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].vfv">{{pumpGroupData.pumps[4].vfvvfv}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].vfv">{{pumpGroupData.pumps[5].vfv}}</span></td>
             </tr>
             <tr>
               <td>变频电流(A)</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].vfc">{{pumpGroupData.pumps[0].vfc}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].vfc">{{pumpGroupData.pumps[1].vfc}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].vfc">{{pumpGroupData.pumps[2].vfc}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].vfc">{{pumpGroupData.pumps[3].vfc}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].vfc">{{pumpGroupData.pumps[4].vfc}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].vfc">{{pumpGroupData.pumps[5].vfc}}</span></td>
             </tr>
             <tr>
               <td>转速</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].variable_speed">{{pumpGroupData.pumps[0].variable_speed}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].variable_speed">{{pumpGroupData.pumps[1].variable_speed}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].variable_speed">{{pumpGroupData.pumps[2].variable_speed}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].variable_speed">{{pumpGroupData.pumps[3].variable_speedvariable_speed}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].variable_speed">{{pumpGroupData.pumps[4].variable_speed}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].variable_speed">{{pumpGroupData.pumps[5].variable_speed}}</span></td>
             </tr>
             <tr>
               <td>频率</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].frequency_conversion">{{pumpGroupData.pumps[0].frequency_conversion}}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].frequency_conversion">{{pumpGroupData.pumps[1].frequency_conversion}}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].frequency_conversion">{{pumpGroupData.pumps[2].frequency_conversion}}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].frequency_conversion">{{pumpGroupData.pumps[3].frequency_conversion}}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].frequency_conversion">{{pumpGroupData.pumps[4].frequency_conversion}}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].frequency_conversion">{{pumpGroupData.pumps[5].frequency_conversion}}</span></td>
             </tr>
             <tr>
               <td>运行状态</td>
               <td><span v-if="pumpGroupData.pumps[0]&&pumpGroupData.pumps[0].pumps_status">{{
                 pumpGroupData.pumps[0].pumps_status==1
                 ?'待机':pumpGroupData.pumps[0].pumps_status==2
                 ?'工频':pumpGroupData.pumps[0].pumps_status==3
                 ?'变频':pumpGroupData.pumps[0].pumps_status==4
                 ?'故障':pumpGroupData.pumps[0].pumps_status==5
                 ?'远停':''
               }}</span></td>
               <td><span v-if="pumpGroupData.pumps[1]&&pumpGroupData.pumps[1].pumps_status">{{
                 pumpGroupData.pumps[1].pumps_status==1
                 ?'待机':pumpGroupData.pumps[1].pumps_status==2
                 ?'工频':pumpGroupData.pumps[1].pumps_status==3
                 ?'变频':pumpGroupData.pumps[1].pumps_status==4
                 ?'故障':pumpGroupData.pumps[1].pumps_status==5
                 ?'远停':''
               }}</span></td>
               <td><span v-if="pumpGroupData.pumps[2]&&pumpGroupData.pumps[2].pumps_status">{{
                 pumpGroupData.pumps[2].pumps_status==1
                 ?'待机':pumpGroupData.pumps[2].pumps_status==2
                 ?'工频':pumpGroupData.pumps[2].pumps_status==3
                 ?'变频':pumpGroupData.pumps[2].pumps_status==4
                 ?'故障':pumpGroupData.pumps[2].pumps_status==5
                 ?'远停':''
               }}</span></td>
               <td><span v-if="pumpGroupData.pumps[3]&&pumpGroupData.pumps[3].pumps_status">{{
                 pumpGroupData.pumps[3].pumps_status==1
                 ?'待机':pumpGroupData.pumps[3].pumps_status==2
                 ?'工频':pumpGroupData.pumps[3].pumps_status==3
                 ?'变频':pumpGroupData.pumps[3].pumps_status==4
                 ?'故障':pumpGroupData.pumps[3].pumps_status==5
                 ?'远停':''
               }}</span></td>
               <td><span v-if="pumpGroupData.pumps[4]&&pumpGroupData.pumps[4].pumps_status">{{
                 pumpGroupData.pumps[4].pumps_status==1
                 ?'待机':pumpGroupData.pumps[4].pumps_status==2
                 ?'工频':pumpGroupData.pumps[4].pumps_status==3
                 ?'变频':pumpGroupData.pumps[4].pumps_status==4
                 ?'故障':pumpGroupData.pumps[4].pumps_status==5
                 ?'远停':''
               }}</span></td>
               <td><span v-if="pumpGroupData.pumps[5]&&pumpGroupData.pumps[5].pumps_status">{{
                 pumpGroupData.pumps[5].pumps_status==1
                 ?'待机':pumpGroupData.pumps[5].pumps_status==2
                 ?'工频':pumpGroupData.pumps[5].pumps_status==3
                 ?'变频':pumpGroupData.pumps[5].pumps_status==4
                 ?'故障':pumpGroupData.pumps[5].pumps_status==5
                 ?'远停':''
               }}</span></td>
             </tr>
         </table>
      </div>
    </div>
    <div style="float:left;line-height:28px;margin-bottom: 20px;">
      <div class="min-layout" style="border: 1px solid #ddd;border-radius:5px;padding:0px 20px;margin-right:20px;margin-bottom:20px;background:#f5f5f5;">
          <h5>供水信息</h5>
          <p>出水压力：<span>####</span>MPa</p>
          <p>常规压力：<span>{{pumpGroupData.pressure}}</span>MPa</p>
          <p>进水压力：<span>####</span>MPa</p>
          <p>负压设定：<span>{{pumpGroupData.setting}}</span>MPa</p>
      </div>
      <div class="min-layout" style="border: 1px solid #ddd;border-radius:5px;padding:0px 20px;margin-right:20px;margin-bottom:20px;background:#f5f5f5;">
          <h5>变频状态</h5>
          <p>变频频率：<span>####</span>Hz</p>
          <p>变频电压：<span>####</span>V</p>
          <p>变频电流：<span>####</span>A</p>
          <p>变频转速：<span>####</span>r/m</p>
      </div>
      <div class="min-layout" style="border: 1px solid #ddd;border-radius:5px;padding:0px 20px;margin-right:20px;background:#f5f5f5;">
          <h5>电源进线</h5>
          <p>电压：<span>####</span>V</p>
          <p>电流：<span>####</span>A</p>
          <p>耗电量：<span>####</span></p>
      </div>
    </div>
    <div class="" style="float:left;line-height:28px;margin-left: 20px;">
      <h5><Icon type="wrench" style="margin-right:5px;"></Icon>安全信息:</h5>
      <p><Icon type="record" style="color:#ed3f14;"></Icon>【故障信息】某泵水压过高，发生故障，停止运行</p>
      <p><Icon type="record" style="color:#ff9900;"></Icon>【报警信息】水压水压水压水压水压</p>
      <p><Icon type="record" style="color:#ff9900;"></Icon>【报警信息】水压水压</p>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
//import Vue from 'vue';
//import VueResource from 'vue-resource'
//Vue.use(VueResource);
export default {
    data: function() {
        return {
            model1: 1,
            testData: 0,
            pumpGroupData: {
                pumpNum: 0, //泵数量
                //出水压力
                pressure: 0, //常规压力
                //进水压力
                setting: 0, //进水负压设定
                pumps: [],
            }
        }
    },
    methods: {
        getData: function() {
            var params = {
                'id': this.$route.params.pumpGroupId
            };
            axios.get("/api/monitor/pumpGroupOne", {
                'params': params
            }).then(data => {
                // this.tableData1 = data.body.content;
                // this.totalNum = data.body.total;
                console.log(data.body);
                this.pumpGroupData = data.body;
                this.testData = data.body.id;
            }, data => {
                console.log('error');
            });
        }
    },
    mounted: function() {
        this.getData();
    },
    watch: {
        "$route": function() {
            this.getData();
        }
    }
}
</script>

<style lang="css">
    .list-title{
        width: 100%;
    }
    .list table{
        font-size: 12px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-collapse:collapse;border-spacing:0;
    }
    .list table td{
      border: 1px solid #ddd;
    }

    .list table td:nth-child(even) {
        line-height: 30px;
    }

    .list tr {
        text-align: center;
        height: 32px;
    }
    @media (max-width: 1400px) {
      .min-layout{
        float:left;
      }
    }
</style>
