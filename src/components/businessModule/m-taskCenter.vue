<template lang="html">
    <div class="layout-content">
         <Row style="margin: 20px 0">
            <Collapse v-model="collapseValue" accordion style="background: #fff5e6; border: 1px solid #ffebcc; font-size: 14px;">
                <Panel name="1">
                <span style="color: #333333">任务中心</span>
                  <p slot="content" class="con" style="border-bottom:1px dashed #ccc;padding:5px 0">
                      <span type="info" class="task_title">项目:</span><a href="javascript:;" class="selected" v-for="(item,index) in project" :key="index" :value="item.id">{{item.name}}</a>
                  </p>
                  <p slot="content" class="con" style="border-bottom:1px dashed #ccc;padding:5px 0;">
                     <span type="info" class="task_title">工作中心:</span><a href="javascript:;" class="selected" v-for="(item,index) in workCenter" :key="index" :value="item.id">{{item.name}}</a>
                  </p>
                  <p slot="content" class="con" style="border-bottom:1px dashed #ccc;padding:5px 0" v-if="bannerShowFlag">
                  <span type="info" class="task_title">JOB-META:</span>
                  </p>
                   <p slot="content" class="con" style="border-bottom:1px dashed #ccc;padding:5px 0" v-if="bannerShowFlag">
                      <span type="info" class="task_title">工单-META:</span>
                  </p>
                   <p slot="content" class="con" style="border-bottom:1px dashed #ccc;padding:5px 0" v-if="bannerShowFlag">
                      <span type="info" class="task_title">计划开始-结束范围指定:</span>
                  </p>
                  <p slot="content" class="con" style="border-bottom:1px dashed #ccc;padding:5px 0" v-if="bannerShowFlag">
                     <span type="info" class="task_title">任务状态:</span>
                  </p>
                </Panel>
            </Collapse>
            <div v-if="displayFlag">
                <div class="common spread" @click="show" v-if="!bannerShowFlag">
                   <span>更多选项（JOB-META、工单-META、任务状态等</span><span class="item dot-bottom"></span>
                </div>
                 <div class="common retrant" @click="show" v-if="bannerShowFlag">
                   <span>收起</span><span class="item dot-top"></span>
                </div>
            </div>
            <Button type="info"  @click="newTask" style="float:right;margin-right:20px;margin-top:10px">增加</Button>
            <Table :data="tableData" :columns="tableColumns" style="margin-top:50px"></Table>
        </Row>

        <a v-if="showRocketFlag" href="javascript:;" @click="go2Top" style="position: fixed;bottom:0;right:0"><img style="width:100px;" title="回到顶部" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505387950378&di=015ca2e4989fb8514667c2ca2979edc3&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F016f5a56cfc5346ac7252ce6646ca3.png"/></a>
        <Modal
            v-model="taskListModal"
            title="待办任务新建"
            @on-ok="editModal"
            @on-cancel="editModal"
            width="900" style="margin-bottom:100px">
            <Card>
            <Form :model="editModalMsg" ref="editModalMsg"  label-position="right" :label-width=200>
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
                        <Form-item label="派发人" prop="postMan">
                            <Input v-model="editModalMsg.postMan"></Input>
                        </Form-item>
                         <Form-item label="发起日期" prop="postDay">
                            <Input v-model="editModalMsg.postDay"></Input>
                        </Form-item>
                         <Form-item label="详情单据" prop="datail">
                            <Input v-model="editModalMsg.datail"></Input>
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
/* eslint-disable space-infix-ops */

