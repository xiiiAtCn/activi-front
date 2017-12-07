<template>
  <div>
    <component :is="data.ui_type" v-bind:define="data.ui_define" v-bind:content="data.ui_content"></component>
  </div>
</template>
<script>
  export default {
      mounted: function () {
          let _this = this
          let url = _this.$route.query.url
          _this.$http.get(url).then(function (result) {
              _this.data = result.body
          })
      },
      data: function () {
          return {
              'data': []
          }
      }
  }
</script>

