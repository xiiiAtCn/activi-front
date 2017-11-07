<template>
  <span>
      <Input v-model="displayValue" readonly>
        <Button slot="append" @click="modal = (!readonly)">选择</Button>
    </Input>
    <Modal v-model="modal" title="" width="900" @on-ok="ok">
          <Table border :columns="colums" :data="data" v-if="chooseStatus === 'radio'"></Table>
          <Table border :columns="colums" :data="data" @on-select="selectRow" @on-select-all="selectAll" v-if="chooseStatus === 'checkbox'"></Table>
          <div slot="footer" v-if="chooseStatus === 'radio'"></div>
      </Modal>
      <div v-if="hasError" class="item-error">{{errorMessage}}</div>
  </span>
</template>
<script>
  //  import bus from '../../router/bus'
  import _ from 'lodash'
  import { default as fetch } from '../../utils/DefineFetcher'

  export default {
      name: 'm-bo',
      props: ['define', 'content'],
      data () {
          return {
              hasError: false,
              errorMessage: '',
        //
              chooseStatus: 'radio',
              container: '',
              value: '',
              formRight: {
                  input1: ''
              },
              modal: false,
              data: [{}],
              colums: [{}],
              columsDefine: {}
//                displayValue: ''
          }
      },
      mounted () {
//            bus.$on('forceValid', () => {
//                this.valid();
//            });
          let url = this.define.colums_url
          if (url) {
              fetch(url, (error, body) => {
                  if (error === null) {
                      this.columsDefine = body
                      this.colums = body.fieldInfo
                      this.colums.push({
                          title: '操作',
                          key: 'action',
                          width: 150,
                          align: 'center',
                          render: (h, params) => {
                              return h('div', [
                                  h('Button', {
                                      props: {
                                          type: 'success'
                                      },
                                      on: {
                                          click: () => {
                                              this.choose(params.row)
                                          }
                                      }
                                  }, '选择')
                              ])
                          }
                      })
                  }
              })
          } else {
              this.colums = [{}]
          }
          let dataUrl = this.define.data_url
          if (dataUrl) {
              fetch(dataUrl, (error, body) => {
                  if (error === null) {
                      this.data = body
                  }
              })
          } else {
              this.data = [{}]
          }
      },
      computed: {
          confirm () {
              return _.get(this.define, 'confirm', false)
          },
          clearable () {
              return _.get(this.define, 'clearable', true)
          },
          readonly () {
              let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly').trim()
              let regex = /^readonly$/i
              return regex.test(readonly) || readonly === true
          },
          name () {
              return _.get(this.define, 'name', '')
          },
          'exContent': function () {
              return _.get(this.define, 'exContent', {})
          },
          storeValue: {
              get () {
                  return _.get(this.$store.state.pageData.data, [this.name, 'value'], '')
              },
              set (value) {
                  this.$store.commit('updateItem', {name: this.name, exContent: this.exContent, value: value})
              }
          },
          textKey () {
              return _.get(this.columsDefine, 'textKey', '')
          },
          idKey () {
              return _.get(this.columsDefine, 'idKey', '')
          },
          displayValue () {
              for (let row of this.data) {
                  if (row[this.idKey] === this.storeValue) {
                      return row[this.textKey]
                  }
              }
          }
      },
      methods: {
          valid () {
              if (!this.readonly) {
                  if (this.storeValue === '') {
                      this.errorMessage = '请选择一项'
                      this.hasError = true
                  }
                  this.$store.dispatch('reportValid', {'id': this.uid, 'result': !this.hasError})
              }
          },
          choose (row) {
              let textKey = this.columsDefine.textKey
              let idKey = this.columsDefine.idKey
              this.storeValue = row[idKey]
              this.displayValue = row[textKey]
              this.modal = false
          },
          selectRow (backRow) {
              let name = []
              backRow.forEach(function (item, index) {
                  name.push(item.name)
              })
              let stringAfter = name.join(',')
              this.container = stringAfter
          },
          selectAll (backAll) {
              let name = []
              backAll.forEach(function (item, index) {
                  name.push(item.name)
              })
              let stringAfter = name.join(',')
              this.container = stringAfter
          },
          ok () {
              this.value1 = this.container
          }
      }
  }
</script>
<style>
  /*.ivu-modal-footer {*/
  /*display: none;*/
  /*}*/
</style>
