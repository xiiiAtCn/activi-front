<template lang="html">
  <div class="list-filter" style="height: auto;">
    <div class="filter-row" v-for="row in filterRows">
      <div class="row-title blue">
        {{row.title}}
        <i></i>
      </div>
      <div class="row-items" style="height: auto;">
        <div class="control-type">
          <i v-if="!row.multiple && items[row.id].length > 0" class="fa fa-dot-circle-o"></i>
          <i v-if="row.multiple && items[row.id].length > 0" class="fa fa-plus-square-o"></i>
        </div>
        <div class="filter-item">
          <span class="blue selected">全部</span>
          <!--
          <span v-if="!row.notShowAll && items[row.id].length > 0" class="blue selected">全部</span>
          -->
          <span class="blue" v-for="item in items[row.id]" v-on:click="select(row.id, item)">{{item.text}}</span>
          <span v-if="row.unclassified" class="blue" >{{row.unclassifiedText?row.unclassifiedText:'未分类'}}</span>
        </div>
        <div class="filter-input-item right">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/css/font-awesome.min.css'
import '../assets/css/m-filterRow.css'

export default {
  props: [
    'filterRows',
    'items'
  ],
  data: function () {
    return {
    }
  },
  mounted: function () {

  },
  methods: {
    select: function (rowId, item) {
      this.data.selected[rowId] = [item.value]
      console.log(this.data.selected)
    }
  }
}
</script>

<style lang="css">
</style>
