<template>
  <div>
    <Select v-model="storeValue" :multiple="multiple" :disabled="readonly" :clearable="clearable" :filterable="filterable" :remote="remote"
            :loading="loading" :loadingText="loadingText" :label="label" :size="size" :placeholder="placeholder"
            :notFoundText="notFoundText" :returnWithLabel="returnWithLabel" :placement="placement">
      <Option v-for="option in optionData" :key="option" :disabled="option.disabled || false" :value="option.value?option.value:''">
        {{option.text}}
      </Option>
    </Select>
    <div v-if="hasError" class="item-error">{{errorMessage}}</div>
  </div>
</template>
<script>
  import _ from 'lodash'

  export default {
    name: 'v-select',
    props: ['define', 'content'],
    data () {
      return {
        hasError: false,
        errorMessage: '',
        loading: false,
        optionData: []
      }
    },
    watch: {
      data_url (newVal) {
        this.$http.get(newVal).then(res => JSON.parse(res.bodyText)).then(
          obj => {
            this.optionData = obj.optionData
          })
      }
    },
    computed: {
      data_url () {
        return _.get(this.define, 'data_url', '')
      },
      multiple () {
        return _.get(this.define, 'multiple', false)
      },
      clearable () {
        return _.get(this.define, 'clearable', false)
      },
      filterable () {
        return _.get(this.define, 'filterable', false)
      },
      remote () {
        return _.get(this.define, 'remote', false)
      },
      loadingText () {
        return _.get(this.define, 'loadingText', '加载中')
      },
      label () {
        return _.get(this.define, 'label', [])
      },
      size () {
        return _.get(this.define, 'size', 'large')
      },
      placeholder () {
        return _.get(this.define, 'placehoader', '请选择')
      },
      notFoundText () {
        return _.get(this.define, 'notFoundText', '无匹配数据')
      },
      returnWithLabel () {
        return _.get(this.define, 'returnWithLabel', false)
      },
      placement () {
        return _.get(this.define, 'placement', 'bottom')
      },
      name () {
        return _.get(this.define, 'name', '')
      },
      uid () {
        return _.get(this.define, 'ui_id', 'm-select?' + Date.now())
      },
      'exContent': function () {
        return _.get(this.define, 'exContent', {})
      },
      storeValue: {
        get () {
          return _.get(this.$store.state.pageData.data, [this.name, 'value'], '')
        },
        set (value) {
//                    this.$store.commit('updateItem', {name: this.name, value: value, type:'field'})
          this.$store.commit('updateItem', {name: this.name, exContent: this.exContent, value: value})
        }
      },
      readonly () {
        let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly').trim()
        let regex = /^readonly$/i
        return regex.test(readonly) || readonly === true
      }
    },
    mounted () {
      if (this.data_url === '') {
        this.optionData = _.get(this.define, 'rows', [])
      } else {
        this.$http.get(this.data_url).then(res => JSON.parse(res.bodyText)).then(obj => {
          this.optionData = obj.optionData
        })
      }
//            bus.$on('forceValid', () => {
//                this.valid()
//            })
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
      }
    }
  }
</script>
