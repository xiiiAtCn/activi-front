/* eslint-disable no-new */
/**
 * Created by 高鹏程 on 2017/5/9.
 */
import Vue from 'vue'
import mHead from '../components/m-head.vue'

new Vue({
  el: '#head',
  data: function () {
    return {username: '11111'}
  },
  components: {
    mHead
  }
})
