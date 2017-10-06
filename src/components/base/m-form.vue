<template>
  <form>
    <label v-for="item in formDefine" v-if="item.visible">
      <!--<Input type="text" placeholder="请输入..." v-model="modelData[define.field]"/>-->
      {{item.alias}}:
      <div v-if="item.type === 'bo'">
        <Select v-model="modelData[item.field].value" :label-in-value=true>
          <Option v-for="option in item.list" :value="option.value" :key="option.value">{{ option.text }}</Option>
        </Select>
      </div>
      <div v-else-if="item.type === 'tracker'">
        <Select v-model="modelData[item.field].value">
          <Option v-for="option in item.list" :value="option.value" :key="option.value">{{ option.text }}</Option>
        </Select>
      </div>
      <div v-else-if="item.type === 'string'">
        <Input type="text" placeholder="请输入..." v-model="modelData[item.field]"/>
      </div>
      <div v-else-if="item.type === 'number'">
        <Input type="text" placeholder="请输入数字" v-model="modelData[item.field]"/>
        <!--<Input-number v-model="modelData[item.field].value"></Input-number>-->
      </div>
      <div v-else-if="item.type === 'attribute'">
        <Input type="text" placeholder="" v-model="modelData[item.field]" disabled/>
      </div>
      <div v-else-if="item.type === 'date'">
        <Date-picker type="date" confirm placeholder="选择日期" v-model="modelData[item.field]" style="width: 200px"></Date-picker>
        <!--<Date-picker type="date" placeholder="选择日期" v-model="modelData[item.field]"></Date-picker>-->
      </div>
    </label>
  </form>
</template>
<script>
  import _ from 'lodash'
  import { default as fetch } from '../../utils/DefineFetcher'
  import MNumber from './m-number'

  export default {
    //  props为下列四项：表单定义，表单内容、modal打开状态和是否确认
    components: {MNumber},
    props: ['define', 'content', 'openState', 'confirm'],
    data () {
      return {
        modelData: {},

        formDefine: []
      }
    },
    computed: {
//            modelData: _.cloneDeep(this.content)
//            modelData: this.content
    },
    watch: {
      define: function (newValue) {
        console.log('newValue', newValue)
//                newValue每个对象设置下标
        newValue.forEach(function (item, index) {
          item['index'] = index
        })
//                设置下标 end
        this.formDefine = []
        let self = this
        for (let col of newValue) {
          let temp = {}
          let colDef = {}
          if (col.type === 'bo') {
            colDef.alias = col.alias
            colDef.field = col.field
            colDef.visible = col.visible
            colDef.type = col.type
            colDef.index = col.index
            colDef.list = []

            let idKey = 'boId'
            let textKey = 'name'
            temp[col.field] = {value: ''}
            fetch(col.colums_url, function (error, body) {
//                            console.log(colDef.alias, error);
              if (!error || error === null) {
//                                idKey = body["idKey"];
//                                textKey = body["textKey"];
                fetch(col.data_url, function (error, body) {
                  if (!error || error === null) {
                    for (let row of body) {
                      colDef.list.push({'value': row[idKey], 'text': row[textKey]})
                    }
                    self.formDefine.unshift(colDef)
                  }
                })
              }
            })
          } else if (col.type === 'date') {
            colDef.alias = col.alias
            colDef.field = col.field
            colDef.visible = col.visible
            colDef.type = col.type
            colDef.index = col.index

            self.formDefine.unshift(colDef)

            temp[col.field] = ''
          } else if (col.type === 'tracker') {
            colDef.alias = col.alias
            colDef.field = col.field
            colDef.visible = col.visible
            colDef.type = col.type
            colDef.index = col.index
            colDef.list = []
            temp[col.field] = {value: ''}

            fetch(col.data_url, function (error, body) {
              if (!error || error === null) {
                for (let row of body.optionData) {
                  colDef.list.push({'value': row['value'], 'text': row['text']})
                }
                self.formDefine.unshift(colDef)
              }
            })
          } else if (col.type === 'number') {
            colDef.alias = col.alias
            colDef.field = col.field
            colDef.visible = col.visible
            colDef.type = col.type
            colDef.index = col.index

            self.formDefine.push(colDef)
            temp[col.field] = ''
          } else if (col.type === 'string') {
            colDef.alias = col.alias
            colDef.field = col.field
            colDef.visible = col.visible
            colDef.type = col.type
            colDef.index = col.index

            self.formDefine.unshift(colDef)
            temp[col.field] = ''
          } else if (col.type === 'attribute') {
            colDef.alias = col.alias
            colDef.field = col.field
            colDef.visible = col.visible
            colDef.type = col.type
            colDef.index = col.index

            self.formDefine.unshift(colDef)
            temp[col.field] = ''
          }
          self.modelData = Object.assign({}, self.modelData, temp)
        }
      },
      openState: function (newVal) {
        if (newVal === false && this.confirm) {
          let self = this
          if (this.modelData) {
            _.forEach(this.formDefine, function (value, key) {
              console.log('this', value)
              if (value.type === 'bo' || value.type === 'tracker') {
                let selectedValue = _.get(self.modelData, [value.field, 'value'], null)
                if (selectedValue !== null && value.list) {
                  _.set(self.modelData, [value.field, 'text'], _.find(value.list, {'value': selectedValue}).text)
                }
              }
            })
            let data = _.assign(this.data, this.content, this.modelData)
            this.$emit('updateData', _.cloneDeep(data))
          }
        } else {
          let self = this
          _.forEach(this.modelData, function (value, key) {
            let contentV = _.get(self.content, key, '')
            if (_.isObject(value)) {
              value['value'] = contentV.value
            } else {
              self.modelData[key] = contentV
            }
          })
          self.modelData.id = this.content.id
        }
      }
    }
  }
</script>
