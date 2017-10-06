<template>
  <span>
    <Date-picker v-model="value" :format="format" :type="type" :placeholder="placeholder" style="width: 200px" :readonly="readonly" @on-change="handleChange"></Date-picker>
    <div v-if="hasError" class="item-error">{{errorMessage}}</div>
  </span>
</template>

<script>
  import bus from '../../router/bus'
  import * as _ from 'lodash'

  export default {
    name: 'm-input',
    data () {
      return {
        hasError: false,
        errorMessage: ''
      }
    },
    computed: {
      'serverName': function () {
        return this.name
      },
      'required': function () {
        return _.get(this.define, 'required', false)
      },
      'errorMessagePattern': function () {
        return _.get(this.define, 'errorMessagePattern', '请输入正确的日期格式。例：2010-01-01')
      },
      'name': function () {
        return _.get(this.define, 'name', '')
      },
      'uid': function () {
        return _.get(this.define, 'ui_id', '')
      },
      'placeholder': function () {
        return _.get(this.define, 'placeholder', '请选择日期')
      },
      'exContent': function () {
        return _.get(this.define, 'exContent', {})
      },
      value: {
        get () {
          return _.get(this.$store.state.pageData.data, [this.name, 'value'], '')
        },
        set (value) {
//                    this.$store.commit('updateItem', {name: this.name, value: value, type:'field'})
          this.$store.commit('updateItem', {name: this.name, exContent: this.exContent, value: value})
        }
      },
      readonly: function () {
        let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly')
        return (readonly === true || readonly === 'readonly' || readonly === 'readOnly')
      }
    },
    mounted: function () {
      let self = this
      bus.$on('forceValid', function () {
        self.valid()
      })
    },
    props: {
      'define': {type: Object},
      type: {'default': 'date'},
      format: {'default': 'yyyy-MM-dd'}
    },
    methods: {
      valid: function () {
        this.hasError = false
        if (this.required && this.value.length === 0) {
          this.errorMessage = '请输入必填项目。'
          this.hasError = true
        }
//                this.$store.dispatch("getData", {'id': this._uid, 'result': !this.hasError});
        this.$store.dispatch('reportValid', {'id': this.uid, 'result': !this.hasError})
      },
      collect: function () {
        return {'name': this.serverName, value: this.value}
      },
      handleChange: function (data) {
        this.value = data
      }
    },
    watch: {
      'value': function (v1, v2) {
        if (v1 !== v2) {
          this.valid()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div.item-error {
    font-size: small;
    color: red;
  }
</style>

