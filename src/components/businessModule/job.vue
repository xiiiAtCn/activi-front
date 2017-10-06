<template lang="html">
  <div class="" style="width: 80%;margin:0 auto;">
    <h3 style="margin:10px 0;">任务中心</h3>
    <Modal
        v-model="modal1"
        title="任务详情"
        @on-ok="ok"
        @on-cancel="cancel">
        <div>名称：{{modal.name}}</div>
        <div>内容：{{modal.content}}</div>
        <div>状态：
          <div class="ivu-tag" :class="modal.statusColor">
            <span class="ivu-tag-text">{{modal.statusName}}</span>
          </div>
        </div>
    </Modal>
    <Table :data="tableData1" :columns="tableColumns1" stripe></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="totalNum" :current="currentNum" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
    <div class="demo-spin-container" v-if="spinShow">
        <Spin size="large" fix></Spin>
    </div>
  </div>
</template>

<script>
import {dispatch} from  '../../utils/skipUtils'
import Vue from 'vue';
//import VueResource from 'vue-resource'
//Vue.use(VueResource);

export default {
  data: function() {
    return {
      spinShow: false,
      modal:{
        name:'test'
      },
      modal1: false,

        totalNum: 0,
        currentNum: 1,
        pageSize: 20,
        tableData1: [],
        tableColumns1: [
            {
                title: '任务名称',
                key: 'name'
            },
            {
                title: '状态',
                key: 'status',
                render: (h, params) => {
                    const row = params.row;
                    const color = row.status === 'FINISHED'
                    ? 'green' : row.status === 'SUSPEND'
                    ? 'red' : row.status === 'STARTED'
                    ? 'blue' : row.status === 'READY'
                    ? 'yellow' : 'gray';
                    const text = row.status === 'FINISHED'
                    ? '已完成' : row.status === 'SUSPEND'
                    ? '挂起' : row.status === 'STARTED'
                    ? '已开始' : row.status === 'READY'
                    ? '准备中' : '未开始';

                    return h('Tag', {
                        props: {
                            type: 'dot',
                            color: color
                        }
                    }, text);
                }
            },
            {
                title: '所属流程',
                key: 'portrayal',
                // render: (h, params) => {
                //     return h('Poptip', {
                //         props: {
                //             trigger: 'hover',
                //             title: params.row.portrayal.length + '个画像',
                //             placement: 'bottom'
                //         }
                //     }, [
                //         h('Tag', params.row.portrayal.length),
                //         h('div', {
                //             slot: 'content'
                //         }, [
                //             h('ul', this.tableData1[params.index].portrayal.map(item => {
                //                 return h('li', {
                //                     style: {
                //                         textAlign: 'center',
                //                         padding: '4px'
                //                     }
                //                 }, item)
                //             }))
                //         ])
                //     ]);
                // }
            },
            {
                title: '任务人数（假数据）',
                key: 'people',
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            trigger: 'hover',
                            title: params.row.people.length + '个客群',
                            placement: 'bottom'
                        }
                    }, [
                        h('Tag', params.row.people.length),
                        h('div', {
                            slot: 'content'
                        }, [
                            h('ul', this.tableData1[params.index].people.map(item => {
                                return h('li', {
                                    style: {
                                        textAlign: 'center',
                                        padding: '4px'
                                    }
                                }, item.n + '：' + item.c + '%')
                            }))
                        ])
                    ]);
                }
            },
            {
                title: '创建时间',
                key: 'time',
                render: (h, params) => {
                    return h('div', this.formatDate(this.tableData1[params.index].time));
                }
            },
            {
                title: '更新时间',
                key: 'update',
                render: (h, params) => {
                    return h('div', this.formatDate(this.tableData1[params.index].update));
                }
            },
            {
                        title: '操作',
                        key: 'hiddenParams',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                          let viewBtn = h('Button', {
                              props: {
                                  type: 'info',
                                  size: 'small'
                              },
                              style: {
                                  marginRight: '10px'
                              },
                              on: {
                                  click: () => {
                                      this.show(params.index)
                                  }
                              }
                          }, '查看');
                          let execBtn;
                          if(params.row.hiddenParams.todoType == 'modifyForm'){
                            execBtn =  h('Button', {
                              props: {
                                type: 'success',
                                size: 'small'
                              },
                              on: {
                                click: () => {
                                  this.exec(params.row.hiddenParams.jobInsId);
                                }
                              }
                            }, '执行');
                          }else{
                            execBtn =  h('Button', {
                              props: {
                                type: 'dashed',
                                size: 'small',
                                disabled: true
                              },
                              on: {
                                click: () => {
                                }
                              }
                            }, '执行');
                          }
                            return h('div', [
                                viewBtn,
                                execBtn
                            ]);
                        }
                    }
        ]
    }
        },
        created:function(){
          this.getData(this.currentNum, this.pageSize);
        },
        methods: {
          ok:function() {
                this.$Message.info('点击了确定');
            },
            cancel:function() {
                this.$Message.info('点击了取消');
            },
          exec:function(jobInsId){
            var params = {'jobInsId':jobInsId};
            axios.get("/api/job/jobOne",{'params':params}).then(data =>{
              if(data.body.todoType=="modifyForm"){
                dispatch({
                    type: "link",
                    url: "/api/formsNew/listDetailsEdit/"+ data.body.objMetaId + "/" + data.body.objInsId + "/" + data.body.jobInsId,
                    at : "/layoutContent/01/page"
                })
              }
            },data =>{
              console.log('error');
            });
            this.spinShow=true;
          },
          show:function(index) {
              this.modal1 = true;
              this.modal.name = this.tableData1[index].name;
              this.modal.content = this.tableData1[index].portrayal;
              this.modal.statusColor = this.tableData1[index].status === 'FINISHED'
              ? 'ivu-tag-green' : this.tableData1[index].status === 'SUSPEND'
              ? 'ivu-tag-red' : this.tableData1[index].status === 'STARTED'
              ? 'ivu-tag-blue' : this.tableData1[index].status === 'READY'
              ? 'ivu-tag-yellow' : 'ivu-tag-gray';
              this.modal.statusName = this.tableData1[index].status === 'FINISHED'
              ? '已完成' : this.tableData1[index].status === 'SUSPEND'
              ? '挂起' : this.tableData1[index].status === 'STARTED'
              ? '已开始' : this.tableData1[index].status === 'READY'
              ? '准备中' : '未开始';
              // console.log(this.modal.statusColor);
          },
            formatDate:function(date) {
                // console.log(date)
                let tempDate = new Date(date);
                const y = tempDate.getFullYear();
                let m = tempDate.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = tempDate.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = tempDate.getHours();
                h = h < 10 ? '0' + h : h;
                let mi = tempDate.getMinutes();
                mi = mi < 10 ? '0' + mi : mi;
                return y + '-' + m + '-' + d + ' ' + h + ':' + mi;
            },
            changePage:function(current) {
                this.getData(current, this.pageSize);
            },
            getData:function(current, size){
              var params = {'current':current,'size':size};
              axios.get("/api/job/jobList",{'params':params}).then(data =>{
                this.tableData1 = data.body.content;
                this.totalNum = data.body.total;
                // console.log(data.body.total);
              },data =>{
                console.log('error');
              });
            }
        }
}
</script>

<style lang="css">
.demo-spin-container{
        width: 100%;
        height: 100%;
        position: fixed;
        left:0;
        top:0;
        z-index:3;
        opacity: 0.9;
    }
</style>
