<template>
  <div class="row">
      <iframe id="aIframe" :src="iframeUrl" frameborder="0" scrolling="no"></iframe>
  </div>
</template>
<script>
  export default {

      mounted() {
          this.iframeUrl=`/static/ngr/js/demo/example/ngr.html?Id=${this.mapId}`
      },
      data() {
          return {
              iframeUrl:'',
              mapId:1412538
          }
      },
      methods: {

      }
  }
</script>
<style>
    #aIframe{
        width: 100%;
        height: 700px;
    }
</style>
