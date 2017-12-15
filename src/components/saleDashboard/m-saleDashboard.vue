<template>
  <div>
    <Row>
      <Col 
        span="20" 
        offset="2">
      <Collapse 
        v-model="openPanel" 
        @on-change="panelChange">
        <Panel name="1">
          <span class="panel-title">销售简报</span>
          <div 
            slot="content" 
            class="number-container">
            <numberBox
              :chartData="numberBoxData"/>
          </div>
        </Panel>
        <Panel name="2">
          <span class="panel-title">业绩指标</span>
          <p slot="content">
            <Row>
              <Col span="12">
              <barLineChart 
                :chartData="barLineData"
                :barClick="searchResultTableData"
                xAxisKey="month"
                :stackKeys="['receivedMoney', 'contractSum']"/>
              </Col>
              <Col span="12">
                <Table
                    :columns="resultTableColums"
                    :data="resultTableData">

                </Table>
              </Col>
            </Row>
          </p>
        </Panel>
        <Panel name="3">
          <span class="panel-title">销售漏斗</span>
          <div 
            @click.stop 
            class="title-select">
            <Select v-model="funnelQuarter">
              <Option 
                v-for="item in funnelQuaterList"
                :key="item.id"
                :value="item.id">
                {{ item.text }}
              </Option>
            </Select>
          </div>
          <p slot="content">
            <Row>
              <Col span="12">
              <Card class="innter-card">
                <div 
                  solt="title" 
                  class="card-title-container">
                  <Row>
                    <Col 
                      class="card-title" 
                      span="4">
                    <span class="card-title-text">
                      销售阶段
                    </span>
                    </Col>
                    <Col span="4">
                    <Select v-model="funnelMoment">
                      <Option 
                        v-for="item in funnelMomentList"
                        :key="item.id"
                        :value="item.id">{{ item.text }}</Option>
                    </Select>
                    </Col>
                    <Col 
                      class="card-title" 
                      offset="12" 
                      span="4">
                    <span class="card-title" >
                      汇款金额
                    </span>
                    </Col>
                  </Row>
                </div>
                <funnelChart
                  :chartData="filterFunnelData"
                  :maxValue="funnelMaxValue"
                  :rectClick="rectClick"/>
              </Card>
              </Col>
              <Col span="12">
              <Row 
                class="funnel-right" 
                type="flex" 
                justify="center">
                <Col
                  span="4"
                  v-for="item in sortFunnelData"
                  :key="item.text">
                <div 
                  class="funnel-box"
                  :class="{active: item.percent <= currPercent}">
                  <span>{{ item.text }}</span><br>
                  <span>{{ item.percent * 100 + '%' }}</span>
                </div>
                </Col>
              </Row>
            </Col>
            </Row>
          </p>
        </Panel>
      </Collapse>
    </Col>
    </Row>
  </div>
</template>
<script>
import * as d3 from "d3"
import { arrMax } from "utils/utils"
import Request from 'utils/request-addon' 

