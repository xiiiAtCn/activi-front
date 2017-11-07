<template>
  <span>
    <Input type="text" @on-blur="valid" v-model.trim="value" :placeholder="placeholder" :readonly="readonly"
           :icon="icon"></Input>
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
          'maxLength': function () {
              return _.get(this.define, 'maxLength', -1)
          },
          'pattern': function () {
              return _.get(this.define, 'pattern', null)
          },
          'required': function () {
              return _.get(this.define, 'required', false)
          },
          'errorMessagePattern': function () {
              return _.get(this.define, 'errorMessagePattern', '输入的内容不符合要求，请更正。')
          },
          'name': function () {
              return _.get(this.define, 'name', '')
          },
          'placeholder': function () {
              return _.get(this.define, 'placeholder', '')
          },
          'exContent': function () {
              return _.get(this.define, 'exContent', {})
          },
          value: {
              get () {
                  return _.get(this.$store.state.pageData.data, [this.name, 'value'], '')
              },
              set (value) {
                  this.$store.commit('updateItem', {name: this.name, exContent: this.exContent, value: value})
              }
          },
          readonly: function () {
              let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly')
              return (readonly === true || readonly === 'readonly' || readonly === 'readOnly')
          },
          'icon': function () {
              if (this.hasError) {
                  return 'alert'
              }
              if (this.readonly) {
                  return 'locked'
              }
              return ''
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
          'uid': {type: String, 'default': 'sss'}
      },
      methods: {
          valid: function () {
              if (this.readonly !== true) {
                  this.hasError = false
                  if (this.required && this.value.length === 0) {
                      this.errorMessage = '请输入必填项目。'
                      this.hasError = true
                  } else if (this.maxLength > -1 && this.value.length > this.maxLength) {
                      this.errorMessage = '请输入' + this.maxLength + '位以内的字符。'
                      this.hasError = true
                  } else if (this.minLength > -1 && this.value.length < this.minLength) {
                      this.errorMessage = '请输入' + this.minLength + '位以上的字符。'
                      this.hasError = true
                  } else if (this.pattern !== null && this.value.length > 0 && !this.value.match(this.pattern)) {
                      this.errorMessage = this.errorMessagePattern
                      this.hasError = true
                  }
                  this.$store.dispatch('reportValid', {'id': this.uid, 'result': !this.hasError})
              }
          }
      }
//        watch: {
//            'value': function (v1, v2) {
//                if (v1 !== v2) this.valid();
//            },
//        },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div.item-error {
    font-size: small;
    color: red;
  }
</style>
