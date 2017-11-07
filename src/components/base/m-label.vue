<template>
  <div v-bind:class="data.controlWidth">
    <label class="control-label clear_wt">{{data.controlName}}</label>
  </div>
</template>
<script>
  export default {
      props: ['data'],
      data: function () {
          return {}
      }
  }
</script>
