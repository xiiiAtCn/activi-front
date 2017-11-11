<template>
  <div>
    <div class="page-header">
      <h2>{{data.alias}}</h2>
    </div>
    <div class="searchbox list-filter" style="height:auto">
      <div v-for="row in data.filterRows" class="filter-row">
        <div class="row-title blue">
          {{row.name}}<i></i>
        </div>
        <div v-if="!row.entry" class="row-items" style="height:auto;">
          <div class="filter-item">
            <span v-bind:class="{blue:true,selected: row.isSelected}" v-on:click="allSelected(row.id,row)">全选</span>
            <span v-for="(item, $index) in data.conditions[row.id]" v-on:click="addSelected(item, row.id)" v-bind:class="{blue:true,selected: item.isSelected}">{{item.name}}</span>
          </div>
        </div>
        <div v-if="row.entry" class="row-items">
          <div v-if="!row.range" class="filter-input-item left" style="width:320px;">
					<span>
						<input class="form-control" type="text" style="width:213px;" :id="row.id">
					</span>
            <span class="btn btn-xs btn-default blue" v-on:click="entryClick(row.id)">确定</span>
          </div>
          <div v-if="row.range" class="filter-input-item left" style="width:320px;">
            <span>范围：</span>
            <span>
						<input class="form-control" type="text" style="width:100px;" :id="row.id+'Start'">
					</span>
            <span>-</span>
            <span>
						<input class="form-control" type="text" style="width:100px;" :id="row.id+'End'">
					</span>
            <span class="btn btn-xs btn-default blue" v-on:click="rangeEntryClick(row.id)">确定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable space-unary-ops */

  import Vue from 'vue'

  export default {
      props: ['data'],
      data: function () {
          return {}
      },
      mounted: function () {
          let conditions = this.data.conditions
          let filterrow = this.data.filterRows
          for (let i = 0; i < filterrow.length; i++) {
              let name = filterrow[i].id
              if (typeof(conditions[name]) !== 'undefined') {
                  conditions[name].push({'id': 'null', 'name': filterrow[i].unclassifiedText})
              }
              Vue.set(filterrow[i], 'isSelected', true)
          }
      },
      methods: {
          addSelected: function (item, name) {
              Vue.set(item, 'isSelected', true)
              let filterRow = this.data.filterRows
              let id = item.id
              let selectedData = this.data.selecteds[name]
              if (selectedData.length === 0) {
                  selectedData.push({id: id})
              } else {
                  for (let i = 0; i < selectedData.length; i++) {
                      if (selectedData[i].id === id) {
                          if (i === 0) {
                              selectedData.splice(i, i + 1)
                              Vue.set(item, 'isSelected', false)
                              if (selectedData.length === 0) {
                                  for (let k = 0; k < filterRow.length; k++) {
                                      if (filterRow[k].id === name) {
                                          Vue.set(filterRow[k], 'isSelected', true)
                                      }
                                  }
                              }
                              return
                          }
                          Vue.set(item, 'isSelected', false)
                          selectedData.splice(i, i)
                          if (selectedData.length === 0) {
                              for (let l = 0; l < filterRow.length; l++) {
                                  if (filterRow[l].id === name) {
                                      Vue.set(filterRow[l], 'isSelected', true)
                                  }
                              }
                          }
                          return
                      }
                  }
                  selectedData.push({id: id})
              }
              console.log(this.data.selecteds)
          },
          allSelected: function (id, row) {
              var condition = this.data.conditions[id]
              var selected = this.data.selecteds[id]
              Vue.set(row, 'isSelected', true)
              selected.splice(0, selected.length)
              for (var i = 0; i < condition.length; i++) {
                  Vue.set(condition[i], 'isSelected', false)
              }
              console.log(this.data.selecteds)
          },
          entryClick: function (id) {
              var entryVal = document.getElementById(id).value
              var selectedData = this.data.selecteds[id]
              selectedData.splice(0, 1)
              selectedData.push({id: entryVal})
              console.log(this.data.selecteds)
          },
          rangeEntryClick: function (id) {
              var startVal = document.getElementById(id + 'Start').value
              var endVal = document.getElementById(id + 'End').value
              var selectedData = this.data.selecteds[id]
              selectedData.splice(0, 2)
              selectedData.push({start: startVal}, {end: endVal})
              console.log(this.data.selecteds)
          }
      }
  }
</script>
