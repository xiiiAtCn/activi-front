<template>
    <div>
        <Row class="config">
            <div v-for="item in operation" class="operation">
                <Button type="primary" shape="circle" @click="getMeta(item.url)">{{item.name}}</Button>
            </div>
            <div class="search">
                <Input v-model="search" placeholder="筛选">
                    <Button slot="append" icon="ios-search"></Button>
                </Input>
            </div>
        </Row>
        <div v-for="row in historyData" :key="row.billId" class="detailCard">
            <Card class="titleDefine">
                <Row>
                    <Col span="6" v-for="item in titleDefine">
                        <span>{{item.alias}}: </span>
                        <a href="javascript:void(0);" @click="getMeta(row._actions[item.field].url)" v-if="row._actions[item.field]">{{row[item.field]}}</a>
                        <span v-else class="bold">{{row[item.field]}}</span>
                    </Col>
                </Row>
            </Card>
            <Card shadow>
                <Row>
                    <Col span="18" class="border_1">
                        <!--有明细显示-->
                        <Row type="flex" justify="start" :gutter="16" v-if="row['details'].length > 0" v-for="detail in row.details" class="border_2">
                            <Col :span="item.class" v-for="item in bodyDefine">
                                <Checkbox v-if="item.allSelect"></Checkbox>
                                <div v-else v-for="filed in item.fieldDefine">
                                    {{filed.alias}}: <a @click="getMeta(row._actions[filed.field].url)" v-if="row._actions[filed.field]">{{detail[filed.field]}}</a>
                                    <span v-else class="bold">{{detail[filed.field]}}</span>
                                </div>
                            </Col>
                        </Row>
                        <!--无明细显示-->
                        <Row type="flex" justify="start" :gutter="16" v-if="row['details'].length === 0">
                            <Col span="10" push="2" class="border_3">
                                <p class="menu_red"><i class="ivu-icon ivu-icon-android-create"></i>明细未填写</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="6">
                        <Row type="flex" justify="end">
                            <Button-group>
                                <Button v-for="action in row._actions"  @click="getMeta(action.url)" size="small">{{action.text}}</Button>
                            </Button-group>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </div>
        <Page :total="dataCount" :page-size="pageSize" @on-change="changePage"></Page>
    </div>
</template>
<script>
    import Vue from 'vue'
import { dispatch } from '../utils/actionUtils'
    export default {
        data () {
            return {
                search: '',
                ajaxHistoryData: [],
                // 初始化信息总条数
                dataCount: 0,
                // 每页显示多少条
                pageSize: 10,
                historyData: []
            }
        },
        props: {
            rows: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            operation: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            titleDefine: {
                type: Array,
                'default': function () {
                    return []
                }
            },
            bodyDefine: {
                type: Array,
                'default': function () {
                    return []
                }
            }
        },
        methods: {
            getMeta: function (action) {
                dispatch(action)
            },
//          获取历史记录信息
            handleListApproveHistory () {
                // 保存取到的所有数据
                this.ajaxHistoryData = this.searchData
                this.dataCount = this.searchData.length
            // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                if (this.searchData.length < this.pageSize) {
                    this.historyData = this.ajaxHistoryData
                } else {
                    this.historyData = this.ajaxHistoryData.slice(0, this.pageSize)
                }
            },
            changePage: function (index) {
                let _start = (index - 1) * this.pageSize
                let _end = index * this.pageSize
                this.historyData = this.ajaxHistoryData.slice(_start, _end)
            }
        },
        watch: {
            searchData: function () {
                this.handleListApproveHistory()
            }
        },
        computed: {
            searchData: {
                get: function () {
                    let search = this.search
                    if (search) {
                        return this.rows.filter(function (product) {
                            return Object.keys(product).some(function (key) {
                                return String(product[key]).toLowerCase().indexOf(search) > -1
                            })
                        })
                    }
                    return this.rows
                },
                set: function (newValue) {
                    return newValue
                }
            }
        },
        mounted () {
//            this.$nextTick(function() {
//                // DOM 更新了
//                console.log(this.titleDefine)
//            });
//            console.log('this.row: ', this.operation);
//            this.handleListApproveHistory();
        }
    }
</script>
<style scoped>
    .border_1 .border_2:last-child {
        border-bottom: none;
        padding: 12px 0 0 0;
    }
    .border_2 {
        padding: 1px 0 12px 0;
        margin-bottom: 3px;
        border-bottom: 1px dashed #dddee1
    }
    .config {
        display: flex;
        justify-content: flex-start;
        position: relative;
        margin-bottom: 10px;
    }
    .search {
        margin-left: 20px;
        min-width: 300px;
        position: absolute;
        right: 0;
    }
    .titleDefine {
        background: #E3E3E3;
        border: none;
        border-left: 2px solid #ed3f14;
        margin-bottom: 10px;
        border-radius: 0;
        height: 36px;
        line-height: 4px;
    }
    .titleDefine:hover {
        cursor: pointer;
        border-left: 2px solid #ed3f14;
        box-shadow: none;
    }
    .menu_red {
        color: #ed3f14;
    }
    .bold {
        font-weight: bold;
    }
    .detailCard {
        background: #F2F2F2;
        border: 2px solid #F2F2F2;
        padding: 13px;
        border-radius: 4px;
        margin: 20px 0 30px 0;
        transition: .3s;
    }
    .detailCard:hover {
        border: 2px solid #E9967A;
        cursor: pointer;
    }
</style>
