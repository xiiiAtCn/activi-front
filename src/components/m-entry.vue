<template>
  <div>
    <component :is="data.ui_type" :id="data.ui_id" v-bind:define="data.ui_define" v-bind:content="data.ui_content"></component>
  </div>
</template>
<script>
  import mTable from './m-table.vue'
  import mTab from './m-tab.vue'
  import mRow from './base/m-row.vue'
  import mSteps from './base/m-steps.vue'

  export default {
    components: {mTable, mTab, mRow, mSteps},
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