import Vue from 'vue'
export default {
    data: function() {
        return {
           collapseValue:'1',
           taskListModal:false,
           bannerShowFlag:false,
           displayFlag:true,
           showRocketFlag:false,
           pageNumber:0,
           isLoading:false,
           pageSize:20,
           project:[
               {
                'id':'01',
                'name':'纳爱斯脱硫脱硝DCS系统'
               },
               {
                'id':'02',
                'name':'xx大学教务系统'
               },
               {
                'id':'03',
                'name':'xx医院管理系统'
               },
           ],
           workCenter:[
              {
                'id':'01',
                'name':'工作中心1'
              },
              {
                'id':'02',
                'name':'工作中心2'
              },
              {
                'id':'03',
                'name':'工作中心3'
              },
           ],
           tableData:[],
           tableColumns: [
                {
                  title: '#',
                  align:'center',
                },
                {
                  title: '任务名称',
                  width:200,
                  align:'right',
                  render(h,params){
                     return h('a',{
                       on:{
                           click:()=>{

                           }
                       }
                   },params.row.taskName)
                  }
                },
                {
                  title: '负责人',
                  key: 'jobMetaName',
                  align:'center',
                },
                {
                  title: '状态',
                  key: 'runStatus',
                  align:'center',
                },
                {
                  title: '进度',
                  key: 'finishStatus',
                  align:'center',
                  render: (h, params) => {
                      if(params.row.finishStatus==='进度拖延严重'){
                             return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        width:'10px',
                                        height:'10px',
                                        border:0,
                                        borderRadius:'10px'
                                    },
                                    on: {
                                        click: () => {

                                        }
                                    }
                                })
                            ]);
                      }
                      if(params.row.finishStatus==='进度略有拖延'){
                             return h('div', [
                                  h('Button', {
                                      props: {
                                          type: 'warning',
                                          size: 'small'
                                      },
                                      style: {
                                          width:'10px',
                                          height:'10px',
                                          border:0,
                                          borderRadius:'10px'
                                      },
                                      on: {
                                          click: () => {

                                          }
                                      }
                                  })
                              ]);
                      }
                      if(params.row.finishStatus==='进度顺利'){
                             return h('div', [
                                  h('Button', {
                                      props: {
                                          type: 'success',
                                          size: 'small'
                                      },
                                      style: {
                                          width:'10px',
                                          height:'10px',
                                          border:0,
                                          borderRadius:'10px'
                                      },
                                      on: {
                                          click: () => {

                                          }
                                      }
                                  })
                              ]);
                      }
                  }
                },
                {
                  title: '派发人',
                  key: '',
                  align:'center',
                },
                {
                  title: '发起日期',
                  key: 'createDate',
                  align:'center',
                },
                {
                  title: '详情单据',
                  key: '',
                  align:'center',
                },
                {
                  title: '计划开始',
                  key: 'planStart',
                  align:'center',
                },
                {
                  title: '计划结束',
                  key: 'planEnd',
                  align:'center',
                },
                {
                  title: '实际开始',
                  key: 'realStart',
                  align:'center',
                },
                {
                  title: '实际结束',
                  key: 'realEnd',
                  align:'center',
                },
                {
                  title:'操作',
                  align:'center',
                  width:160,
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
                              }, '处理')
                          ]);
                      }
                }
           ],
           editModalMsg:{
           },
        }
    },
    watch: {
      collapseValue(value) {
        if(value[0]==='1'){
          this.displayFlag=true
        }else{
          this.displayFlag=false
        }
      }
    },
    methods:{
      newTask(){
          this.taskListModal=true
      },
      show(){
        this.bannerShowFlag=!this.bannerShowFlag
        if(this.bannerShowFlag){
           this.$set(this.checkBtn, 'text', '收起')
        }else{
           this.$set(this.checkBtn, 'text', '')
        }
      },
      go2Top(){
          let  scrollTop=document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop
          let id=setInterval(function(){
            scrollTop-=300;
            document.documentElement.scrollTop=scrollTop
            document.body.scrollTop=scrollTop
            if(scrollTop<=0){
              clearInterval(id)
            }
          },20)
      },
      initData(){
         let that=this
         that.isLoading=true
         that.pageNumber++
         axios.get("/api/job/jobData/"+this.pageNumber+'/'+this.pageSize)
           .then(data => {
               let returnData = data.data;
               for(var item=0;item<returnData.length;item++){
                    returnData[item]['taskName'] = returnData[item].wfMetaName +'-'+ returnData[item].jobMetaName
                    let unixTimestamp = new Date(returnData[item].createDate) ;
                    returnData[item].createDate = unixTimestamp.toLocaleString().substr(0,9);

                    let unixTimestampOne = new Date(returnData[item].realStart) ;
                    returnData[item].realStart = unixTimestampOne.toLocaleString().substr(0,9);

                    let unixTimestampTwo = new Date(returnData[item].realEnd) ;
                    returnData[item].realEnd = unixTimestampTwo.toLocaleString().substr(0,9);

                    let unixTimestampThree = new Date(returnData[item].planStart) ;
                    returnData[item].planStart = unixTimestampThree.toLocaleString().substr(0,9);

                    let unixTimestampFour = new Date(returnData[item].planEnd) ;
                    returnData[item].planEnd = unixTimestampFour.toLocaleString().substr(0,9);
                    this.tableData.push(returnData[item])

               }
               //this.tableData = returnData
               that.isLoading=false
               console.log(this.tableData)
            }, data => {
              console.error('error');
            });
      },
      onScroll () {
        let that=this
        $(window).scroll(function () {
        　　var scrollTop = $(this).scrollTop();
        　　var scrollHeight = $(document).height();
        　　var windowHeight = $(this).height();
        　　if(scrollHeight-scrollTop-windowHeight <=100){
                if(that.isLoading){
                   return
                }else{
                   that.initData()
                   //that.go2Top()
                   that.showRocketFlag=true
                }
        　　}else{
              console.log("不能获取数据")
              that.showRocketFlag=false
            }
        });
      },
     editModal(){
      },
    },
    mounted(){
      this.initData()
      this.$nextTick(function () {
        window.addEventListener('scroll', this.onScroll)
      })
    }
}
</script>
<style scoped>
.layout-content{
    margin-left:30px;
}
.common{
  margin:0 auto;
  height:30px;
  line-height:30px;
  border:1px solid #ccc;
  border-top:1px solid #fff;
  cursor:pointer;
  text-align: center;
}
.spread{
   width:300px;
}
.spread span{
  font-size:12px;
}
.retrant{
  width:60px;
}
.retrant span{
   font-size:12px;
}
.item {
    float:right;
    clear:both;
    margin-top:10px;
    margin-right:4px;
}
.dot-bottom {
    font-size: 0;
    line-height: 0;
    border-width: 7px;
    border-color: #ccc;
    border-bottom-width: 0;
    border-style: dashed;
    border-top-style: solid;
    border-left-color: transparent;
    border-right-color: transparent;
}
.dot-top {
    font-size: 0;
    line-height: 0;
    border-width: 7px;
    border-color: #ccc;
    border-top-width: 0;
    border-style: dashed;
    border-bottom-style: solid;
    border-left-color: transparent;
    border-right-color: transparent;
}
a.selected{
  padding:0 20px;
  color:#000;
  font-size:12px;
}
a.selected:hover{
  padding:0 20px;
  color:#2d8cf0;
  font-size:12px;
}
a.selected:visited{
  padding:0 20px;
  color:#f00;
  font-size:12px;
}
.task_title{
  display: inline-block;
  width:160px;

}
</style>
