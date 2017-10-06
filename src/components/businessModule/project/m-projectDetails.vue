<template>
    <div style="padding: 20px 40px 40px 40px">
        <Form :model="formItem" :label-width="80">
            <FormItem label="项目名称">
                <Input v-model="formItem.input" placeholder="请输入" disabled></Input>
            </FormItem>
            <FormItem label="立项日期">
                <Row>
                    <Col span="11">
                        <DatePicker type="date" placeholder="选择日期" v-model="formItem.date" disabled></DatePicker>
                    </Col>
                    <Col span="1">&nbsp;</Col>
                    <Col span="2" style="text-align: left;">是否限定日期</Col>
                    <Col span="9">
                        <RadioGroup v-model="formItem.radio">
                            <Radio label="true">是</Radio>
                            <Radio label="false">否</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="项目经理">
                <Row>
                    <Col span="11">
                        <Input v-model="formItem.input" placeholder="请输入" disabled></Input>
                    </Col>
                    <Col span="1">&nbsp;</Col>
                    <Col span="2" style="text-align: left;">重要度</Col>
                    <Col span="3">
                        <Select v-model="formItem.select" placeholder="请选择">
                            <Option value="beijing">重要</Option>
                            <Option value="shanghai">中等</Option>
                            <Option value="shenzhen">不重要</Option>
                        </Select>
                    </Col>
                    <Col span="1">&nbsp;</Col>
                    <Col span="2" style="text-align: left;">紧急度</Col>
                    <Col span="3">
                        <Select v-model="formItem.select1" placeholder="请选择">
                            <Option value="beijing1">紧急</Option>
                            <Option value="shanghai1">中等</Option>
                            <Option value="shenzhen1">不紧急</Option>
                        </Select>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="项目预算">
                <Input v-model="formItem.yusuan" placeholder="请输入" disabled></Input>
            </FormItem>
            <FormItem label="合同单号">
                <Input v-model="formItem.danhao" placeholder="请输入" disabled></Input>
            </FormItem>
            <FormItem label="客户信息">
                <Input v-model="formItem.info" placeholder="请输入" disabled></Input>
            </FormItem>
            <FormItem label="计划日期">
                 <Row>
                     <Col span="11">
                        <DatePicker type="date" placeholder="选择日期" v-model="formItem.planDate" disabled></DatePicker>
                     </Col>
                     <Col span="2" style="text-align: center">
                        实际日期
                     </Col>
                     <Col span="11">
                        <DatePicker type="date" placeholder="选择日期" v-model="formItem.realDate" disabled></DatePicker>
                     </Col>
                 </Row>
            </FormItem>
        </Form>
        <Alert style="border-radius: 2px; line-height: 40px; font-size: 16px; font-weight: bold; text-align: center">项目快照</Alert>
        <Row class="top_20" v-for="ever in ary">
            <Card>
                <p slot="title" style="margin-bottom: 6px;">
                    <span style="margin-right: 30px; font-size: 14px" v-for="item in ever.titles">{{item}}</span>
                </p>
                <p slot="title">
                    <Icon :type="ever.icon" style="color: #2d8cf0"></Icon>
                    <Tooltip content="显示最近 10 条任务" placement="top-start" style="color: #2d8cf0">
                        {{ever.title}}
                    </Tooltip>
                </p>
                <a href="#" slot="extra">
                    <Icon type="navigate"></Icon>
                    更多
                </a>
                <ul>
                    <li v-for="(item,index) in ever.data" class="li-dashed">
                        <a>
                            {{ index+1 + '. ' + item.name }}&nbsp;&nbsp;
                            <Icon type="share"></Icon>
                        </a>
                    </li>
                </ul>
            </Card>
        </Row>
    </div>
</template>

<script>
/* eslint-disable */
    import {dispatch} from  '../../../utils/skipUtils'
    export default {
        data () {
            return {
                ary: [
                    {
                        titles: [
                            '任务情况: 正常',
                            '已计划任务数: 20',
                            '已完成任务数: 16'
                        ],
                        title: '最近任务',
                        icon: 'quote',
                        data: [
                            {
                                name: '审批供应商采购合同',
                                url: '',
                            }, {
                                name: '填写单据',
                                url: '',
                            }, {
                                name: '新建商品资料',
                                url: '',
                            },{
                                name: '采购订单流程审核',
                                url: '',
                            },{
                                name: '采购订单流程定价',
                                url: '',
                            }
                        ]
                    },
                    {
                        titles: [
                            '问题情况: 拖延',
                            '已识别问题: 6',
                            '未解决问题: 0'
                        ],
                        title: '最近问题',
                        icon: 'quote',
                        data: [
                            {
                                name: '库存不足',
                                url: '',
                            }, {
                                name: '人员分配不均',
                                url: '',
                            }, {
                                name: '客户材料不全',
                                url: '',
                            }
                        ]
                    },
                    {
                        titles: [
                            '风险情况: 平稳',
                            '已识别风险: 5',
                            '未解决风险: 2'
                        ],
                        title: '最近风险',
                        icon: 'quote',
                        data: [
                           {
                                name: '定价不合理',
                                url: '',
                           }
                        ]
                    },
                    {
                        titles: [
                            '成果情况: 已完成',
                            '计划成果数目: 3',
                            '已识别数目: 2',
                            '已完成数目: 3'
                        ],
                        title: '最近成果',
                        icon: 'quote',
                        data: [
                            {
                                name: '销售绩效整体达标',
                                url: '',
                            }, {
                                name: '客户档案模块开发完成',
                                url: '',
                            }, {
                                name: '客户资料已补充齐全',
                                url: '',
                            }, {
                                name: '流程审批效率提升',
                                url: '',
                            }
                        ]
                    },
                    {
                        titles: [
                            '变更情况: 已变更',
                            '变更数量: 3',
                            '已识别数目: 2',
                            '已完成数目: 3'
                        ],
                        title: '最近变更',
                        icon: 'quote',
                        data: [
                            {
                                name: '对应客户资料变更',
                                url: '',
                            }, {
                                name: '客户管理单据变更',
                                url: '',
                            }, {
                                name: '资料变更',
                                url: '',
                            },{
                                name: '采购订单流程定价变更',
                                url: '',
                            }
                        ]
                    }
                ],
                formItem: {
                    input: '后台管理系统',
                    select: 'beijing',
                    select1: 'beijing1',
                    radio: 'true',
                    date: '2017-09-09',
                    yusuan: '1000,000',
                    danhao: 'BXJU_op112',
                    info: '大连圣亚集团',
                    planDate: '2018-06-06',
                    realDate: '2019-01-02'
                }
            }
        },
        computed: {},
        methods: {

        },

    }
</script>

<style scoped>
    .top_20 {
        margin-top: 20px
    }
    .li-dashed {
        border-bottom: 1px dashed #dddddd; line-height: 28px
    }
    .layout-copy {
        padding: 10px 0 40px;
    }
</style>
