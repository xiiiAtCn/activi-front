<template lang="html">
    <div class="layout-content-main1">
        <Row style="margin: 20px 0">
            <Collapse v-model="collapseValue" accordion style="background: #fff5e6; border: 1px solid #ffebcc; font-size: 14px">
                <Panel name="1">
                    &nbsp;<span style="color: #333333">工作中心参数:</span>
                    <span style="float:right;margin-right:50px">更多...</span>
                    <p slot="content" class="con" style="border-bottom:1px dashed #ccc">
                        <span>工作中心数量：</span> <span style="padding:0 253px;">资源1使用参数：</span> <span>参数xxx</span>
                    </p>
                    <p slot="content" class="con" style="border-bottom:1px dashed #ccc">
                        <span>目前处理总任务数：</span><span style="padding:0 228px;">资源2使用参数：</span>
                    </p>
                    <p slot="content" class="con" style="border-bottom:1px dashed #ccc">
                        <span>总效率值：</span> <span style="padding:0 280px;">资源3使用参数：</span>
                    </p>
                    <p slot="content" class="con" style="border-bottom:1px dashed #ccc">
                        <span> 平均周效率值：</span> <span style="padding:0 252px;">资源4使用参数：</span>
                    </p>
                </Panel>
            </Collapse>
        </Row>
        <div class="mian_con">
            <Row class="tab_workCenter">
                <Table height="350" :data="tableData"  :columns="tableColumns"></Table>
                <Button type="info" @click="newBuild" style="margin-top:20px;">新建工作中心</Button>
            </Row>
            <Row class="show_workCenter">
                <h4 style="margin-bottom:10px;">名称：{{this.workCenterName}}</h4>
                <Card class="box">
                    <Row >
                        <p v-for="item in $store.state.workDeskHead" style="float:left;margin-top:10px"><span style="margin:0 10px;">{{item.title}}</span></p>
                        <Button type="info" @click="copyWorkDesk" style="float:right;margin-right:50px;">复制工作台</Button>
                    </Row>
                    <Row style="background:#fff5e6;margin-bottom:5px;margin-top:5px">
                        <span>JOB-META-1</span>
                        <span class="line" style="margin-left:650px;"> | </span>
                        <a href="javascript:;" @click="showSkill" class="opt">技能</a>
                        <span class="line"> | </span>
                        <a href="javascript:;" @click="checkPoint" class="opt">检查点</a>
                        <span class="line"> | </span>
                    </Row>
                    <transition name="fade">
                        <div style="margin:20px 0;" v-if="this.showSkillFlag">
                            <Card>
                                <p>1.爱岗敬业。爱岗敬业是会计职业道德的基础。</p>
                                <p>2.廉洁自律。廉洁自律是会计职业道德的前提。</p>
                                <p>3.客观公正。出纳员在工作过程中，必须遵守各种纪律、法规、准则和制度，依法办事。</p>
                            </Card>
                        </div>
                        <div style="margin:20px 0;" v-if="this.chackPointFlag">
                            <Card>
                                <p>1.清楚收入的来源和金额。</p>
                                <p>2.确定收款金额。如为现金收入，应考虑库存限额的要求及有关现金使用范围的规定。</p>
                                <p>3.明确付款人。</p>
                            </Card>
                        </div>
                    </transition>
                    <Row style="background:#fff5e6;margin-bottom:5px;">
                        <span>JOB-META-2</span>
                        <span class="line" style="margin-left:650px;"> | </span>
                        <a href="javascript:;" class="opt">技能</a>
                        <span class="line"> | </span>
                        <a href="javascript:;" class="opt">检查点</a>
                        <span class="line"> | </span>
                    </Row>
                </Card>

                <Card class="box">
                    <Row>
                        <p><span>工作中心资源配置信息</span></p>
                        <p><span>1.设备情况</span></p>
                        <p><span>2.人员情况</span></p>
                        <p><span>3.xxx情况</span></p>
                    </Row>
                </Card>
            </Row>
        </div>
        <div id="charts">
            <div id="main" :style="{width:'1550px',height:'400px'}"></div>
        </div>
         <Modal
            v-model="workCenterModal"
            title="工作中心新建"
            @on-ok="newWorkCenter('newCenterModalMsg')"
            @on-cancel="cancelWorkCenter('newCenterModalMsg')"
            width="900" style="margin-bottom:100px">
            <Card>
            <Form :model="newCenterModalMsg" ref="newCenterModalMsg"  :rules="ruleValidate" label-position="right" :label-width=200>
                <Row>
                    <Col span="20">
                        <Form-item label="工作中心名称" prop="col_14">
                            <Input v-model="newCenterModalMsg.col_14"></Input>
                        </Form-item>
                        <Form-item label="负责人" prop="col_29">
                            <Select v-model="newCenterModalMsg.col_29" placeholder="请选择">
                                <Option v-for="(item,index) in responsibleType" :key="index" :value="item.id">{{item.text}}</Option>
                            </Select>
                        </Form-item>
                    </Col>
                </Row>
            </Form>
            </Card>
        </Modal>

    </div>
