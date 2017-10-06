<template>
  <div class="layout-content-main">

    <Row style="margin: 20px 0">
      <Collapse v-model="collapseValue" accordion style="background: #fff5e6; border: 1px solid #ffebcc; font-size: 14px">
        <Panel name="1">
          &nbsp;<span style="color: #333333">公告</span>
          <p slot="content">
            &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="ios-lightbulb-outline"></Icon>&nbsp; 1. 公告栏内容，公告栏内容公告栏内容公告栏内容公告栏内容
          </p>
          <p slot="content">
            &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="ios-lightbulb-outline"></Icon>&nbsp; 2. 公告栏内容，公告栏内容公告栏内容公告栏内容公告栏内容
          </p>
          <p slot="content">
            &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="ios-lightbulb-outline"></Icon>&nbsp; 3. 公告栏内容，公告栏内容公告栏内容公告栏内容公告栏内容
          </p>
        </Panel>
      </Collapse>
    </Row>

    <Row>
      <Button type="warning" class="topBtn" @click="tranShow">{{caleText}}</Button>
      <!--onclick="window.location.href=''-->
      <Button type="info" class="topBtn">新建</Button>
      <Button type="success" class="topBtn">我的工作台 <span style="font-weight: bold">...</span></Button>
      <Button type="success" class="topBtn">我的视图 <span style="font-weight: bold">...</span></Button>
      <Button type="success" class="topBtn"><a href="/email" target="_blank" style="color:#fff">我的邮件</a> <span style="font-weight: bold">...</span></Button>
      <Button type="success" class="topBtn">我的设置 <span style="font-weight: bold">...</span></Button>
      <!--<Button type="warning" class="topBtn" @click="changeLength">{{caleText}}</Button>-->
    </Row>

    <Row>

      <transition name="slide-fade">
        <div v-if="show">
          <Col :span="colLength">
          <Row class="top_20">
            <Card>
              <p slot="title">
                <Icon type="quote"></Icon>
                <Tooltip content="显示最近 10 条任务" placement="top-start">
                  待办任务
                </Tooltip>
              </p>
              <a href="#" slot="extra" @click.prevent="changeLimit">
                <Icon type="navigate"></Icon>
                更多
              </a>
              <ul>
                <li v-for="(item,index) in tasks" class="li-dashed">
                  <!--<a :href="item.url" target="_blank">{{ index+1 + '. ' + item.name }}&nbsp;&nbsp;<Icon type="share"></Icon></a>-->
                  <a>{{ index + 1 + '. ' + item.name }}&nbsp;&nbsp;
                    <Icon type="share"></Icon>
                  </a>
                </li>
              </ul>
            </Card>
          </Row>
          <Row class="top_20">
            <Card>
              <p slot="title">
                <Icon type="easel"></Icon>
                <Tooltip content="显示最近 10 条日报" placement="top-start">
                  日报
                </Tooltip>
              </p>
              <a href="#" slot="extra" @click.prevent="changeLimit">
                <Icon type="navigate"></Icon>
                更多
              </a>
              <ul>
                <li v-for="(item,index) in dailyNews" class="li-dashed">
                  <a>{{ item.name }}</a>
                </li>
              </ul>
            </Card>
          </Row>
          <Row class="top_20">
            <Card>
              <p slot="title">
                <Icon type="eye"></Icon>
                <Tooltip content="显示最近 10 条关注" placement="top-start">
                  我的关注
                </Tooltip>
              </p>
              <a href="#" slot="extra" @click.prevent="changeLimit">
                <Icon type="navigate"></Icon>
                更多
              </a>
              <ul>
                <li v-for="(item,index) in attentions" class="li-dashed">
                  <a>{{ item.name }}</a>
                </li>
              </ul>
            </Card>
          </Row>
          <Row class="top_20">
            <Card>
              <p slot="title">
                <Icon type="document-text"></Icon>
                <Tooltip content="显示最近 10 条文档" placement="top-start">
                  我的文档
                </Tooltip>
              </p>
              <a href="#" slot="extra" @click.prevent="changeLimit">
                <Icon type="navigate"></Icon>
                更多
              </a>
              <ul>
                <li v-for="(item,index) in docs" class="li-dashed">
                  <a>{{ item.name }}&nbsp;&nbsp;
                    <Icon type="share"></Icon>
                  </a>
                </li>
              </ul>
            </Card>
          </Row>
          <Row class="top_20">
            <Card>
              <p slot="title">
                <Icon type="ios-list"></Icon>
                <Tooltip content="显示最近 10 条周报" placement="top-start">
                  我的周报
                </Tooltip>
              </p>
              <a href="#" slot="extra" @click.prevent="changeLimit">
                <Icon type="navigate"></Icon>
                更多
              </a>
              <ul>
                <li v-for="(item,index) in weeks" class="li-dashed">
                  <a>{{ item.name }}</a>
                </li>
              </ul>
            </Card>
          </Row>
          <Row class="top_20">
            <Card>
              <p slot="title">
                <Icon type="android-walk"></Icon>
                <Tooltip content="显示最近 10 条记录" placement="top-start">
                  公出记录
                </Tooltip>
              </p>
              <a href="#" slot="extra" @click.prevent="changeLimit">
                <Icon type="navigate"></Icon>
                更多
              </a>
              <ul>
                <li v-for="(item,index) in walks" class="li-dashed">
                  <a>{{ index + 1 + '. ' }}{{ item.name }}</a>
                </li>
              </ul>
            </Card>
          </Row>
          </Col>
          <Col :span="CalendarLength">
          <FullCalendar :events="fcEvents" lang="zh" @dayClick="dayClick" @eventClick="evert" style="padding: 20px 0 20px 20px"></FullCalendar>
          <div style="padding: 0 0 0 20px">
            <Table :columns="columnsCalendar" :data="dataCalendar"></Table>
          </div>
          </Col>
        </div>
      </transition>

      <transition name="fade">

        <div v-if="showNewCale">

          <Col :span="CalendarLength">
          <FullCalendar :events="fcEvents" lang="zh" style="padding: 20px 0 20px 0" @dayClick="dayClick" @eventClick="evert"></FullCalendar>
          </Col>

          <Col :span="TableLength">
          <div style="padding: 20px 0 0 20px">
            <Table :columns="columnsCalendar" :data="dataCalendar"></Table>
          </div>
          </Col>

        </div>

      </transition>

    </Row>

  </div>
