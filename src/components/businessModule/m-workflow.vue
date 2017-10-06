<template lang="html">
    <div class="workflow-content">
         <Row class="tab_workflow">
              <Table :data="tableData" :columns="tableColumns"></Table>
         </Row>
         <transition name="slide-fade">
             <Row class="show_workflow" v-if="showFlag">
                  <span @click="closeModal" style="cursor:pointer;font-size:18px;position:absolute;right:10px">X</span>
                  <h4 style="margin:10px 0;text-align:center;">{{this.name}} --> {{this.person}}</h4>
                  <Card class="box">
                      <Row>
                          <p style="">应用模块:</p>
                      </Row>
                      <Row>
                          <p style="">1.xxx</p>
                          <p style="">2.yyy</p>
                          <p style="">3.zzz</p>
                      </Row>
                  </Card>

                  <Card class="box">
                      <Row style="float:left;width:40%">
                          <p style="">关联实体:</p>
                          <p>1.BO-META1</p>
                          <p>2.BO-META2</p>
                          <p>3.BO-META3</p>
                      </Row>
                      <Row style="float:right;width:60%">
                          <p style="">关联单据:</p>
                          <p>1.BO-META1</p>
                          <p>2.BO-META2</p>
                          <p>3.BO-META3</p>
                      </Row>
                  </Card>
                  <p style="margin:5px 0">运行实例一览:</p>
                  <Table :data="tableData1" :columns="tableColumns1"></Table>
             </Row>
        </transition>
    </div>
</template>
<script>
//import Vue from 'vue'
//import echarts from 'echarts'
import bus from '../../router/bus.js'
export default {
    data: function() {
        return {
          showFlag:false,
          name:'',
          person:'',
          tableData:[
              {
                'index':'1',
                'name':'工单&报价确认流程',
                'mainPerson':'张三',
                'runCount':20,
                'normalCount':17,
                'problemCount':3,
                'avgTime':5,
                'avgData':7,
                'avgCost':3,
                'time':2
              },
              {
                'index':'2',
                'name':'工单处理-流程',
                'mainPerson':'李四',
                'runCount':20,
                'normalCount':17,
                'problemCount':3,
                'avgTime':5,
                'avgData':7,
                'avgCost':3,
                'time':2
              },
               {
                'index':'3',
                'name':'应急采购-流程',
                'mainPerson':'溜溜',
                'runCount':20,
                'normalCount':17,
                'problemCount':3,
                'avgTime':5,
                'avgData':7,
                'avgCost':3,
                'time':2
              },
               {
                'index':'4',
                'name':'计划采购申请流程',
                'mainPerson':'妞妞',
                'runCount':20,
                'normalCount':17,
                'problemCount':3,
                'avgTime':5,
                'avgData':7,
                'avgCost':3,
                'time':2
              },
               {
                'index':'5',
                'name':'工程收款处理流程',
                'mainPerson':'果果',
                'runCount':20,
                'normalCount':17,
                'problemCount':3,
                'avgTime':5,
                'avgData':7,
                'avgCost':3,
                'time':2
              },
          ],
          tableColumns:[
                {
                    title: '#',
                    key: 'index',
                    align:'center'
                },
                {
                    title: '操作',
                    key: 'index',
                    align:'center',
                    render: (h, params) => {
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
                                        this.$router.push({ path:'/workflowDetail'})
                                    }
                                }
                            }, '查看')
                        ])
                    }
                },
                {
                    title: '工作流名称',
                    align:'left',
                    render: (h, params) => {
                        return h('a',{
                           on:{
                               click:()=>{
                                  this.showFlag=true
                                  this.name=params.row.name
                                  this.person=params.row.mainPerson
                               }
                           }
                       },params.row.name)
                    }
                },
                {
                    title: '负责人',
                    key: 'mainPerson',
                    align:'center'
                },
                 {
                    title: '运行数目',
                    key: 'runCount',
                    align:'center'
                },
                 {
                    title: '正常数目',
                    key: 'normalCount',
                    align:'center'
                },
                {
                    title: '有问题数目',
                    key: 'problemCount',
                    align:'center'
                },
                {
                    title: '平均工时',
                    key: 'avgTime',
                    align:'center'
                },
                {
                    title: '平均工期',
                    key: 'avgData',
                    align:'center'
                },
                {
                    title: '平均成本',
                    key: 'avgCost',
                    align:'center'
                },
                {
                    title: '改版次数',
                    key: 'time',
                    align:'center'
                },
          ],
          tableColumns1:[
              {
                  title: '实例名称',
                  key: 'name',
                  align:'center'
              },
              {
                  title: '负责人',
                  key: 'person',
                  align:'center'
              },
              {
                  title: '工期',
                  key: 'proect',
                  align:'center'
              },
              {
                  title: '工时',
                  key: 'time',
                  align:'center'
              },
              {
                  title: '计划开始',
                  key: 'planBegin',
                  align:'center'
              },
              {
                  title: '计划结束',
                  key: 'planEnd',
                  align:'center'
              },
              {
                  title: '实际开始',
                  key: 'praBegin',
                  align:'center'
              },
              {
                  title: '实际结束',
                  key: 'praEnd',
                  align:'center'
              },
          ],
          tableData1:[
            {
              'name':'1.work-flow-ins1',
              'person':'张杰',
              'proect':'3个月',
              'time':'2',
              'planBegin':'2017/06/09',
              'planEnd':'2017/09/06',
              'praBegin':'2017/07/09',
              'praEnd':'2017/10/06'
            },
            {
              'name':'2.work-flow-ins2',
              'person':'哈哈',
              'proect':'2个月',
              'time':'3',
              'planBegin':'2017/06/09',
              'planEnd':'2017/09/06',
              'praBegin':'2017/07/09',
              'praEnd':'2017/10/06'
            }
          ]
        }
    },
    computed:{

    },
    methods: {
       closeModal(){
          this.showFlag=false
       }
    },
    mounted() {

    }
}
</script>
<style scoped>
  .slide-fade-enter-active {
        transition: all .6s ease;
  }
  .slide-fade-leave-active {
      transition: all .6s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
 {
      transform: translateX(800px);
      opacity: 0;
  }
/*vue-transition*/
.workflow-content{
  padding-left: 0 !important;
  margin: 20px 0;
}
.tab_workflow{
  margin-left:30px;
}
.show_workflow{
    width: 63%;
    position:absolute;
    min-height: 500px;
    float: right;
    background: #ccc;
    top:21px;
    right:0px;
}
.box{
  margin:10px 0;
  height:120px;
}
</style>
