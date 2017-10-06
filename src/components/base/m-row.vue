<template>
  <Row :gutter="gutter" :type="type">
    <transition-group name="fade" mode="out-in">
      <Col :span="item.span" :push="item.offset" v-for="item in define" :key="item.linkedId">
      <component :is="content[item.linkedId].ui_type" :uid="content[item.linkedId].ui_id" :define="content[item.linkedId].ui_define"
                 :content="content[item.linkedId].ui_content"></component>
      <!--{{content[item.linkedId]}}-->
      </Col>
    </transition-group>
  </Row>
</template>
<script>
  import mTree from '../m-tree.vue'
  import mSection from '../m-section.vue'
  import mMenu from '../m-menu.vue'
  import mLabelInput from './m-labelInput.vue'
  import _ from 'lodash'

  export default {
    components: {mTree, mSection, mLabelInput, mMenu},
    props: ['define', 'content'],
    data: function () {
      return {
        gutter: _.get(this.define, 'gutter', 5),
        type: _.get(this.define, 'type', null)
      }
    }
  }
</script>
