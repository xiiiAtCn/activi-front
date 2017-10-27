<template>
  <div>
    <Row :gutter="16" style="padding: 0 10px">
      <Row v-for="item in items" style="margin: 10px 0 30px 0">
        <Button v-if="!!item.template" icon="navicon-round" type="info" style="border-radius: 0" @click="getMeta(item.template.url)">{{item.template.title}}</Button>
        <div style="border-bottom: 1px solid #2db7f5; margin-bottom: 16px"></div>
        <Col v-for="boMeta in item.children" :key="item.ui_id" style="display: inline-block; margin-right: 12px">
        <Button-group>
          <Button :key="button.text" v-for="button in boMeta.buttons" :type="button.type"
                  @click="getMeta(button.url)">{{button.text}}
          </Button>
        </Button-group>
        </Col>
      </Row>
    </Row>
  </div>
</template>
<script>
  import { dispatch } from '../utils/skipUtils'
  import _ from 'lodash'

  export default {
    props: {'define': {type: Object}},
    computed: {
      items: function () {
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
