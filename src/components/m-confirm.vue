<template>
  <div class="text-right">
    <!--<Button type="primary" shape="circle" @click="confirm">提交</Button>-->
    <hr/>
    <Row type="flex" justify="end">
      <!-- TODO 循环-->
      <Col span="8" class="pull-right">
      <Button type="success" @click="confirm" :disabled="this.$store.state.validStatus.valid==='INVALID'">
        <!--<Icon type="reply"></Icon>-->
        提交
      </Button>
      <!--{{this.$store.state.validStatus.valid}}-->
      </Col>
    </Row>
  </div>
</template>
<script>
  //  import Vue from 'vue'
  import { dispatch } from '../utils/skipUtils'
  //  import bus from '../router/bus'
  //  import store from '../vuex/store'
  //  import router from '../routers/routers'

  export default {
    props: ['content', 'define'],
    methods: {
      /* 提交 */
      confirm: function () {
        dispatch(this.define)
      }
    }
  }
</script>


<style scoped>
  hr {
    margin-top: 20px;
    margin-bottom: 10px;
    /*border-color: #faf0f7;*/
    border: none;
    height: 1px;
    background-color: #e9eaec;
  }

  .search {
    position: absolute;
    right: 0;
    max-width: 300px;
  }
</style>
