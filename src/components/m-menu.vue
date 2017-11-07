<template>
  <div class="row">
    <div class="col-xs-2 col-xs-offset-1">
      <div class="list-group" style="margin-top: 55px;">
        <div v-for="(item,$index) in define.link">
          <router-link :id="$index" @click.native="change($index)" v-bind:class="{ active : $index==action }" class="list-group-item"
                       :to="{path: item.path, query: { url: item.query }}">
            <strong>{{item.name}}</strong>
          </router-link>
        </div>
      </div>
    </div>
    <div class="col-xs-8">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
      props: ['define', 'content'],
      mounted: function () {
          let clickObj = document.getElementById('0')
          clickObj.click()
      },
      data: function () {
          return {
              action: 0
          }
      },
      methods: {
          change: function (id) {
              this.action = id
          }
      }
  }
</script>