let funnelData = [
  {
    moment: 1,
    quarter: 1,
    text: "尚未联系",
    value: 200,
    percent: "0.1"
  },
  {
    moment: 1,
    quarter: 1,
    text: "初步接触",
    value: 180,
    percent: "0.2"
  },
  {
    moment: 1,
    quarter: 1,
    text: "意向过滤",
    value: 160,
    percent: "0.4"
  },
  {
    moment: 1,
    quarter: 1,
    text: "商务接触",
    value: 140,
    percent: "0.6"
  },
  {
    moment: 1,
    quarter: 1,
    text: "基本谈妥",
    value: 120,
    percent: "0.8"
  },
  {
    moment: 2,
    quarter: 1,
    text: "尚未联系",
    value: 200,
    percent: "0.1"
  },
  {
    moment: 2,
    quarter: 1,
    text: "初步接触",
    value: 180,
    percent: "0.2"
  },
  {
    moment: 2,
    quarter: 1,
    text: "意向过滤",
    value: 160,
    percent: "0.4"
  },
  {
    moment: 2,
    quarter: 2,
    text: "尚未联系",
    value: 100,
    percent: "0.1"
  },
  {
    moment: 1,
    quarter: 2,
    text: "初步接触",
    value: 90,
    percent: "0.2"
  },
  {
    moment: 2,
    quarter: 2,
    text: "意向过滤",
    value: 80,
    percent: "0.4"
  },
  {
    moment: 1,
    quarter: 2,
    text: "商务接触",
    value: 70,
    percent: "0.6"
  },
  {
    moment: 2,
    quarter: 2,
    text: "基本谈妥",
    value: 60,
    percent: "0.8"
  },
  {
    moment: 1,
    quarter: 3,
    text: "尚未联系",
    value: 50,
    percent: "0.1"
  },
  {
    moment: 2,
    quarter: 3,
    text: "初步接触",
    value: 45,
    percent: "0.2"
  },
  {
    moment: 1,
    quarter: 3,
    text: "意向过滤",
    value: 40,
    percent: "0.4"
  },
  {
    moment: 2,
    quarter: 3,
    text: "商务接触",
    value: 35,
    percent: "0.6"
  },
  {
    moment: 1,
    quarter: 3,
    text: "基本谈妥",
    value: 30,
    percent: "0.8"
  }
];

export default {
  data() {
    return {
      openPanel: [1, 2, 3],
      // nubmerBox相关
      numberBoxData: [],
      // 柱状图折线图相关
      barLineData: [],
      resultTableColums: [
          {
              title: '目标',
              key: 'target'
          },
          {
              title: '合同金额',
              key: 'contractSum'
          },
          {
              title: '汇款金额',
              key: 'receivedMoney'
          }
      ],
      resultTableData: [],
      // 漏斗图相关
      funnelQuarter: 2,
      funnelQuaterList: [
        {
          id: 1,
          text: "本月"
        },
        {
          id: 2,
          text: "上月"
        },
        {
          id: 3,
          text: "上季度"
        }
      ],
      funnelMoment: 1,
      funnelMomentList: [
        {
          id: 1,
          text: "预测金额"
        },
        {
          id: 2,
          text: "商机个数"
        }
      ],
      funnelData: funnelData,
      currPercent: 0
    };
  },
  computed: {
    filterFunnelData() {
      return this.funnelData
        .filter(item => item.quarter === this.funnelQuarter)
        .filter(item => item.moment === this.funnelMoment);
    },
    funnelMaxValue() {
      return arrMax(this.funnelData, d => d.value);
    },
    // 排序后的数据
    sortFunnelData() {
      return this.filterFunnelData.sort((a, b) => a.percent - b.percent);
    }
  },
  mounted() {
    let request = new Request()
    request.setUrl('/api/sales-board/findSailsKits').forGet((data, err) => {
        this.numberBoxData = data
    })
    request.setUrl('/api/sales-board/pi-list').forGet((data, err) => {
        this.barLineData = data
    })
  },
  methods: {
    rectClick(data) {
      this.currPercent = data.percent;
    },
    panelChange() {
      this.openPanel = [1, 2, 3];
    },
    searchResultTableData (index) {
        let request = new Request()
        request.setUrl('/api/sales-board/performance-indicators/{year}/{month}').setPathVariables({
            year: 2017,
            month: this.barLineData[index].month
        })
        request.forGet((data, err) => {
            this.resultTableData = [data]
        })
    }
  }
};
</script>
<style>
.card-title-container {
  /* background: gray; */
}
.card-title {
  height: 32px;
}
.card-title-text {
  text-align: center;
  line-height: 32px;
}
.innter-card {
  margin-top: 20px;
  overflow-y: auto;
  overflow-x: auto;
}
.title-select {
  width: 100px;
  margin-left: 50px;
  position: absolute;
  top: -1px;
  left: 60px;
}
.funnel-right {
  margin-top: 20px;
}
.funnel-box {
  text-align: center;
  color: steelblue;
  border: 1px solid steelblue;
}
.funnel-box.active {
  background: steelblue;
  color: white;
}
.panel-title {
  font-size: 16px;
  font-weight: bold;
}
/* .number-container{
    overflow-y: auto;
    overflow-x: auto;
} */
</style>


