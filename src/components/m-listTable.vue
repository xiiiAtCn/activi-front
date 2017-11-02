<template>
  <div>
    <!--新建按钮-->
    <Row class="config">
      <div v-for="item in define.operation" class="operation">
        <Button type="primary" v-if="item.url" shape="circle" @click="getMeta(item.url)">{{item.name}}</Button>
        <Button type="primary" v-else shape="circle" @click="showModal(item.name)">{{item.name}}</Button>
      </div>
      <div class="search">
        <Input v-model="valueSearch" placeholder="筛选">
        <Button slot="append" icon="ios-search"></Button>
        </Input>
      </div>
    </Row>
    <br>

    <!--表格-->
    <table style="text-align: left;" width="100%">
      <!--列头-->
      <thead style="line-height: 46px">
      <tr>
        <th v-for="item in define.titleDefine">
          <h3 style="color: #999999;">{{item.alias}}</h3>
        </th>
        <th>
          <h3 style="color: #999999;">操作</h3>
        </th>
      </tr>
      </thead>
      <!--数据-->
      <tbody>
      <tr v-for="row in rows" style="line-height: 46px">
        <td v-for="item in define.titleDefine">
          <a href="javascript:void(0);" @click="getMeta(row._actions[item.field].url)" v-if="row._actions[item.field]">{{row[item.field]}}</a>
          <span v-else style="font-size: 14px; color: #1c2438">{{row[item.field]}}</span>
        </td>
        <td class="dataRow_btn">
          <Button-group>
            <Button v-for="action in row._actions" @click="getMeta(action.url)" size="small">{{action.text}}</Button>
          </Button-group>
        </td>
      </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
  //  import Vue from 'vue'
  import { dispatch } from '../utils/actionUtils'
  import { default as fetch } from '../utils/DefineFetcher'

  export default {
    props: ['define', 'content'],
    mounted: function () {
      let _this = this
      let url = _this.define.data_url
      fetch(url, function (error, body) {
        if (error === null) {
          _this.rows = body
        }
      })
    },
    methods: {
      getMeta: function (action) {
        dispatch(action)
      }
    },
    data: function () {
      return {
        rows: [],
        valueSearch: ''
      }
    }
  }
</script>
<style>
  table {
    border-collapse: collapse;
  }

  table thead {
    border-bottom: 1px solid #cccccc;
  }

  table tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  .config {
    display: flex;
    justify-content: flex-start;
    position: relative;
  }

  .search {
    margin-left: 20px;
    min-width: 300px;
    position: absolute;
    right: 0;
  }
</style>
