<template>
    <Row :gutter="gutter" :type="type">
        <transition-group name="fade" mode="out-in">
            <Col
                v-for="(item, index) in content"
                :span="item.ui_define.col"
                :push="item.ui_define.offset"
                :key="index"
            >
                <component
                    v-if="item.ui_content ? true : false"
                    :is="item.ui_content[0].ui_type"
                    :define="item.ui_content[0].ui_define"
                    :content="item.ui_content[0].ui_content"
                >
                </component>
                <div v-else class="box"></div>
            </Col>
        </transition-group>
    </Row>
</template>
<script>
  import _ from 'lodash'
  export default {
      props: ['define', 'content'],
      computed: {
          gutter () {
              return _.get(this.define, 'gutter', 5)
          },
          type () {
              return _.get(this.define, 'type', null)
          }
      }
  }
</script>
<style scoped>
    .box{
        padding: 10px;
    }
</style>