</template>
<script>
/* eslint-disable */
import Vue from 'vue'
import echarts from 'echarts'
import { mapActions } from 'vuex'
export default {
    data: function() {
        return {
            workCenterName: '',
            collapseValue: '1',
            showSkillFlag: false,
            chackPointFlag: false,
            workCenterModal:false,
            tableData:[],
            tableColumns:[],
            dealWithData:[],
            //负责人获取数据
            responsibleType:[],
            newCenterModalMsg:{
               col_29:'',
               col_14:'',
            },
            ruleValidate:{
               col_14: [{ required: true, message: '用户中心名称不能为空', trigger: 'blur' }],
               col_29: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
            }
        }
    },
    computed:{

    },
    methods: {
        newBuild() {
            this.workCenterModal=true
            axios.get("/api/workCenter/createPrincipalBo")
               .then(data => {
                   this.responsibleType=data.data
                }, data => {
                  console.error('error');
                });
        },
        newWorkCenter(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                     this.obtainMsg()
                } else {
                    this.$Message.error('表单验证失败!');
                    this.cleanData(name)
                }
            })

        },
        obtainMsg(){
           axios.post("/api/workCenter/create",this.newCenterModalMsg)
              .then(res=> {
                 if(res.status===200){
                     this.$Message.info("操作成功");
                     this.requestData()
                     this.cleanData('newCenterModalMsg');
                 }else{
                     this.$Message.error("操作失败");
                 }
              }, data=>{
                   console.error('error');
              });
            this.workCenterModal=false;
          },
        cancelWorkCenter(name){
            this.cleanData(name)
        },
        cleanData (dataName) {
          for (let key in this[dataName]) {
              if (typeof this[dataName][key] === 'object') {
                  this.$set(this[dataName], key, []);
              } else {
                  this.$set(this[dataName], key, '');
              }
          }
          // 清除验证状态
          this.$refs[dataName].resetFields();
        },
        copyWorkDesk() {
        },

        showSkill() {
            this.showSkillFlag = !this.showSkillFlag
            if (this.showSkillFlag === true) {
                this.chackPointFlag = false
            }
        },
        checkPoint() {
            this.chackPointFlag = !this.chackPointFlag
            if (this.chackPointFlag === true) {
                this.showSkillFlag = false
            }
        },
        getMyChart(){
            let myChart = echarts.init(document.getElementById('main'));
              myChart.setOption({
                  title: {
                      text: '某某工作中心线图',
                      //subtext: '纯属虚构'
                  },
                  tooltip: {
                      trigger: 'axis'
                  },
                  grid: {
                      left: '2%',
                      right: '4%',
                      bottom: '20%',
                      top: '10%',
                      containLabel: true
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                  },
                  yAxis: {
                      type: 'value',
                      axisLabel: {
                          formatter: '{value}'
                      }
                  },
                  series: [{
                          name: '每日产出',
                          type: 'line',
                          data: [13, 11, 15, 13, 12, 13, 10],
                          markPoint: {
                              data: [
                                  { type: 'max', name: '最大值' },
                                  { type: 'min', name: '最小值' }
                              ]
                          },
                          markLine: {
                              data: [
                                  { type: 'average', name: '平均值' }
                              ]
                          }
                      },
                      {
                          name: '任务数',
                          type: 'line',
                          data: [12, 8, 2, 5, 6, 17, 12],
                          markPoint: {
                              data: [
                                  { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
                              ]
                          },
                          markLine: {
                              data: [
                                  { type: 'average', name: '平均值' },
                                  [{
                                      symbol: 'none',
                                      x: '90%',
                                      yAxis: 'max'
                                  }, {
                                      symbol: 'circle',
                                      label: {
                                          normal: {
                                              position: 'start',
                                              formatter: '最大值'
                                          }
                                      },
                                      type: 'max',
                                      name: '最高点'
                                  }]
                              ]
                          }
                      }
                  ]
            });
        },
        initData(){
          axios.get("/api/workCenter/listDefine/define")
               .then(data => {
                   let returnData = data.data
                   returnData.push({'render':this.renderOpt})
                   for(var i=0;i<returnData.length;i++){
                       this.$set(returnData[i], 'align','center')
                       console.log(returnData[i])
                       if(returnData[i].key ==='col_14'){
                         this.$set(returnData[i], 'render',this.renderWorkCenter)
                       }
                   }
                 this.tableColumns = returnData
                }, data => {
                  console.error('error');
                });
        },
        requestData(){
          axios.get("/api/workCenter/listData/data")
               .then(data => {
                   let returnMsg = data.data
                   this.tableData=returnMsg
                }, data => {
                  console.error('error');
                });
        },
        renderOpt(h, params){
          console.log(params.row)
          let cid = params.row.id
          let title =params.row.col_14
          return h('div', [
                h('Button', {
                    props: {
                        type: 'primary',
                        size: 'small'
                    },
                    style: {
                        marginRight: '5px'
                    },
                    on: {
                        click: () => {
                          this.$router.push({ path:'/layoutContent/'+this.$route.params.id+'/'+title+'/mWorkCenter/'+cid+'/workCenter'})
                        }
                    }
                }, '查看'),
          ]);
        },
        renderWorkCenter(h, params){
           return h('a',{
               on:{
                   click:()=>{
                       this.workCenterName=params.row.col_14
                   }
               }
           },params.row.col_14)
        },
    },
    mounted() {
      this.getMyChart()
      this.initData();
      this.requestData();
    }
}
</script>
<style scoped>
/*vue-transition*/
.slide-fade-enter-active {
    transform: translateY(-800px);
    transition: all .6s ease;
}

.slide-fade-leave-active {
    transition: all .6s ease;
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */
{
    transform: translateY(800px);
    opacity: 0;
}

.layout-content-main1 {
   margin-left:30px;
}

.con {
    margin-bottom: 7px;
}

.tab_workCenter {
    width: 30%;
    min-height: 200px;
    float: left;
}

.mian_con {
    min-height: 500px;
}

.show_workCenter {
    width: 65%;
    min-height: 500px;
    float: right;
}

.box {
    margin-bottom: 10px;
}

.shouDetail {
    margin: 10px 0;
}

a.opt {
    color: #495060
}

a.opt:hover {
    color: #2db7f5;
    cursor: pointer;
}

.line {
    margin: 20px;
}
#tableStyle{
  border:0;
}
canvas {}

#tableStyle .ivu-table::after{
  width:0 !important;
}



</style>
