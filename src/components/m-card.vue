<template>
  <Row :gutter="16">
    <Col :md="4" v-for="item in items" :key="item.ui_id">
    <Card>
      <p slot="title">{{item.text}}</p>
      <p style="margin-bottom: 4px">{{item.description}}</p>
      <p>
        <Button-group>
          <Button type="ghost" :key="button.text" v-for="button in item.buttons" :type="button.type"
                  @click="getMeta(button.url)">{{button.text}}
          </Button>
        </Button-group>
      </p>
    </Card>
    </Col>
  </Row>
</template>
<script>
  //  import Vue from 'vue'
  //  import utils from '../utils/utils'
  import _ from 'lodash'
  import { dispatch } from '../utils/actionUtils'

  export default {

    props: {'define': {type: Object}},
    computed: {
      items: function () {
//        return utils(this.define, [], 'links')
        return _.get(this.define, 'links', [])
      }
    },
    methods: {
      getMeta: function (url) {
        dispatch(url)
      }
    }
  }
</script>
<style scoped>
  a.btn {
    margin-right: 5px;
  }

</style>
