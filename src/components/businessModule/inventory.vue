<template lang="html">
  <div class="inventory-container" style="padding-right: 20px;margin-top:20px;">
    <div class="">
      <FilterRow :filterRows="filterRows" :items="items"></FilterRow>
    </div>
    <div id="people" style="margin-top: 20px;">
      <Table :data="tableData" :columns="columns"></Table>
    </div>
  </div>
</template>
<script>
import FilterRow from '../m-filterRow.vue'
//import Vue from 'vue'
//import VueResource from 'vue-resource'
//Vue.use(VueResource);
import axios from 'axios'
Vue.config.productionTip = false;

export default {
	data: function() {
		return {
      filterRows: [
        {id: 'type', title: '类型'},
        {id: 'invMeta', title: '分类'}
      ],
      items: {
        'type': [
          // {'text': '期初', 'value': 0},
          // {'text': '收入', 'value': 1},
          // {'text': '支出', 'value': 2}
        ],
        'invMeta':[]
      },

      tableData: [],
      columns:  [
        {title:"仓库名称",key:"stockId"},
        {title:"物料编码",key:"code"},
        {title:"物料名称",key:"invId"},
        {title:"规格型号",key:"spec"},
        {title:"数量",key:"invCount"}],
      // options: {
      //   sortable:[],
      //   texts:{
      //   count:'显示第 {from} 到第 {to} 条记录，总共 {count} 条记录',
      //   filter:'Filter Results:',
      //   filterPlaceholder:'Search query',
      //   limit:'每页显示条数:',
      //   noResults:'没有找到匹配的记录',
      //   page:'Page:', // for dropdown pagination
      //   filterBy: 'Filter by {column}', // Placeholder for search fields when filtering by column
      //   loading:'Loading...', // First request to server
      //   defaultOption:'Select {column}' // default option for list filters
      //   }
      // }
		}
	},
  created:function(){
    //this.$http.get("",{param1:xxx;param2:xxx})......
    axios.get("/api/inventory/inventoryInfoList").then(data => {
  		this.tableData = data.body;
      console.log(JSON.stringify(data.body));
    },data =>{
      console.log('error');
    });
    // Vue.http.get("/api/inventory/inventoryMetaList").then(data => {
  	// 	//const datas = JSON.parse(data.body)
  	// 	this.items['invMeta'] = data.body;
    //   console.log(JSON.stringify(this.items));
    // },data =>{
    //   console.log('error');
    // })
  },
	components: {
    FilterRow
	}
}
</script>

<style lang="css">
.inventory-container{
  width: 90%;
  margin: 0 auto;
}
.VueTables .row{display: none;}
</style>
