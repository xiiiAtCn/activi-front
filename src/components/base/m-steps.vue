<template>
  <!--2.0.0-rc.15-->
    <div class="space">
        <Row>
        {{define.operation}}
        <div v-for="(item, index) in define.operation" :key="index" class="config">
            <div class="operation">
            <Button type="primary" v-if="item.url" shape="circle" @click="getMeta(item.url)">{{item.name}}</Button>
            <Button type="primary" v-else shape="circle" @click="showModal(item.name)">{{item.name}}</Button>
            </div>
        </div>
        </Row>
        <br>
        <Steps :current="number" ref="curr">
            <Step :title="item.name" :content="item.content" :key="index" v-for="(item, index) in jobList"></Step>
        </Steps>
    </div>
</template>
<script>
  import _ from 'lodash'
  import fetch from '../../utils/DefineFetcher'

  export default {
      props: ['define', 'content'],
      data () {
          return {
              hasError: false,
              errorMessage: '',
              number: -1,
              jobList: [],
              num: -1
          }
      },
      mounted () {
          let _this = this
          let url = this.define.data_url
          if (url) {
              fetch(url, (error, body) => {
                  if (error === null) {
                      console.log('boddd', body)
                      _this.number = body.current
                      _this.jobList = body.jobList
                      setTimeout(function () {
                          _this.number = body.current + 1
                      }, 0)
                      setTimeout(function () {
                          _this.number = body.current
                      }, 0)
                  }
              })
          } else {
              _this.number = 0
              _this.jobList = []
          }
      },
      computed: {
          name () {
              return _.get(this.define, 'name', '')
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
      methods: {}
  }
</script>
<style>
  .space {
    margin-bottom: 45px;
  }
</style>
