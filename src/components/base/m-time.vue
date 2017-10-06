<template>
  <span>
      <TimePicker v-model="storeValue" :format="format" :placeholder="placeholder" :confirm="confirm" :clearable="clearable"
                  :readonly="readonly">
      </TimePicker>
      <div v-if="hasError" class="item-error">{{errorMessage}}</div>
  </span>
</template>
<script>
  import bus from '../../router/bus'
  import _ from 'lodash'

  export default {
    name: 'm-time',
    props: ['define', 'content'],
    data () {
      return {
        hasError: false,
        errorMessage: ''
      }
    },
    computed: {
      format () {
        return _.get(this.define, 'format', 'HH:mm:ss')
      },
      placeholder () {
        return _.get(this.define, 'placeholder', '选择时间')
      },
      confirm () {
        return _.get(this.define, 'confirm', false)
      },
      clearable () {
        return _.get(this.define, 'clearable', true)
      },
      readobly () {
        let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly')
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
          return _.get(this.$store.state.pageData.data, this.name, '')
        },
        set (value) {
//                this.$store.commit('updateItem', {name: this.name, value: value})
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
            this.errorMessage = '请输入必填项'
          }
          this.$store.dispatch('reportValid', {'id': this.uid, 'result': !this.hasError})
        }
      }
    }
  }
</script>
