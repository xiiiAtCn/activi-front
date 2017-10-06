<template>
  <div class="email_check">
    <Row style="margin-bottom:20px">
      <Button class="boxBtn" @click="deleteData" shape="circle">删除</Button>
      <Button class="boxBtn" @click="compDelete" style="margin-left:10px" shape="circle">彻底删除</Button>
      <Button class="boxBtn" @click="relay" style="margin-left:10px" shape="circle">转发</Button>
      <Button class="boxBtn" @click="read" style="margin-left:10px" shape="circle">全部标记为已读</Button>
      <Button class="boxBtn" @click="close" style="margin-left:10px" shape="circle">关闭</Button>
    </Row>
    <Table :columns="columns" :data="data1" border @on-select="chooseCompany" @on-select-cancel="cancleChooseCompany"></Table>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    data () {
      return {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            width: 80,
            align: 'center',
            key: 'email',
            render: (h, params) => {
              if (params.row.email === '1') {
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'email',
                    },
                    style: {
                      fontSize: '20px',
                      color: '#fff1aa'
                    },
                  }),
                  h('strong')
                ])
              } else if (params.row.email === '2') {
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'ios-filing-outline',
                    },
                    style: {
                      fontSize: '20px',
                      color: '#ccc'
                    },
                  }),
                  h('strong')
                ])
              }

            }

          },
          {
            title: '发件人',
            key: 'postPerson',
            align: 'center'
          },
          {
            title: '主题',
            width: 1100,
            align: 'left',
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.$router.push({
                      path: '/email/emailDetail'
                    })
                  }
                }
              }, params.row.theme)
            }

          },
          {
            title: '时间',
            key: 'time',
            align: 'center',
            sortable: true
          }
        ],
        data1: [
          {
            'email': '1',
            'postPerson': '张杰',
            'theme': '转发：招商银行一卡通开户通知',
            'time': '2017-09-15'
          },
          {
            'email': '2',
            'postPerson': '刘能',
            'theme': '招商银行一卡通开户通知',
            'time': '2017-09-25'
          }
        ],

      }
    },
    computed: {
      iconSize () {
      }
    },
    methods: {
      deleteData () {

      },
      compDelete () {

      },
      relay () {

      },
      read () {

      },
      close () {
        this.$router.push({
          path: '/email/home'
        })
      }

    },

  }
</script>

<style scoped>
  .email_check {
    margin-top: 20px;
  }
</style>
