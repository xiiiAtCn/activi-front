<template>
  <div id="app" style="display: flex; align-items: flex-start;">
    <div>
      <ul id="leftMenu" class="nav nav-pills nav-stacked" role="tablist">
        <li role="presentation" style="width: 140px" v-for="item in data">
          <router-link :to="{path: item.path, query: { url: item.query }}"><strong>{{item.name}}</strong></router-link>
        </li>
      </ul>
    </div>
    <div style="margin-left: 16px; width: 100%">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
      mounted: function () {
          let _this = this
          _this.data = [
        {'path': 'mEntry', 'query': '/api/bo/metasDefine', 'name': 'bomate'}
          ]
      },
      data: function () {
          return {
              'data': []
          }
      }
  }
</script>
<style>
  #leftMenu {
    background: white;
  }
</style>

