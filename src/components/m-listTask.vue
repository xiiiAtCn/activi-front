<template>
  <div>
    <Tabs>
      <Tab-pane label="一览信息" icon="android-apps">
        <Row class="titleAll">
          <div class="bread">
            <p v-if="define.title" v-text="define.title" class="topTitle"></p>
            <Breadcrumb>
              <Breadcrumb-item v-for="item in define.subtitle">{{item}}</Breadcrumb-item>
            </Breadcrumb>
          </div>
          <div class="search">
            <Input v-model="valueSearch" placeholder="筛选">
            <Button slot="append" icon="ios-search"></Button>
            </Input>
          </div>
        </Row>
        <Row style="margin-bottom: 3px">
          <div v-for="item in define.operation" class="config">
            <div class="operation">
              <Button type="primary" v-if="item.url" shape="circle" @click="getMeta(item.url)">{{item.name}}</Button>
              <Button type="primary" v-else shape="circle" @click="showModal(item.name)">{{item.name}}</Button>
            </div>
          </div>
        </Row>
        <div v-if="storeStatus=='editable'" class="operation">
          <Button type="primary" shape="circle" @click="openModal">新建</Button>
        </div>
        <div style="padding: 0 0;">
          <!--{{dataSource}}-->
          <Table :columns="columns" :data="dataSource"></Table>
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
      </Tab-pane>
      <Tab-pane label="完成顺序" icon="android-exit">标签二的内容</Tab-pane>
      <Tab-pane label="进度矩阵" icon="ios-analytics">标签三的内容</Tab-pane>
    </Tabs>
  </div>
</template>
<script>
  //  import Vue from 'vue'
  import _ from 'lodash'
  import bus from '../router/bus'
  import { dispatch } from '../utils/actionUtils'
  import { default as fetch } from '../utils/DefineFetcher'
  import mForm from './base/m-form.vue'

  export default {
    props: ['define', 'content'],
    components: {mForm},
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
        valueSearch: '',
        showIndex: true
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
        set (value) {
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
              obj['title'] = col['alias']
              obj['render'] = (h, params) => {
                return h('a', {
                  on: {
                    click: () => {
                      this.getMeta(params.row._actions[col['field']])
                    }
                  }
                }, params.row[col['field']])
              }
              columns.unshift(obj)
              continue
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
            width: 140,
            key: 'operation',
            render: (h, params) => {
              let operationList = []
              for (let i = 0; i < operations.length; i++) {
                let operation = operations[i]
                operationList.push(h(operation['component'], {
                  props: {
//                                        type: operation['type'],
//                                        type: 'text',
                    type: 'ghost',
                    size: operation['size']
                  },
                  style: {
                    marginRight: '5px'
//                                        marginRight: '0px',
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
        // 增加索引
        columns.unshift({
          type: 'index',
          width: 60,
          align: 'center'
        })
//                //增加筛选
//                columns.forEach(function (item) {
//                    if (item.key === 'planenddate'){
//                        item.sortable = true
//                    } else if (item.key === 'planstartdate'){
//                        item.sortable = true
//                    } else if (item.key === 'launchdate'){
//                        item.sortable = true
//                    } else if (item.key === 'actualenddate'){
//                        item.sortable = true
//                    } else if (item.key === 'actualstartdate'){
//                        item.sortable = true
//                    } else if (item.key === 'status'){
//                        item.filters = [
//                            {
//                                label: '运行',
//                                value: 0
//                            },
//                            {
//                                label: '暂停',
//                                value: 1
//                            },
//                            {
//                                label: '取消',
//                                value: 2
//                            },
//                            {
//                                label: '关闭',
//                                value: 3
//                            }
//                        ];
//                        item.filterMultiple = false;
//                        item.filterMethod = function (value, row) {
//                            if (value === 0) {
//                                return row.status === '运行';
//                            } else if (value === 1) {
//                                return row.status === '暂停';
//                            } else if (value === 2) {
//                                return row.status === '取消';
//                            } else if (value === 3) {
//                                return row.status === '关闭';
//                            }
//                        };
//                    }
//                });
        return columns
      },
      delRow (index) {
        let delData = this.dataSource.splice(index, 1)
        delData._confirm = true
        delData._operation = 'delete'
        this.tableDelData.push(delData)
      },
      viewData (index) {
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
    margin: 0 0 5px;
  }

  .config {
    display: flex;
    justify-content: flex-start;
    position: relative;
  }

  .search {
    position: absolute;
    right: 0;
    max-width: 300px;
  }

  thead {
    border: none;
  }

  .topTitle {
    padding-bottom: 2px;
    color: #999;
    font-size: 22px
  }

  .titleAll {
    margin: 8px 0 20px 0;
    display: flex;
    align-items: center;
    position: relative
  }
</style>
