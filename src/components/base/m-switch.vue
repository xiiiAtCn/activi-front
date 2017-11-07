<template>
    <span>
        <Switch v-model="storeValue" :size="size" :disabled="readonly"></Switch>
    </span>
</template>
<script>
  import _ from 'lodash'

  export default {
      name: 'm-switch',
      props: ['define', 'content'],
      computed: {
          'exContent': function () {
              return _.get(this.define, 'exContent', {})
          },
          storeValue: {
              get () {
                  return _.get(this.$store.state.pageData.data, this.name, false)
              },
              set (value) {
//                this.$store.commit('updateItem', {name: this.name, value: value})
                  this.$store.commit('updateItem', {name: this.name, exContent: this.exContent, value: value})
              }
          },
          name () {
              return _.get(this.define, 'name', 'm-switch?' + Date.now())
          },
          size () {
              return _.get(this.define, 'size', 'large')
          },
          readonly () {
              let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly')
              let regex = /^readonly$/i
              return regex.test(readonly) || readonly === true
          }
      }
  }
</script>
