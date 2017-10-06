<template>
  <div>
    <div class="page-header">
      <h3>{{content.ui_alias}}</h3>
    </div>
    <component :is="content.ui_type" :id="content.ui_id" v-bind:define="content.ui_define" v-bind:content="content.ui_content"></component>
  </div>
</template>
<script>
  /**
   * Vue
   */
  import mTab from './m-tab.vue'
  import mTable from './m-table.vue'
  import mMenu from './m-menu.vue'
  import mSection from './m-section.vue'

  export default {
    components: {mTab, mTable, mMenu, mSection},
    props: ['content', 'define'],
    mounted: function () {
      document.title = this.content.ui_alias
    },
    data: function () {
      return {}
    }
  }
</script>


