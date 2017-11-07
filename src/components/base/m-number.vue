<template>
    <span>
        <Input @on-blur="valid" :placeholder="placeholder" :readonly="readonly" :icon="icon" v-model="storeValue"></Input>
        <div v-if="hasError" class="item-error">{{errorMessage}}</div>
    </span>
</template>
<script>
  import bus from '../../router/bus'
  import _ from 'lodash'

  export default {
      name: 'm-number',
      props: ['define', 'content'],
      data () {
          return {
              inputValue: '',
              hasError: false,
              errorMessage: ''
          }
      },
      computed: {
          placeholder () {
              return _.get(this.define, 'placeholder', '请输入一个数字')
          },
          readonly () {
              let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly').trim()
              let regex = /^readonly$/i
              return regex.test(readonly) || readonly === true
          },
          required () {
              return _.get(this.define, 'required', false)
          },
          icon () {
              if (this.hasError) {
                  return 'alert'
              }
              if (this.readonly) {
                  return 'locked'
              }
              return ''
          },
          minValue () {
              return _.get(this.define, 'minValue', Number.MIN_VALUE)
          },
          maxValue () {
              return _.get(this.define, 'maxValue', Number.MAX_VALUE)
          },
          numberType () {
              return _.get(this.define, 'numberType', 'decimal')
          },
          name () {
              return _.get(this.define, 'name', '')
          },
          uid () {
              return _.get(this.define, 'ui_id', 'm-number?' + Date.now())
          },
          'exContent': function () {
              return _.get(this.define, 'exContent', {})
          },
          storeValue: {
              get () {
                  return _.get(this.$store.state.pageData.data, [this.name, 'value'], '')
              },
              set (value) {
//                    this.$store.commit('updateItem', {name: this.name, type: "field", value: value})
                  this.$store.commit('updateItem', {name: this.name, exContent: this.exContent, value: value})
              }
          }
//            inputValue: {
//                get() {
//                    return this.bridgeValue
//                },
//                set(value) {
//                    if (value.startsWith('-') && value.length === 1) {
//
//                    } else {
//                        if (this.numberType === 'integer') {
//                            value = parseInt(value)
//                            if (isNaN(value)) {
//                                value = ''
//                            }
//                        } else {
//                            let regex = /\./g
//                            let pointCount = value.match(regex)
//                            if (!value.endsWith('.')) {
//                                value = parseFloat(value)
//                                if (isNaN(value)) {
//                                    value = ''
//                                }
//                            } else {
//                                if (pointCount.length > 1) {
//                                    if (value[value.length - 2] === '.') {
//                                        value = parseFloat(value)
//                                        if (isNaN(value)) {
//                                            value = ''
//                                        }
//                                        value += '.'
//                                    } else {
//                                        value = parseFloat(value)
//                                    }
//                                }
//                            }
//                        }
//                    }
//                    this.bridgeValue = value
//                }
//            }
      },
      mounted () {
          bus.$on('forceValid', () => {
              this.valid()
          })
      },
      methods: {
          valid () {
              if (!this.readonly) {
                  this.hasError = false
                  if (this.required === true && this.storeValue === '') {
                      this.hasError = true
                      this.errorMessage = '请输入必填项'
                  } else if (this.numberType === 'integer') {
                      if (!Number.isInteger(Number(this.storeValue))) {
                          this.hasError = true
                          this.errorMessage = '请输入一个整数'
                      }
                  } else if (this.storeValue !== '' && isNaN(Number(this.storeValue))) {
                      this.hasError = true
                      this.errorMessage = '请输入一个数字'
                  }
//                    if (!this.hasError) this.storeValue = this.inputValue;
                  this.$store.dispatch('reportValid', {'id': this.uid, 'result': !this.hasError})
              }
          }
      },
      watch: {
          'storeValue': function (v1, v2) {
              if (v1 !== v2) {
                  this.valid()
              }
          }
      }
  }
</script>
<style scoped>
  div.item-error {
    font-size: small;
    color: red;
  }
</style>

