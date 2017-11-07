<template>
  <div>
    <div v-for="item in define.tree">
      <span v-if="item.requestUrl" class="btn btn-success" @click="clickName(item.requestUrl)">{{item.name}}</span>
      <span v-else class="btn btn-success">{{item.name}}</span>
      <span v-if="item.childUrl" class="btn btn-danger" @click="toggle(item.childUrl,item)">[{{open ? '-' : '+'}}]</span>
      <ul>
        <m-tree v-if="item.children" :define="item.children"></m-tree>
      </ul>
    </div>
  </div>
</template>
<script>
//  import Vue from 'vue'
//  import 'vue-resource'
  import axios from 'axios'

  export default {
      name: 'm-tree',
      props: ['define'],
      data: function () {
          return {
              open: false
          }
      },
      methods: {
          clickName: function (url) {
              this.$http.get(url).then(function (result) {
//          new Vue({
//            el: '#aaaa',
//            beforeCreate: function () {
//              this.$options.components.mPage = require('./m-page.vue')
//            },
//            template:
//            '<div id="aaaa">' +
//            '<component :is="data.ui_type" :define="data.ui_define" :content="data.ui_content"></component>' +
//            '</div>',
//            data: function () {
//              return {
//                data: result.body.content
//              }
//            }
//          })
              })
          },
          toggle: function (url, item) {
              var _this = this
              axios.get(url).then(function (result) {
                  _this.$set('children', result.body)
              })
          }
      }
  }
</script>
