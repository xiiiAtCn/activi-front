<template>
    <div>
        <!--{{dataSource}}-->
        <h3 class="title">{{define.alias}}</h3>
        <Row>
            <div v-for="item in define.operation" class="config">
                <div class="operation">
                    <Button type="primary" v-if="item.url" shape="circle" @click="getMeta(item.url)">{{item.name}}</Button>
                    <Button type="primary" v-else shape="circle" @click="showModal(item.name)">{{item.name}}</Button>
                </div>
                <div class="search">
                    <Input v-model="valueSearch" placeholder="筛选">
                        <Button slot="append" icon="ios-search"></Button>
                    </Input>
                </div>
            </div>
        </Row>
        <br>
            <div v-if="storeStatus=='editable'" class="operation">
            <Button type="primary" shape="circle" @click="openModal">添加明细</Button>
        </div>
        <div style="padding: 0 20px;">
        <!--{{dataSource}}-->
            <Table :columns="columns" highlight-row :data="dataSource" border></Table>
        </div>
        <div>
            <Modal :loading="loading" v-model="modalState" @on-cancel="abort2Table" @on-ok="submit2Table">
                <mForm :confirm="confirm"
                    :define="formDefine"
                    :isNew="modalData.id === dataSource.length"
                    :content="modalData"
                    :openState="modalState"
                    @updateData="updateData">
                </mForm>
            </Modal>
        </div>
    </div>
