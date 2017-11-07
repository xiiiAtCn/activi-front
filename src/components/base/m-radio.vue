<template>
    <span>
        <Radio-group :size="size" :vertical="vertical" v-model="storeValue">
            <Radio v-for="item in items" :label="item.label || item.text" :disabled="item.diabled || readonly" :key="item">{{item.text}}</Radio>
        </Radio-group>
        <div v-if="hasError" class="item-error">{{errorMessage}}</div>
    </span>
</template>
<script>
  import bus from '../../router/bus'
  import _ from 'lodash'

  export default {
      name: 'm-radio',
      props: ['define', 'content'],
      data () {
          return {
              hasError: false,
              errorMessage: ''
          }
      },
      computed: {
          items () {
              return _.get(this.define, 'rows',
                  [
                      {
                          value: true,
                          text: '是'
                      },
                      {
                          value: false,
                          text: '否'
                      }
                  ]
        )
          },
          size () {
              return _.get(this.define, 'size', 'large')
          },
          vertical () {
              return _.get(this.define, 'vertical', false)
          },
          readonly () {
              let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly')
              let regex = /^readonly$/i
              return regex.test(readonly) || readonly === true
          },
          uid () {
              return _.get(this.define, 'ui_id', 'm-radio?' + Date.now)
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
          }
      },
      mounted () {
          bus.$on('forceValid', () => {
              this.valid()
          })
      },
      methods: {
          valid () {
              if (this.readonly !== true) {
                  this.hasError = false
                  if (this.required === true && this.storeValue === '') {
                      this.hasError = true
                      this.errorMessage = '请选择必填项'
                  }
                  this.$store.dispatch('reportValid', {'id': this.uid, 'result': !this.hasError})
              }
          }
      }
  }
</script>
