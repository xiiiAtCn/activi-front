<template>
    <div>
        <Card :bordered="true" v-for="(item,key) in tableData" class="card">
            <div slot="title">
                <Table :columns="columnsData" :data="item" style="text-align: center"></Table>
            </div>
            <div>
                <Row class="container">
                    <Col span="6" v-for="v in spanData[key]">
                        <span class="title">{{v.title}} </span>
                        <span class="content"> {{v.value}}</span>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
</template>
<script>
  //  import Vue from 'vue'
  //  import utils from '../utils/utils'
  import _ from 'lodash'
  import { dispatch } from '../utils/actionUtils'

  export default {
      props:{
          content:{
              type:null,
              default (){
                  return {}
              }
          },
          define:{
              type:null,
              default (){
                  return {}
              }
          }
      },
      mounted(){
          this.handleDatas()
      },
      data () {
          return {
              columnsData: [
                  {
                      title: '任务ID',
                      key: 'FTASKID',
                      align:'center'
                  },
                  {
                      title: '负责人姓名',
                      key: 'FchargeName',
                      align:'center'
                  },
                  {
                      title: '负责人ID',
                      key: 'FchargeID',
                      align:'center'
                  },
                  {
                      title: '工作中心名称',
                      key: 'FworkcenterName',
                      align:'center'
                  },
                  {
                      title: '工作中心ID',
                      key: 'FworkcenterID',
                      align:'center'
                  },
                  {
                      title: '计划开始时间',
                      key: 'FplanStart',
                      align:'center'
                  },
                  {
                      title: '计划结束时间',
                      key: 'FplanEnd',
                      align:'center'
                  },
                  {
                      title: '工期',
                      key: 'Fschedule',
                      align:'center'
                  },
                  {
                      title: '前置任务',
                      key: 'FpreTask',
                      align:'center'
                  },
                  {
                      title: '延搁时间',
                      key: 'FlagTime',
                      align:'center'
                  },
                  {
                      title: '实际开始',
                      key: 'FactualStart',
                      align:'center'
                  },
                  {
                      title: '实际结束',
                      key: 'FactualEnd',
                      align:'center'
                  },
              ],
              tableData:[],
              spanData:[]
          }
      },
      methods:{
          handleDatas(){
              if(this.define.datas === []){return}
              let datas = this.define.datas
              let columnsData = this.columnsData
              let tableData=[]
              let spanData=[]
              let spliceList=[]
              for(let i=0,row={};i<datas.length;i++){
                  tableData[i] = []
                  spanData[i] = []
                  spliceList=[]
                  for(let j=0;j<datas[i].length;j++){
                      for(let n=0;n<columnsData.length;n++){
                          if(datas[i][j].key === columnsData[n].key){
                              row[datas[i][j].key]=datas[i][j].value
                              spliceList.push(j)
                          }
                      }
                  }
                  tableData[i].push(row)
                  for(let k=spliceList.length-1;k>=0;k--){
                      datas[i].splice(spliceList[k],1)
                  }
                  spanData[i] = datas[i]
              }
              this.tableData = tableData
              this.spanData = spanData
          }
      }
  }
</script>
<style scoped>
    .container span{
        float: left;
        display: inline-block;
        height: 36px;
    }
    .container .title{
        text-align: right;
        width: 30%;
        padding: 0 5px;
        font-weight: 600;
        color: #aaa;
    }
    .card{
        margin-bottom: 15px;
    }
    .container .content{
        width: 70%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #333;
    }
    .container .ivu-table-cell{
        word-break:keep-all;
    }
    .ivu-table-cell {
        line-height: 1.5;
    }
</style>
