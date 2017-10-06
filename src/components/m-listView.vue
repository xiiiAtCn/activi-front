<template>
  <div>
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
    <!--<Row>-->
    <!--<Col span="21">-->
    <!--<Row type="flex" justify="start">-->
    <!--<Col :span="item.class" v-for="item in define.bodyDefine">-->
    <!--<h3>{{item.alias}}</h3>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--</Col>-->
    <!--<Col span="3">-->
    <!--<Row type="flex" justify="end">-->
    <!--<Col span="9">-->
    <!--<h3>操作</h3>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--</Col>-->
    <!--</Row>-->
    <div v-for="row in rows" style="margin-top: 20px;" :key="ui_id">
      <!--{{row['details'].length}}-->
      <Row style="margin-bottom: 5px">
        <Col span="6" v-for="item in define.titleDefine">
        <h3 style="display: inline; color: #80848f;">{{item.alias}}:</h3>&nbsp;&nbsp;<a href="javascript:void(0);" @click="getMeta(row._actions[item.field].url)"
                                                                                        v-if="row._actions[item.field]">{{row[item.field]}}</a><span v-else
                                                                                                                                                     style="font-size: 14px; color: #1c2438">{{row[item.field]}}</span>
        </Col>
      </Row>
      <!--<div v-if="row['details'].length === 0" class="show_1">-->
      <!--<Row class="show_2">-->
      <!--<Col span="6" v-for="item in define.titleDefine">-->
      <!--<h3 style="display: inline; color: #80848f;">{{item.alias}}:</h3>&nbsp;&nbsp;<a href="javascript:void(0);" @click="getMeta(row._actions[item.field].url)" v-if="row._actions[item.field]">{{row[item.field]}}</a><span v-else style="font-size: 14px; color: #1c2438">{{row[item.field]}}</span>-->
      <!--</Col>-->
      <!--</Row>-->
      <!--</div>-->
      <Card>
        <Row>
          <Col span="18" class="border_1">
          <!--有明细显示-->
          <Row type="flex" justify="start" :gutter="16" v-if="row['details'].length > 0" v-for="detail in row.details" style="" class="border_2">
            <Col :span="item.class" v-for="item in define.bodyDefine">
            <Checkbox v-if="item.allSelect"></Checkbox>
            <div v-else v-for="filed in item.fieldDefine" style="color: #80848f; ">
              {{filed.alias}}:&nbsp;<a @click="getMeta(row._actions[filed.field].url)" v-if="row._actions[filed.field]">{{detail[filed.field]}}</a>
              <span v-else style="color: #1c2438">{{detail[filed.field]}}</span>
            </div>
            </Col>
          </Row>
          <!--无明细显示-->
          <Row type="flex" justify="start" :gutter="16" v-if="row['details'].length === 0" style="margin-top: 8px">
            <Col span="10" push="2" class="border_3">
            <p style="color: #ed3f14; "><i class="ivu-icon ivu-icon-android-create" style="padding-right: 6px"></i>明细未填写</p>
            </Col>
          </Row>
          </Col>
          <Col span="6">
          <Row type="flex" justify="end">
            <Button-group>
              <Button v-for="action in row._actions" @click="getMeta(action.url)" size="small">{{action.text}}</Button>
            </Button-group>
          </Row>
          </Col>
        </Row>
      </Card>
    </div>
  </div>
</template>
<script>
  //  import Vue from 'vue'
  import { dispatch } from '../utils/skipUtils'
  import { default as fetch } from '../utils/DefineFetcher'

  export default {
    props: ['define', 'content'],
    mounted: function () {
      var _this = this
      var url = _this.define.data_url
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
  .border_1 .border_2:last-child {
    border-bottom: none;
    padding: 12px 0 0 0;
  }

  .border_2 {
    padding: 1px 0 12px 0;
    margin-bottom: 3px;
    border-bottom: 1px dashed #dddee1
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

  .show_1 .show_2:first-of-type {
    display: block;
  }

  .show_2 {
    display: none;
  }

</style>
