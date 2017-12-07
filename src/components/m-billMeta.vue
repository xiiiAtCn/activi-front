<template>
  <Row :gutter="16" style="padding: 0 10px">
    <Row v-for="(item, index) in items" style="margin: 10px 0 30px 0" :key="index">
      <Button icon="navicon-round" class="warnBtn">{{item.template.title}}</Button>
      <div style="border-bottom: 1px solid #fabf8f; margin-bottom: 16px"></div>
      <Col v-for="(boMeta, sequence) in item.children" :key="sequence"  style="display: inline-block; margin-right: 12px">
      <Button-group>
        <Button :key="button.text" v-for="button in boMeta.buttons" :type="button.type"
                @click="getMeta(button.url)">{{button.text}}
        </Button>
      </Button-group>
      </Col>
    </Row>
  </Row>
</template>
<script>
  //  import Vue from 'vue'
  //  import utils from '../utils/utils'
  import _ from 'lodash'
  import { dispatch } from '../utils/actionUtils'

  export default {

      props: {'define': {type: Object}},
      computed: {
          items: function () {
//        return utils(this.define, [], 'links')
              return _.get(this.define, 'links', [])
          }
      },
      methods: {
          getMeta: function (url) {
              dispatch(url)
          }
      }
  }

</script>
<style scoped>
  a.btn {
    margin-right: 5px;
  }

  .warnBtn {
    border-radius: 0;
    background: #fabf8f;
    color: white;
    border: 1px solid #fabf8f;
    transition: 0.5s;
  }

  .warnBtn:hover {
    background: #ffcc99;
    border: 1px solid #ffcc99;
  }
</style>
