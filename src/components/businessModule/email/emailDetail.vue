<template>
  <div class="email_detail">
    <Row style="margin-bottom:20px">
      <Button class="boxBtn" @click="goback" shape="circle"><< 返回</Button>
      <Button class="boxBtn" @click="replay" style="margin-left:10px" shape="circle">回复</Button>
      <Button class="boxBtn" @click="deleteData" style="margin-left:10px" shape="circle">删除</Button>
      <Button class="boxBtn" @click="compDelete" style="margin-left:10px" shape="circle">彻底删除</Button>
      <Button class="boxBtn" @click="relay" style="margin-left:10px" shape="circle">转发</Button>
      <Button class="boxBtn" @click="report" style="margin-left:10px" shape="circle">举报</Button>
      <Button class="boxBtn" @click="regection" style="margin-left:10px" shape="circle">拒收</Button>
    </Row>
    <Row>
      <h3>{{returnData.theme}}</h3>
      <p class="emailMsg"><span>发件人：</span><span>{{returnData.postPerson}}</span></p>
      <p class="emailMsg"><span>时 &nbsp 间：</span><span>{{returnData.time}}</span></p>
      <p class="emailMsg"><span>收件人：</span><span>{{returnData.resivePerson}}</span></p>
    </Row>
    <Row style="height:200px;">

    </Row>
    <Row v-if="!changeFlag">
      <input type="text" style="width:1200px" placeholder="快捷回复给..." @click="toggle"/>
    </Row>
    <Row v-if="changeFlag">
      <p>
        <Icon type="images" class="fontStyle" style="color:#2db7f5"></Icon>
        <a>图片</a> <span>|</span>
        <Icon type="happy-outline" class="fontStyle" style="color:#ffdb65"></Icon>
        <a>表情</a>
      </p>
      <textarea style="width:1200px;height:100px;resize:none" autofocus="autofocus"></textarea><br/>
      <Button class="boxBtn" @click="send" style="margin-left:10px" shape="circle">发送</Button>
    </Row>
  </div>
</template>

<script>
/* eslint-disable */
  import { dispatch } from '../../../utils/skipUtils'

  export default {
    data () {
      return {
        changeFlag: false,
        returnData: {
          'theme': '转发：外挂？破解？网易重磅推出手游保护解决方案',
          'postPerson': '耿胜男 <13704263835@163.com>',
          'time': '2017年9月15日(星期五) 下午2:26',
          'resivePerson': '宇宙无敌美少女 <1506461525@qq.com>'
        }
      }
    },
    computed: {},
    methods: {
      goback () {
        window.history.go(-1)
      },
      replay () {

      },
      deleteData () {

      },
      compDelete () {

      },
      relay () {

      },
      report () {

      },
      regection () {

      },
      toggle () {
        this.changeFlag = true
      },
      send () {

      }

    },

  }
</script>

<style scoped>
  .email_detail {
    margin-top: 20px;
  }

  .emailMsg {
    margin: 5px 0;
  }

  .fontStyle {
    font-size: 20px;

  }
</style>