</template>
    <script>
  import _ from 'lodash'
  import bus from '../router/bus'
  import { dispatch } from '../utils/actionUtils'
  import { default as fetch } from '../utils/DefineFetcher'
  export default {
      props: ['define', 'content'],
      data () {
          return {
              confirm: false,
              modalState: false,
              tableDelData: [],
              index: 0,
              columns: [{}],
              dataSource: [],
              formDefine: [],
              modalData: {id: 0},
              loading: true,
              valueSearch: ''
          }
      },
      mounted () {
          bus.$on('confirmData', (data) => {
              let total = []
              total.concat(this.dataSource)
              total.concat(this.tableDelData)
              data.table = total
          })
          let url = this.define.data_url
          if (url) {
              fetch(url, (error, body) => {
                  if (!error || error === null) {
                      this.$set(this.define, 'rows', body)
                  }
              })
          } else {
              this.$set(this.define, 'rows', [])
          }
      },
      computed: {
      /* table row 数据 */
          tableVuex: {
              get () {
                  return _.get(this.$store.state.pageData.data, [this.tableName, 'value'], null)
              },
              set () {
//                this.$store.commit('updateItem', {name: '_' + this.tableName, type:'table', value: this.dataSource});
                  this.$store.commit('updateItem', {name: this.tableName, exType: this.exType, exContent: this.exContent, value: this.dataSource})
              }
          },
      /* table是否为可编辑状态 */
          storeStatus () {
              return this.$store.state.pageStatus.status[this.tableName]
          },
          tableName () {
              return _.get(this.define, 'name', 'table')
          },
          'exContent': function () {
              return _.get(this.define, 'exContent', {})
          }
      },
      watch: {
          define (newVal) {
              this.dataSource = newVal.rows instanceof Array ? _.cloneDeep(newVal.rows) : []
              this.formDefine = _.get(newVal, 'cols', [])
              this.columns = this.getColumns()
              this.modalData.id = this.dataSource.length
          },
          storeStatus () {
              this.columns = this.getColumns()
          },
      /* 当data_url发生变化时更新table数据 */
          'define.data_url' (to, from) {
              fetch(this.define.data_url, (error, body) => {
                  if (!error || error === null) {
                      this.$set(this.define, 'rows', body)
                  }
              })
          },
      /* 当vuex中数据改变时更新table数据 */
          tableVuex (newVal) {
              this.dataSource = newVal
          }
      },
      methods: {
          submit2Table () {
              this.confirm = true
              this.modalState = false
          },
          abort2Table () {
              this.confirm = false
          },
          openModal () {
              this.modalState = true
              this.modalData = {id: this.dataSource.length}
          },
          updateData (val) {
              let data = {}
        // 更新数据
              console.log('val.id', val.id)

              if (this.dataSource.some(data => data.id === val.id)) {
                  let flag = 0
                  for (let i in this.dataSource) {
                      let temp = this.dataSource[i]
                      if (temp.id === val.id) {
                          flag = i
                          data = _.cloneDeep(temp)
                          break
                      }
                  }
                  data = _.assign(data, val)
                  data._confirm = true
                  data._operation = 'update'
                  let dataSource = _.cloneDeep(this.dataSource)
                  dataSource.splice(flag, 1, data)
                  this.dataSource = dataSource
          // 添加数据
              } else {
                  data._confirm = true
                  data._operation = 'create'
                  data = _.assign(data, val)
                  let newRows = _.cloneDeep(this.define.rows)
                  newRows.push(data)
                  this.dataSource.push(data)
                  let id = this.modalData.id
                  this.modalData = {}
                  this.modalData.id = ++id
              }
              this.tableVuex = {}
          },
      // TODO
          getColumns () {
              let cols = this.define.cols
              let columns = []
              for (let i = 0, len = cols.length; i < len; i++) {
                  let col = cols[i]

                  let obj = {}
                  if ((!col.visible) || col.visible === null || col.visible === true) {
                      obj['key'] = col['field']
                      obj['title'] = col['alias']
                      if ((col.type === null || col.type === 'string') && (col.link === null || col.link === false)) {
                          obj['title'] = col['alias']
                      }
                      if ((col.type === null || col.type === 'string') && col.link === true) {
              // obj['fixed'] = 'left'

                      }

                      if (col.type === 'boolean' && (col.link === null || col.link === false)) {
                          obj['title'] = col['alias']
                      } else if (col.type === 'select' && (col.link === null || col.link === false)) {

                      }
                      obj.render = function (h, param) {
                          return h('span', _.get(param, ['row', col['field'], 'text'], param.row[col['field']]))
                      }
                      columns.push(obj)
                  }
              }
              if (typeof (this.define.showModalBtn) !== 'undefined' || this.storeStatus === 'editable') {
                  let operations = []
                  let temp
                  for (let i in this.define.showModalBtn) {
                      let item = this.define.showModalBtn[i]
                      temp = {}
                      temp['type'] = 'primary'
                      temp['component'] = 'Button'
                      temp['text'] = item.text
                      temp['field'] = item.field
                      temp['size'] = 'small'
                      if (item.type === 'model') {
                          temp['click'] = 'showModal'
                      } else {
                          temp['click'] = 'getMeta'
                      }
                      operations.push(temp)
                  }
                  if (this.storeStatus === 'editable') {
                      operations.push({component: 'Button', type: 'info', size: 'small', text: '查看', click: 'viewData'})
                      operations.push({component: 'Button', type: 'warning', size: 'small', text: '编辑', click: 'editData'})
                      operations.push({component: 'Button', type: 'error', size: 'small', text: '删除', click: 'delRow'})
                  }

                  columns.push({
                      title: '操作',
                      key: 'operation',
                      render: (h, params) => {
                          let operationList = []
                          for (let i = 0; i < operations.length; i++) {
                              let operation = operations[i]
                              operationList.push(h(operation['component'], {
                                  props: {
                                      type: operation['type'],
                                      size: operation['size']
                                  },
                                  style: {
                                      marginRight: '5px'
                                  },
                                  on: {
                                      click: () => {
                                          let method = operation['click']
                                          switch (method) {
                                          case 'showModal':
                                              break
                                          case 'getMeta':
                                              this.getMeta(params.row._actions[operation['field']])
                                              break
                                          case 'editData':
                                          case 'viewData':
                                          case 'delRow':
                                              this[operation['click']](params.index)
                                              break
                                          }
                                      }
                                  }
                              }, operation['text']))
                          }
                          if (operationList.length > 0) {
                              return h('div', operationList)
                          } else {
                              return h()
                          }
                      }
                  })
              }
              return columns
          },
          delRow (index) {
              let delData = this.dataSource.splice(index, 1)
              delData._confirm = true
              delData._operation = 'delete'
              this.tableDelData.push(delData)
          },
          viewData (index) {
//                console.log(';',index);
              this.editData(index)
          },
          editData (index) {
              let data = this.dataSource[index]
              this.openModal()
              this.modalData = data
          },
          getMeta (action) {
              dispatch(action)
          }
      }

  }
</script>
<style scoped>
  .title {
    margin: 0 20px 5px;
  }

  .operation {
    margin: 0 20px 5px;
  }

  .config {
    display: flex;
    justify-content: flex-start;
    position: relative;
  }

  .search {
    margin-left: 20px;
    min-width: 300px;
    position: absolute;
    right: 0;
  }
</style>
