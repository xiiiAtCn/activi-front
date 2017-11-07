<template>
  <div>
    <ul id="myTab" class="nav nav-tabs">
      <li v-bind:class="{ active : $index==0 }" v-for="(item, key, $index) in define" :id="key" @click="changeTab(key)">
        <a data-toggle="tab">
          {{item.alias}}
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <div v-bind:class="{ in : $index==0 }" class="tab-pane fade active" :id="'tab' + key" v-for="(item, key, $index) in content">
        <h3>{{item.ui_alias}}</h3>
        <component :is="item.ui_type" :id="item.ui_id" v-bind:define="item.ui_define" v-bind:content="item.content"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import mTable from './m-table.vue'

  export default {
      components: {mTable},
      props: ['define', 'content'],
      methods: {
          changeTab: function (id) {
              var define = this.define
              for (var key in define) {
                  if (key === id) {
                      document.getElementById(id).className = 'active'
                      document.getElementById('tab' + id).className = 'tab-pane fade in active'
                  } else {
                      document.getElementById(key).className = ''
                      document.getElementById('tab' + key).className = 'tab-pane fade'
                  }
              }
          }
      },
      data: function () {
          return {}
      }
  }

</script>

<style>
  .nav-tabs {
    border-bottom: 0;
  }
</style>

