<template>
  <Row :gutter="gutter" :type="type">
      <transition-group name="fade" mode="out-in">
          <Col :span="item.ui_define.col" :push="item.ui_define.offset" v-for="item in content" :key="item.ui_id">
              <component :is="item.ui_content[0].ui_type"
                         :uid="item.ui_content[0].ui_id"
                         :define="item.ui_content[0].ui_define"
                         :content="item.ui_content[0].ui_content"></component>
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
