<template>
    <div>
        <Row>
            <Col span="20" offset="2">
            <Collapse v-model="openPanel" @on-change="panelChange">
                <Panel name="1">
                    <span class="panel-title">销售简报</span>
                    <div slot="content" class="number-container">
                        <numberBox 
                            :chartData="numberBoxData"
                            :show="showNumberBox" />
                    </div>
                </Panel>
                <Panel name="2">
                    <span class="panel-title">业绩指标</span>
                    <p slot="content">
                        <Row>
                            <Col span="12" class="bar-chart-container">
                            <barLineChart :chartData="barLineData" :barClick="searchResultTableData" xAxisKey="month" :stackKeys="['receivedMoney', 'contractSum']"
                            />
                            </Col>
                            <Col span="12">
                            <Table :columns="resultTableColums" :data="resultTableData">
                            </Table>
                            </Col>
                        </Row>
                    </p>
                </Panel>
                <Panel name="3">
                    <span class="panel-title">销售漏斗</span>
                    <div @click.stop class="title-select">
                        <Select v-model="funnelQuarter" @on-change="funnelQuarterChange">
                            <Option v-for="item in funnelQuaterList" :key="item.id" :value="item.id">
                                {{ item.text }}
                            </Option>
                        </Select>
                    </div>
                    <p slot="content">
                        <Row>
                            <Col span="12">
                            <Card class="innter-card">
                                <div solt="title" class="card-title-container">
                                </div>
                                <funnelChart :chartData="sortFunnelData" :maxValue="funnelMaxValue" :rectClick="rectClick" />
                            </Card>
                            </Col>
                            <Col span="12">
                            <Row class="funnel-right" type="flex" justify="center">
                                <Col span="4" v-for="item in sortFunnelData" :key="item.text">
                                    <div class="funnel-box" :class="{active: item.percent <= currPercent}">
                                        <span>{{ item.text }}</span>
                                        <br>
                                        <span>{{ item.percent }}</span>
                                    </div>
                                </Col>
                            </Row>
                            <tableF-Shim class="funnel-table" :define="funnelTableDefine" />
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
    import {arrMax,deepCopy} from "utils/utils"
    import Request from 'utils/request-addon'

    let urlObj = {
        getNumberBoxData: '/api/sales-board/findSailsKits',
        getBarLineData: '/api/sales-board/pi-list',
        getBarLineTableData: '/api/sales-board/performance-indicators/{year}/{month}',
        getFunnelTableDefine: '/api/sales-board/listDefine',
        getFunnelData: '/api/sales-board/sales-funnel-overview'
    }

    export default {
        data() {
            return {
                openPanel: ["1", "2", "3"],
                // nubmerBox相关
                numberBoxData: [],
                // 柱状图折线图相关
                barLineData: [],
                resultTableColums: [{
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
                funnelQuarter: 1,
                funnelQuaterList: [{
                        id: 1,
                        year: '2017',
                        month: '1',
                        text: "一月"
                    },
                    {
                        id: 2,
                        year: '2017',
                        month: '2',
                        text: "二月"
                    },
                    {
                        id: 3,
                        year: '2017',
                        month: '3',
                        text: "三月"
                    },
                    {
                        id: 4,
                        year: '2017',
                        month: '4',
                        text: "四月"
                    },
                    {
                        id: 12,
                        year: '2017',
                        month: '12',
                        text: "十二月"
                    }
                ],
                funnelMoment: 1,
                funnelData: [],
                currPercent: '',
                funnelTableDefine: {
                    cols: [],
                    data_url: {},
                    showModalBtn: false,
                }
            }
        },
        computed: {
            showNumberBox () {
                return this.openPanel.includes("1")
            },
            currentFunnelQuater() {
                return this.funnelQuaterList.filter(item => item.id === this.funnelQuarter)[0]
            },
            funnelMaxValue() {
                if (this.funnelData.length > 0) {
                    return arrMax(this.funnelData, d => d.value)
                }else {
                    return 0
                }
            },
            // 排序后的数据
            sortFunnelData() {
                return this.funnelData.sort((a, b) => a.percent.slice(0, a.length - 1) - b.percent.slice(0, a.length - 1))
            }
        },
        mounted() {
            let request = new Request()
            request.setUrl(urlObj.getNumberBoxData).forGet((data, err) => {
                this.numberBoxData = data
            })
            request.setUrl(urlObj.getBarLineData).forGet((data, err) => {
                this.barLineData = data
            })
            request.setUrl(urlObj.getFunnelTableDefine).forGet((data, err) => {
                this.funnelTableDefine = data.ui_define
            })
            this.searchFunnelData()
        },
        methods: {
            funnelQuarterChange () {
                this.searchFunnelData()
                this.searchFunnelTableData()
            },
            rectClick(data) {
                this.currPercent = data.percent
                this.searchFunnelData()
                this.searchFunnelTableData()
            },
            panelChange() {
                // this.openPanel = [1, 2, 3];
            },
            searchResultTableData(index) {
                let request = new Request()
                request.setUrl(urlObj.getBarLineTableData).setPathVariables({
                    year: 2017,
                    month: this.barLineData[index].month
                })
                request.forGet((data, err) => {
                    this.resultTableData = [data]
                })
            },
            searchFunnelTableData() {
                let define = deepCopy(this.funnelTableDefine)
                define.data_url.body = {
                    year: this.currentFunnelQuater.year,
                    month: this.currentFunnelQuater.month,
                    phase: this.currPercent ? this.currPercent : '',
                    flag: 'month'
                }
                this.funnelTableDefine = define
            },
            searchFunnelData() {
                let request = new Request()
                request.setUrl(urlObj.getFunnelData).setBody({
                    year: this.currentFunnelQuater.year,
                    month: this.currentFunnelQuater.month,
                    flag: 'month'
                }).forPost((data, err) => {
                    this.funnelData = data
                })
            }
        }
    }
</script>
<style>
    .card-title {
        height: 32px;
    }

    .card-title-text {
        text-align: center;
        line-height: 32px;
    }

    .innter-card {
        margin-top: 100px;
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
        padding-left: 30px;
    }

    .funnel-box {
        text-align: center;
        color: steelblue;
        border: 1px solid steelblue;
    }

    .funnel-table{
        padding-left: 30px;
    }

    .funnel-box.active {
        background: steelblue;
        color: white;
    }

    .panel-title {
        font-size: 16px;
        font-weight: bold;
    }

    .bar-chart-container {
        overflow-x: auto;
        overflow-y: hidden;
    }

</style>
