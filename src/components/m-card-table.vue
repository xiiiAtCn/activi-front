<template>
    <Card :bordered="true">
        <div slot="title">
            <Table :columns="columnsData" :data="tableData"></Table>
        </div>
        <div>
            <Row class="container">
                <Col span="6" v-for="item in contentData">
                    <span class="title">{{item.title}}</span>
                    <span class="content">{{item.content}}</span>
                </Col>
            </Row>
        </div>
    </Card>
</template>
<script>
  //  import Vue from 'vue'
  //  import utils from '../utils/utils'
  import _ from 'lodash'
  import { dispatch } from '../utils/actionUtils'

  export default {
      data () {
          return {
              columnsData: [
                  {
                      title: '任务ID',
                      key: 'name'
                  },
                  {
                      title: '负责人',
                      key: 'age'
                  },
                  {
                      title: '工作中心',
                      key: 'address'
                  },
                  {
                      title: '计划开始',
                      key: 'address'
                  },
                  {
                      title: '计划结束',
                      key: 'address'
                  },
                  {
                      title: '工期',
                      key: 'address'
                  },
                  {
                      title: '前置任务',
                      key: 'address'
                  },
                  {
                      title: '时间延搁',
                      key: 'address'
                  },
                  {
                      title: '实际开始',
                      key: 'address'
                  },
                  {
                      title: '实际结束',
                      key: 'address'
                  },
              ],
              tableData:[
                  {
                      name: 'John Brown',
                      age: 18,
                      address: 'New York'
                  }
              ],
              contentData:[
                  {
                      title:'制单人',
                      content:'高雪春'
                  },
                  {
                      title:'单号',
                      content:'bill-20171205-8'
                  },
                  {
                      title:'询价单内码',
                      content:'xunjia-20171205-11'
                  },
                  {
                      title:'供应商名称',
                      content:'北京市燃气集团有限责122222222222任公司第3分公司'
                  },
                  {
                      title:'使用部门id',
                      content:'09'
                  },
                  {
                      title:'单号',
                      content:'bill-20171205-8'
                  },
                  {
                      title:'询价单内码',
                      content:'xunjia-20171205-11'
                  },
                  {
                      title:'供应商名称',
                      content:'北京市燃气集团有限责任公司第3分公司'
                  },
                  {
                      title:'使用部门id',
                      content:'09'
                  },
              ]
          }
      },
      props: {
          'define': {
              type: Object,
              default:{}
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
        font-weight: bold;
    }
    .container .content{
        width: 70%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>
