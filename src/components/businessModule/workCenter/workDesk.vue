<template lang="html">
    <div class="mian_con">
         <Row style="margin:10px; 0">
             <h2 style="float:left;margin-right:50px;">{{this.$route.params.title}} ---> {{this.$route.params.stitle}}</h2>
             <Button  type="info" @click="reback" style="float:right;margin-right:50px;">返回</Button>
        </Row>
        <Row style="margin-bottom: 20px">
            <Collapse v-model="value" style="background: #fff5e6; border: 1px solid #ffebcc; font-size: 14px">
                <Panel name="1">
                    工作台主体信息:
                    <p slot="content">
                        <i class="ivu-icon ivu-icon-android-laptop" style="font-size:40px;margin-left:150px"></i><span>主设备信息：</span><span style="margin-right:300px">计算机</span>
                        <i class="ivu-icon ivu-icon-ios-people" style="font-size:40px"></i><span>人员信息：</span><span style="margin-right:300px">出货管理员</span>
                        <a class="show" @click="shouSkill">技能要求</a>
                    </p>
                </Panel>
                <Panel name="2">
                    待办任务列表：
                    <Button  type="info" style="float:right;margin-right:50px;margin-top:3px;" @click="newBuild">新建</Button>
                    <p slot="content"><Table :data="tableData" :columns="tableColumns" style="border:0"></Table></p>
                </Panel>
                <Panel name="3">
                    待办单据：
                    <p slot="content"></Table></p>
                </Panel>

            </Collapse>
        </Row>

        <Row>
            <h4>工作日历-排班</h4>
           <Col :span="CalendarLength">
                <FullCalendar :events="fcEvents" lang="zh" style="padding: 20px 0 20px 0" @dayClick="dayClick" @eventClick="evert"></FullCalendar>
            </Col>
        </Row>


          <Modal
            v-model="taskListModal"
            title="待办任务新建"
            @on-ok="editModal"
            @on-cancel="editModal"
            width="900" style="margin-bottom:100px">
            <Card>
            <Form :model="editModalMsg" ref="editModalMsg" :rules="ruleValidate" label-position="right" :label-width=200>
                <Row>
                    <Col span="20">
                        <Form-item label="任务名称" prop="task">
                            <Input v-model="editModalMsg.task"></Input>
                        </Form-item>
                        <Form-item label="负责人" prop="name">
                            <Input v-model="editModalMsg.name"></Input>
                        </Form-item>
                        <Form-item label="状态" prop="status">
                            <Input v-model="editModalMsg.status"></Input>
                        </Form-item>
                        <Form-item label="进度" prop="pros">
                            <Input v-model="editModalMsg.pros"></Input>
                        </Form-item>
                        <Form-item label="计划开始" prop="planBegin">
                           <Input v-model="editModalMsg.planBegin"></Input>
                        </Form-item>
                        <Form-item label="计划结束" prop="planEnd">
                           <Input v-model="editModalMsg.planEnd"></Input>
                        </Form-item>
                        <Form-item label="实际开始" prop="preBegin">
                            <Input v-model="editModalMsg.preBegin"></Input>
                        </Form-item>
                        <Form-item label="实际结束" prop="preEnd">
                            <Input v-model="editModalMsg.preEnd"></Input>
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
import FullCalendar from 'vue-fullcalendar'
//import VueResource from 'vue-resource'
Vue.use(FullCalendar);
//Vue.use(VueResource);
export default {
    data: function() {
        return {
            value:'1',
            taskListModal:false,
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
            editModalMsg:{
            },
            tableColumns:
            [
                {
                  title: '#',
                  value: 'index',
                  width:100,
                  align:'center',
                },
                {
                  title: '任务名称',
                  key: 'task',
                  width:150,
                  align:'center',
                },
                {
                  title: '负责人',
                  key: 'man',
                  width:150,
                  align:'center',
                },
                {
                  title: '状态',
                  key: 'status',
                  width:150,
                  align:'center',
                },
                {
                  title: '进度',
                  key: 'pros',
                  width:150,
                  align:'center',
                },
                {
                  title: '计划开始',
                  key: 'planBegin',
                  width:150,
                  align:'center',
                },
                {
                  title: '计划结束',
                  key: 'planEnd',
                  width:150,
                  align:'center',
                },
                {
                  title: '实际开始',
                  key: 'preBegin',
                  width:150,
                  align:'center',
                },
                {
                  title: '实际结束',
                  key: 'preEnd',
                  width:150,
                  align:'center',
                },
                {
                    title: '操作',
                    key: '',
                    width:220,
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '接单'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '退单')
                            ]);
                        }
                },
            ],
            TableLength: '11',
            dataCalendar: [],
            CalendarLength: '13',
        }
    },
    methods:{
        change(val){
            console.log(val)
        },
        dayClick(date, allDay, jsEvent, view){
            console.log('null')
        },
        evert(event, jsEvent, pos){
            this.dataCalendar.push(event);
        },
        reback(){
           window.history.go(-1);
        },
        shouSkill(){
          const title = '人员的技能要求';
          const content = '<Card><p>1.爱岗敬业。爱岗敬业是会计职业道德的基础</p><p>2.廉洁自律。廉洁自律是会计职业道德的前提</p><p>3.客观公正。出纳员在工作过程中，必须遵守各种纪律、法规、准则和制度，依法办事。</p></Card>';
          this.$Modal.info({
              title: title,
              content: content,
              style:'width:1000px;'
          });
        },
        newBuild(){
           this.taskListModal = true;
        }
    },
    mounted(){
    },
    components: {
        FullCalendar
    }
}

</script>

<style scoped>
.mian_con{
    margin-left:30px;
}
 a.show{
   color:#495060
 }
 a.show:hover{
     color:#2db7f5;
     cursor:pointer;
 }
 .mian_con .ivu-table:after{
  width:0 !important;
 }
</style>
