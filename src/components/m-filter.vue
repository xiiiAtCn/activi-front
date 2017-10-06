<template>
  <div style="margin-bottom: 30px">
    <div class="chooseCard">
      <Row class="flexCenter">
        <Col span="2">
        <h3>{{metasInfo.title}}</h3>
        </Col>
        <Col span="22">
        <Button-group size="small">
          <Button :key="button.text" v-for="button in metasInfo.buttons" :type="button.type" class="kong">{{button.text}}</Button>
        </Button-group>
        </Col>
      </Row>
      <Row class="flexCenter" v-for="item in otherInfos">
        <Col span="2">
        <h3>{{item.title}}</h3>
        </Col>
        <Col span="22">
        <Button-group size="small">
          <Button :key="button.text" v-for="button in item.trackers" :type="button.type"
                  @click="getMeta(button.url)" class="kong">{{button.text}}
          </Button>
        </Button-group>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  //  import Vue from 'vue'
//  import utils from '../utils/utils'
  import { dispatch } from '../utils/skipUtils'
  import _ from 'lodash'

  export default {
    data () {
      return {}
    },
    props: ['define'],
    computed: {
      links: function () {
//        return utils(this.define, [], 'links')
        return _.get(this.define, 'links', [])
      },
      metasInfo: function () {
        return this.links.metasInfo
      },
      otherInfos: function () {
        return this.links.otherInfos
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

  .chooseCard {
    padding: 12px 24px;
    border: 2px solid #eeeeee;
  }

  .flexCenter {
    display: flex;
    align-items: center;
    padding: 8px;
  }

  .flexCenter:not(:last-child) {
    border-bottom: 1px dashed #dddddd;
  }

  .kong {
    margin-right: 10px;
  }
</style>
