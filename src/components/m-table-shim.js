import Vue from 'vue'
import _ from 'lodash'
import mTable from './m-table2.vue'
import { default as fetch } from '../utils/DefineFetcher'

let tableShim = Vue.component('table-shim', {
  render: function (h) {
    return h(mTable, {
      props: {'alias': this.alias, 'operations': this.operations, 'columnsDef': this.columns, 'rowData': this.rows}
    })
  },
  data () {
    return {
      userUrl: false,
      alias: '',
      url: '',
      operations: null,
      columns: [{}],
      rows: []
    }
  },
  props: {
    uid: {
      type: String,
      default: 'tb'
    },
    define: {
      type: Object,
      default: {}
    },
    content: {
      type: Object
    }
  },
  mounted: function () {
    this.persuas()
  },
  methods: {
    getDataFromUrl: function (url) {
      let self = this
      fetch(url, function (error, body) {
        if (!error || error === null) {
          Vue.nextTick(function () {
            self.rows = body
            self.userUrl = true
          })
        }
      })
    },
    persuas () {
      // 表格名称
      this.alias = _.get(this.define, 'ui_alias', '')
      // 表格处理按钮
      this.operations = _.get(this.define, 'operation', null)
      // 列（原始）
      let cols = _.get(this.define, 'cols', null)
      // 列转型
      this.columns = []
      for (let col of cols) {
        this.columns.push({
          title: col.alias,
          key: col.field
        })
      }
      this.url = _.get(this.define, 'data_url', null)
      if (this.url !== null) {
        this.getDataFromUrl(this.url)
      }
    }
  }
})

export default tableShim
