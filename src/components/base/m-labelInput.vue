<template>
  <input type="hidden" v-if="hidden" :id="name" :name="name" v-model="value"/>
  <div v-else class="ivu-form-item m-flex">
    <!--<Col span="5">-->
    <label class="ivu-form-item-label" :style="{width: labelWidth + 'px'}">{{label}}</label>
    <!--</Col>-->
    <!--<Col :span="item.class" v-for="item in define.bodyDefine">-->
    <!--<Col span="8">-->
    <div class="ivu-form-item-content m-input">
      <!--<Input v-model="storeValue" :disabled="readonly" :id="name" :name="name"></Input>-->
      <component :is="itemType" :define="inputDefine" :uid="uid"></component>
    </div>
    <!--</Col>-->
  </div>
</template>
<script>
  //    import bus from '../../router/bus'
  import store from '../../vuex/store'
  import _ from 'lodash'

  export default {
      store,
      props: ['define', 'content', 'uid'],
      components: {
          mInput: function (resolve) {
              require(['./m-input.vue'], resolve)
          },
          mDate: function (resolve) {
              require(['./m-date.vue'], resolve)
          },
          mTime: function (resolve) {
              require(['./m-time.vue'], resolve)
          },
          mBoolean: function (resolve) {
              require(['./m-radio.vue'], resolve)
          },
          mBo: function (resolve) {
              require(['./m-bo.vue'], resolve)
          },
          mTracker: function (resolve) {
              require(['./m-select.vue'], resolve)
          },
          mAttribute: function (resolve) {
              require(['./m-attribute.vue'], resolve)
          },
//            mInteger: function (resolve) {
//                require(['./m-number.vue'], resolve);
//            },
          mNumber: function (resolve) {
              require(['./m-number.vue'], resolve)
          },
          mDecimal: function (resolve) {
              require(['./m-number.vue'], resolve)
          }
      },
      data: function () {
          return {
              name: _.get(this.define, 'name', ''),
              label: _.get(this.define, 'label', false),
              hidden: _.get(this.define, 'hidden', false),
              typeString: _.get(this.define, 'typeString', 'string'),
              labelWidth: _.get(this.define, 'labelWidth', 0)
          }
      },
      computed: {
          inputDefine: function () {
              let filtedDefine = {}
              _.forIn(this.define, function (value, key) {
                  if (key !== 'label') {
                      filtedDefine[key] = value
                  }
              })
              return filtedDefine
          },
          itemType: function () {
              if (this.typeString === 'string') return 'mInput'
              if (this.typeString === 'date') return 'mDate'
              if (this.typeString === 'time') return 'mTime'
              if (this.typeString === 'boolean') return 'mBoolean'
              if (this.typeString === 'number') return 'mNumber'
              if (this.typeString === 'tracker') return 'mTracker'
              if (this.typeString === 'attribute') return 'mAttribute'
              if (this.typeString === 'bo') return 'mBo'
              return 'mInput'
          },
          value: {  // 专门为hidden类型的input用。
              get () {
                  return _.get(this.$store.state.pageData.data, this.name, '')
              },
              set (value) {
                  this.$store.commit('updateItem', {name: this.name, value: value})
              }
          }
      }
  }
</script>

<style scoped>

  .ivu-form-item-label {
    text-align: right;
  }

  .expend-all {
    width: 100%;
  }

  .m-flex {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
  }

  .m-input {
    margin-left: 0;
    width: 100%;
  }
</style>
