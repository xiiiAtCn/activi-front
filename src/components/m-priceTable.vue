<template>
  <div style="margin-bottom: 30px">
    <div>
      <Button-group size="small">
        <div class="nav-btn" :key="button.text" v-for="(button, index) in querys">
          <Button @click="delAttr(button)" class="kong">
            <span class="nav-btn-title">{{button.title}}:</span>
            <span class="nav-btn-text">{{button.text}}</span>
            <Icon class="close-btn" v-show="button.type == 'attr'" type="close"/>
          </Button>
          <Icon type="chevron-right" class="kong" v-show="index != querys.length - 1 && button.type != 'attr'"></Icon>
        </div>
      </Button-group>
    </div>
    <div class="chooseCard">
      <Row class="flexCenter">
        <Col span="2">
        <h3>{{metasInfo.title}}</h3>
        </Col>
        <Col span="22">
        <Button-group size="small">
          <Button :key="button.text" v-for="button in metasInfo.buttons" :type="button.type" @click="replaceMeta(metasInfo.title, button.text)" class="kong">{{button.text}}
          </Button>
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
                  @click="addAttr(item.title, button)" class="kong">{{button.text}}
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
  //  import { dispatch } from '../utils/actionUtils'
  import { default as fetch } from '../utils/DefineFetcher'
  import _ from 'lodash'

  export default {
    data () {
      return {
        querys: []
      }
    },
    props: ['define'],
    computed: {
      links: function () {
//        return utils(this.define, [], 'links')
        return _.get(this.define, 'links', [])
      },
      // querys: function () {
      //     return utils(this.define, [], 'querys')
      // },
      metasInfo: function () {
        return this.links.metasInfo
      },
      otherInfos: function () {
        return this.links.otherInfos
      }
    },
    methods: {
      // getMeta: function (url) {
      //     dispatch(url)
      // },
      delAttr: function (button) {
        if (button.type !== 'meta') {
          this.querys.forEach((item, i) => {
            if (item.title === button.title && item.text === button.text) {
              this.querys.splice(i, 1)
            }
          })
        }
      },
      addAttr: function (title, button) {
        // todo 一个or多个
        this.querys = _.filter(this.querys, function (o) {
          return o.title !== title
        })
        this.querys.push({
          text: button.text,
          title: title,
          type: 'attr'
        })
      },
      replaceMeta: function (title, text) {
        this.querys = []
        this.querys.push({
          text: text,
          title: title,
          type: 'meta'
        })
      }
    },
    mounted () {
      fetch('/api/productPrice?id=1&q=2&w=3&id=2', (res, status) => {
        console.log(res)
      })
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

  .nav-btn {
    display: inline;
  }

  .close-btn {
    margin-left: 10px;
    color: red;
  }

  .nav-btn-title {
    color: black;
  }

  .nav-btn-text {
    color: red;
  }
</style>
