<template>
  <div>
    <Row>
      <Col span="4" style="width: 200px;height: 1000px;border-right: 1px solid #ddd;" class="out-use-menu-vertical">
      <m-head :user="username"></m-head>
      </Col>
      <Col span="20">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
      </Col>
    </Row>
  </div>
</template>
<script>
  /**
   * Vue
   */
  import mHead from './m-head.vue'
  import store from '../vuex/store'

  export default {
    store,
    components: {mHead},
    data () {
      return {username: 'developer'}
    }
  }
</script>

<style scoped>

</style>