</template>
<script>
  import Vue from 'vue'
  import FullCalendar from 'vue-fullcalendar'

  Vue.use(FullCalendar)

  export default {
    data: function () {
      return {
        collapseValue: '1',
        tasks: [
          {
            name: '审批供应商采购合同',
            url: ''
          }, {
            name: '填写单据',
            url: ''
          }, {
            name: '新建商品资料',
            url: ''
          }, {
            name: '采购订单流程审核',
            url: ''
          }, {
            name: '采购订单流程定价',
            url: ''
          }
        ],
        dailyNews: [
          {
            name: '周一：安装AR系统',
            url: ''
          }, {
            name: '周一：修改AR参数和添加License',
            url: ''
          }, {
            name: '周二：安装CMDB',
            url: ''
          }, {
            name: '周三：修改操作系统参数和数据库参数',
            url: ''
          }
        ],
        attentions: [
          {
            name: '大胃王密子君|2两米粉吃出3两·越吃越多的四川名食·绵阳米粉',
            url: ''
          }, {
            name: '【拂菻坊】英国网红假装中国人玩绝地大逃杀！',
            url: ''
          }, {
            name: '汪星人亲自上阵上演狗狗版“日全食”还挺形象',
            url: ''
          }, {
            name: '撸猫指南 触摸这个部位猫咪会发出谜一样的叫声',
            url: ''
          }, {
            name: '【星闻揭秘】陈伟霆刘诗诗吻戏预告 元凌生火呛醒卿尘',
            url: ''
          }
        ],
        docs: [
          {
            name: 'doc',
            url: ''
          }, {
            name: 'E棉',
            url: ''
          }, {
            name: 'myGit',
            url: ''
          }, {
            name: 'UserCenter',
            url: ''
          }, {
            name: '原型',
            url: ''
          }, {
            name: 'Atob',
            url: ''
          }
        ],
        weeks: [
          {
            name: '08/01 — 08/07',
            url: ''
          }, {
            name: '08/08 — 08/14',
            url: ''
          }, {
            name: '08/15 — 08/21',
            url: ''
          }
        ],
        walks: [
          {
            name: '杨阿炎，2017-02-03，东港，16:00-18:00',
            url: ''
          }, {
            name: '高帆，2017-05-06，香炉礁，09:00-18:00',
            url: ''
          }, {
            name: '高钱，2017-05-10，星海，13:00-18:00',
            url: ''
          }, {
            name: '赵小赵，2017-06-06，高新园区，10:00-12:00',
            url: ''
          }
        ],
        fcEvents: [
          {
            title: '采购申请',
            start: '2017-08-25',
            tasks: '3项',
            report: '16 h',
            count: '=HOUR(B1-A1)+MINUTE(B1-A1)/60-N'
          },
          {
            title: '会议报告',
            start: '2017-08-14',
            tasks: '2项',
            report: '3 h',
            count: '=HOUR(B1-A1)+MINUTE(B1-A1)/60-N'
          },
          {
            title: '填写单据',
            start: '2017-08-28',
            tasks: '1项',
            report: '24 h',
            count: '=HOUR(B1-A1)+MINUTE(B1-A1)/60-N'
          },
          {
            title: '安装AR系统',
            start: '2017-08-20',
            tasks: '4项',
            report: '5 h',
            count: '=HOUR(B1-A1)+MINUTE(B1-A1)/60-N'
          },
          {
            title: '审批采购合同',
            start: '2017-08-10',
            tasks: '1项',
            report: '0.5 h',
            count: '=HOUR(B1-A1)+MINUTE(B1-A1)/60-N'
          },
          {
            title: '新建商品资料',
            start: '2017-08-18',
            tasks: '5项',
            report: '2 h',
            count: '=HOUR(B1-A1)+MINUTE(B1-A1)/60-N'
          },
          {
            title: '流程定价',
            start: '2017-08-19',
            tasks: '2项',
            report: '3 h',
            count: '=HOUR(B1-A1)+MINUTE(B1-A1)/60-N'
          }
        ],
        columnsCalendar: [
          {
            type: 'index',
            width: 60
          },
          {
            title: '标识',
            key: 'tasks'
          },
          {
            title: '名称',
            key: 'title'
          },
          {
            title: '汇报工时',
            key: 'report'
          },
          {
            title: '计算工时',
            key: 'count',
            width: '250'
          }
        ],
        colLength: '11',
        CalendarLength: '13',
        TableLength: '11',
        caleText: '只显示日历',
        dataCalendar: [],
        show: true,
        showNewCale: false
      }
    },
    methods: {
      tranShow () {
        this.show = !this.show
        this.showNewCale = !this.showNewCale
        this.caleText = this.showNewCale ? '显示全部' : '只显示日历'
      },
      dayClick (date, allDay, jsEvent, view) {
        console.log('null')
      },
      evert (event, jsEvent, pos) {
        this.dataCalendar.push(event)
      }
    },
    mounted () {},
    components: {
      FullCalendar
    }
  }
</script>

<style lang="css">

  /*vue-transition*/
  .slide-fade-enter-active {
    transition: all .6s ease;
  }

  .slide-fade-leave-active {
    transition: all .6s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateX(-800px);
    opacity: 0;
  }

  /*卡片头*/
  .topAlert {
    border-radius: 0;
  }

  .topBtn {
    margin-right: 4px;
  }

  .top_20 {
    margin-top: 20px
  }

  .li-dashed {
    border-bottom: 1px dashed #dddddd;
    line-height: 28px
  }

  .title {
    font-size: 17px;
  }

  .prev-month {
    font-size: 17px;
  }

  .next-month {
    font-size: 17px;
  }

  .layout-content-main {
    padding-left: 60px;
  }

  .ivu-card-head {
    background: #f7f7f7;
    line-height: 0.6;
    padding: 11px 16px;
  }

  .ivu-card-extra {
    top: 11px;
  }

  .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
    height: 42px;
  }

  .weeks {
    margin-top: -20px;;
  }

  .comp-full-calendar {
    padding: 0;
  }

  .full-calendar-header {
    background: #f7f7f7;
    border: 1px solid #e9eaec;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: 0;
    line-height: 40px;
  }

  .week {
    line-height: 24px;
  }

</style>
