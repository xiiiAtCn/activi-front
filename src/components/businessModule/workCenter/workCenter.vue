<template lang="html">
    <div class="main">
        <Row style="margin:10px; 0">
             <h2 style="float:left;margin-right:50px;">{{this.$route.params.title}}</h2>
             <Button  type="info" @click="reback" style="float:right;margin-right:50px;">返回</Button>
        </Row>
        <Row style="margin-bottom: 20px">
            <Collapse v-model="value" style="background: #fff5e6; border: 1px solid #ffebcc; font-size: 14px">
                <Panel name="1">
                    待办任务列表:
                    <p slot="content"><Table :data="tableData" :columns="tableColumns"></Table></p>
                </Panel>
                <Panel name="2">
                    计划列表：
                    <p slot="content"><Table :data="tableData1" :columns="tableColumns1"></Table></p>
                </Panel>
                <Panel name="3">
                    问题列表：
                    <p slot="content"><Table :data="tableData2" :columns="tableColumns2"></Table></p>
                </Panel>
            </Collapse>
             <Button type="info" @click="newWorkTask" style="margin-top:10px;float:right">新建工作台</Button>
             <Table :data="workDeskData" :columns="columeData" style="margin:50px 0;" ></Table>
        </Row>

        <Row style="margin-top: 50px;min-height:500px;">
            <h4>统计图表</h4>
            <div id="charts">
                <div id="chart_one"  :style="{width:'500px',height:'400px',float:'left'}"></div>
                <div id="chart_two"  :style="{width:'500px',height:'400px',float:'left'}"></div>
                <div id="chart_three" :style="{width:'500px',height:'400px',float:'left'}"></div>
            </div>
        </Row>

        <Row>
            <h4>工作日历-排班</h4>
            <Col :span="CalendarLength">
                <FullCalendar :events="fcEvents" lang="zh" style="padding: 20px 0 20px 0" @dayClick="dayClick" @eventClick="evert"></FullCalendar>
            </Col>
        </Row>

        <Modal
            v-model="workDeskModal"
            title="工作台新建"
            @on-ok="newDeskCenter('newDeskModalMsg')"
            @on-cancel="cancelDeskCenter('newDeskModalMsg')"
            width="900" style="margin-bottom:100px">
            <Card>
            <Form :model="newDeskModalMsg" ref="newDeskModalMsg"  :rules="ruleValidate" label-position="right" :label-width=200>
                <Row>
                    <Col span="20">
                        <Form-item label="工作台名称" prop="col_15">
                            <Input v-model="newDeskModalMsg.col_15"></Input>
                        </Form-item>
                        <Form-item label="负责人" prop="col_29">
                            <Select v-model="newDeskModalMsg.col_29" placeholder="请选择">
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
import FullCalendar from 'vue-fullcalendar'
Vue.use(FullCalendar)
export default {
    data: function() {
        return {
            workDeskModal:false,
            value:'1',
            collapseValue: '1',
            collapseValue1: '1',
            collapseValue2: '1',
            workDeskData:[],
            responsibleType:[],
            columeData:[],
            tableData:[
               {
                 'index':'1',
                 'task':'装货',
                 'man':'张大山',
                 'status':'激活',
                 'pros':'进行',
                 'planBegin':'星期一',
                 'planEnd':'星期日',
                 'preBegin':'星期二',
                 'preEnd':'星期日',
               },
            ],
            tableData1:[
               {
                'index':'1',
                'name':'收货单据',
                'person':'刘能',
                'time':'2017/09/05'
               }
            ],
            tableData2:[
               {
                'index':'1',
                'name':'数量缺少',
                'person':'刘能',
                'time':'2017/09/05'
               }
            ],
            tableColumns:
            [
                {
                  title: '#',
                  value: 'index',
                  align:'center',
                },
                {
                  title: '任务名称',
                  key: 'task',
                  align:'center',
                },
                {
                  title: '负责人',
                  key: 'man',
                  align:'center',
                },
                {
                  title: '状态',
                  key: 'status',
                  align:'center',
                },
                {
                  title: '进度',
                  key: 'pros',
                  align:'center',
                },
                {
                  title: '计划开始',
                  key: 'planBegin',
                  align:'center',
                },
                {
                  title: '计划结束',
                  key: 'planEnd',
                  align:'center',
                },
                {
                  title: '实际开始',
                  key: 'preBegin',
                  align:'center',
                },
                {
                  title: '实际结束',
                  key: 'preEnd',
                  align:'center',
                },
            ],
            tableColumns1:[
                {
                  title: '#',
                  key: 'index',
                  align:'center',
                  width:200,
                },
                {
                  title: '单据名称',
                  key: 'name',
                  align:'center',
                  width:440,
                },
                 {
                  title: '更新者',
                  key: 'person',
                  align:'center',
                  width:440,
                },
                 {
                  title: '更新时间',
                  key: 'time',
                  align:'center',
                  width:440,
                },
            ],
            tableColumns2:[
                {
                  title: '#',
                  key: 'index',
                  align:'center',
                  width:200,
                },
                {
                  title: '单据名称',
                  key: 'name',
                  align:'center',
                  width:440,
                },
                 {
                  title: '更新者',
                  key: 'person',
                  align:'center',
                  width:440,
                },
                 {
                  title: '更新时间',
                  key: 'time',
                  align:'center',
                  width:440,
                },
            ],
            TableLength: '11',
            dataCalendar: [],
            CalendarLength: '13',
            workcenterid:'',
            newDeskModalMsg:{
              col_15:'',
              col_29:'',
            },
            ruleValidate:{
               col_15: [{ required: true, message: '用户中心名称不能为空', trigger: 'blur' }],
               col_29: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
            }
        }
    },
    methods:{
        initData(){
          axios.get('/api/workCenter/workDeskCheck/listDefineCheck/'+this.$route.params.cid)
               .then(data => {
                    if(data.data.hasChildNodes===true){
                       this.obtainData()
                    }
                }, data => {
                  console.error('error')
                })

        },
        obtainData(){
            axios.get('/api/workCenter/workDesk/listDefine/'+this.$route.params.cid)
             .then(response => {
                 console.log(response)
                  let returnData = response.data
                   for(var i=0;i<returnData.length;i++){
                       this.$set(returnData[i], 'align','center')
                       console.log(returnData[i])
                       if(returnData[i].key ==='col_15'){
                         this.$set(returnData[i], 'render',this.renderDeskCenter)
                       }
                   }
                 this.columeData=returnData
              }, err => {
                console.error('error')
              })
            axios.get('/api/workCenter/workDesk/listData/'+this.$route.params.cid)
               .then(response => {
                   console.log(response)
                   this.workDeskData=response.data
                }, err => {
                  console.error('error')
                })
        },
        change(val){
            console.log(val)
        },
        dayClick(date, allDay, jsEvent, view){
            console.log('null')
        },
        evert(event, jsEvent, pos){
            this.dataCalendar.push(event)
        },
        newWorkTask(){
            this.workDeskModal=true
             axios.get('/api/workCenter/createPrincipalBo')
               .then(data => {
                   this.responsibleType=data.data
                }, data => {
                  console.error('error')
                })
        },

        newDeskCenter(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                     this.obtainMsg()
                } else {
                    this.$Message.error('表单验证失败!')
                    this.cleanData(name)
                }
            })
        },
        obtainMsg(){
             axios.post('/api/workCenter/workDesk/create/'+this.$route.params.cid,this.newDeskModalMsg)
              .then(res=> {
                 if(res.status===200){
                     this.$Message.info('操作成功')
                     this.obtainData()
                      this.cleanData('newDeskModalMsg')
                 }else{
                     this.$Message.error('操作失败')
                 }
              }, data=>{
                   console.error('error')
              })
            this.workDeskModal=false
        },
        cancelDeskCenter(name){
            this.cleanData(name)
        },

        cleanData (dataName) {
          for (let key in this[dataName]) {
              if (typeof this[dataName][key] === 'object') {
                  this.$set(this[dataName], key, [])
              } else {
                  this.$set(this[dataName], key, '')
              }
          }
          // 清除验证状态
          this.$refs[dataName].resetFields()
        },
        reback(){
           window.history.go(-1)
        },
        renderDeskCenter(h,params){
          let sid=params.row.id
          let stitle =params.row.col_15
             return h('a',{
               on:{
                   click:()=>{
                      this.$router.push({ path:'/layoutContent/'+this.$route.params.id+'/'+this.$route.params.title+'/mWorkCenter/'+sid+'/'+stitle+'/workDesk' })
                   }
               }
           },params.row.col_15)
        },
        myChartOne(){
            let myChart = echarts.init(document.getElementById('chart_one'))
            myChart.setOption({
                title : {
                    text: '某站点用户访问来源',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['货物验收','货物采集','货物整理','货物入库','货物出库']
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'货物验收'},
                            {value:310, name:'货物采集'},
                            {value:234, name:'货物整理'},
                            {value:135, name:'货物入库'},
                            {value:1548, name:'货物出库'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        },
        myChartTwo(){
            let myChartTwo = echarts.init(document.getElementById('chart_two'))
            myChartTwo.setOption({
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
                        barWidth: '60%',
                        data:[10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            })
        },
        myChartThree(){
              let myChartThree = echarts.init(document.getElementById('chart_three'))
              myChartThree.setOption({
                  title: {
                      text: '动态数据',

                  },
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'cross',
                          label: {
                              backgroundColor: '#283b56'
                          }
                      }
                  },
                  legend: {
                      data:['任务量', '工时']
                  },

                  dataZoom: {
                      show: false,
                      start: 0,
                      end: 100
                  },
                  xAxis: [
                      {
                          type: 'category',
                          boundaryGap: true,
                          data: (function (){
                              var now = new Date()
                              var res = []
                              var len = 10
                              while (len--) {
                                  res.unshift(now.toLocaleTimeString().replace(/^\D*/,''))
                                  now = new Date(now - 2000)
                              }
                              return res
                          })()
                      },
                      {
                          type: 'category',
                          boundaryGap: true,
                          data: (function (){
                              var res = []
                              var len = 10
                              while (len--) {
                                  res.push(len + 1)
                              }
                              return res
                          })()
                      }
                  ],
                  yAxis: [
                      {
                          type: 'value',
                          scale: true,
                          name: '工时',
                          max: 30,
                          min: 0,
                          boundaryGap: [0.2, 0.2]
                      },
                      {
                          type: 'value',
                          scale: true,
                          name: '任务量',
                          max: 1200,
                          min: 0,
                          boundaryGap: [0.2, 0.2]
                      }
                  ],
                  series: [
                      {
                          name:'工时',
                          type:'bar',
                          xAxisIndex: 1,
                          yAxisIndex: 1,
                          data:(function (){
                              var res = []
                              var len = 10
                              while (len--) {
                                  res.push(Math.round(Math.random() * 1000))
                              }
                              return res
                          })()
                      },
                      {
                          name:'任务量',
                          type:'line',
                          data:(function (){
                              var res = []
                              var len = 0
                              while (len < 10) {
                                  res.push((Math.random()*10 + 5).toFixed(1) - 0)
                                  len++
                              }
                              return res
                          })()
                      }
                  ]
              })
        },
       fcEvents(){

       }
    },
    mounted(){
         this.initData()
         this.myChartOne()
         this.myChartTwo()
         this.myChartThree()

         console.log(this.$route.params.id)
         console.log(this.$route.params.cid)
         console.log(this.$route)
    },
    components: {
        FullCalendar
    }
}

</script>

<style scoped>
.main{
    margin-left:30px;
}
.main .ivu-table:after{
    width:0 !important;
 }
</style>
