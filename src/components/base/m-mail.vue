<template>
  <m-input :placeholder="placeholder" :maxLength="128" :required="required"
           :pattern="pattern" errorMessagePattern="请输入正确的e-mail地址。"></m-input>
</template>

<script>
  import mInput from './m-input.vue'

  export default {
      name: 'm-mail',
      data () {
          return {
              placeholder: '电子邮件地址',
              pattern: '^[^@]+@[^@]+\\.[^@.]+$'
          }
      },
      props: {
          'value': {
              'default': ''
          },
          'required': {
              type: true,
              'default': false
          }
      },
      components: {
          mInput
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

