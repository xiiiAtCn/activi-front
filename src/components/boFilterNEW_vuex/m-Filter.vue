<template>
    <div class="filter-container">
        <!-- 导航部分 -->
        <Button-group class="nav-query-container">
            <div
                v-for="(button, index) in queryData"
                :key="button.id" 
                class="nav-btn" >
                <Tag 
                    v-if="!isAdQuery(button)"
                    type="border"
                    closable
                    color="red"
                    @on-close="delQuery(button)">
                    <span class="nav-btn-title">
                        <span v-if="button.title" class="nav-btn-title">
                            {{button.title}}
                        </span>
                        <span v-if="button.child">
                            :
                        </span>
                        <span 
                            v-for="child in button.child" 
                            :key="child.id"
                            class="nav-btn-text">
                            {{child.title}}
                        </span>
                    </span>
                </Tag>
                <Tooltip placement="top">
                    <Tag 
                        v-if="isAdQuery(button)"
                        type="border"
                        closable
                        color="red"
                        @on-close="delQuery(button)">
                        <span class="nav-btn-title">
                            <span v-if="button.title" class="nav-btn-title">
                                {{button.title}}
                            </span>
                        </span>
                    </Tag>
                    <div slot="content">
                        <div 
                            v-for="row in button.child"
                            :key="row.id">
                            {{ row.title }}
                            <span v-if="row.child">
                                :
                            </span>
                            <span 
                                v-for="child in row.child"
                                :key="child.id">
                                {{ child.title }}
                            </span>
                        </div>
                    </div>
                </Tooltip>
            </div>
        </Button-group>
        <div class="filter-body-container">
            <!-- 条件过滤部分 -->
            <mFilterBasic
                :filterData="basicFilterData"
                :queryData="queryData"
                :currentAdId="currentAdId"
                :currentAdBtn="currentAdBtn"
                :defaultGlobalOption="defaultGlobalOption"
                :defaultRowOption="defaultRowOption"
                @queryChange="queryChange">
            </mFilterBasic>
            <!-- 高级选项区域 -->
            <Row class="flexCenter selector-line" v-show="advancedFilterData.length > 0">
                <Col span="2">
                    <h3>{{ option.advancedText }}</h3>
                </Col>
                <Col span="20"> 
                    <Button-group class="btn-container" size="small">
                        <Button 
                            v-for="rowBtn in advancedFilterData"
                            :key="rowBtn.id"
                            @click="showLayer(rowBtn.id)"
                            class="blank-space query-btn">
                            {{ rowBtn.title }}
                            <Icon type="chevron-down"></Icon>
                        </Button>
                    </Button-group>
                </Col>
            </Row>
        </div>
        <!-- 高级选项layer -->
        <mLayer
            @on-cancel="layerCancel"
            v-model="layerStatus"
            :titleText="currentAdBtn ? currentAdBtn.title : ''"
            top="150">
            <mFilterBasic
                :filterData="currentAdFilterData"
                :queryData="queryData"
                :currentAdId="currentAdId"
                :currentAdBtn="currentAdBtn"
                :defaultGlobalOption="defaultGlobalOption"
                :defaultRowOption="defaultRowOption"
                @queryChange="queryChange">
            </mFilterBasic>
            <div slot="footer"></div>
        </mLayer>
    </div>
</template>
<script>
import _ from 'lodash'
import { deepCopy } from 'utils/utils'
import mixin from '../mixin'
import Mutation from 'store/Mutation'

// 默认全局设置
const defaultGlobalOption = {
    multiSelectText: '+多选',
    multiConfirmText: '确定',
    multiCancelText: '取消',
    advancedText: '高级选项',
    regionConfirmText: '确定',
    moreText: '更多',
    lessText: '收起',
    showAllRowText: '显示全部',
    showPartRowText: '收起',
    countPerRow: 10,
    rowCount: 2,
    noDataText: '暂无数据'
}

// 默认行设置
const defaultRowOption = {
    // 是否可以多选
    multiSelect: true,
    // 是否是高级选项
    advancedSelect: false,
    // 是否是区域
    isRegion: false,
    // 区域单位
    prependText: '￥'
}

export default{
    mixins: [mixin],
    data () {
        return {
            // filterBody数据
            bodyData: [],
            // 当前query
            queryData: [],
            // 当前点击高级选项btnId（filterBasic与filterBody公用）
            currentAdId: '',
            // layer显示状态
            layerStatus: false,
            defaultGlobalOption: defaultGlobalOption,
            defaultRowOption: defaultRowOption
        }
    },
    computed: {
        // 全局设置
        option (state) {
            return {...defaultGlobalOption, ...this.globalOption}
        },
        // 普通filterData
        basicFilterData () {
            let data = deepCopy(this.bodyData)
            return _.filter(data, (o) => {
                return !o.option.advancedSelect
            })
        },
        // 高级选项filterData
        advancedFilterData () {
            let data = deepCopy(this.bodyData)
            return _.filter(data, (o) => {
                return o.option.advancedSelect
            })
        },
        // 当前选中高级选项btn
        currentAdBtn () {
            if (!this.currentAdId) {
                return null
            }
            let data = deepCopy(this.advancedFilterData)
            let curAdBtn = _.filter(data, (o) => {
                return o.id === this.currentAdId
            })[0]
            return {
                id: curAdBtn.id,
                title: curAdBtn.title
            }
        },
        currentAdFilterData () {
            return this._getFilterDataByAdId(this.currentAdId)
        }
    },
    watch: {
        queryData (val) {
            let queryData = deepCopy(val)
            queryData = this.changeQueryDataToPostData(queryData)
            this.$store.commit(Mutation.SET_COMPONENT_DATA, {id: this.id, data: queryData})
        }
    },
    methods: {
        // 删除选项
        delQuery (button) {
            let querys = _.filter(this.queryData, (o) => {
                return o.id !== button.id
            })
            this.queryData = querys
        },
        // 是否为高级选项
        isAdQuery (button) {
            if (button.child[0] && button.child[0].child) {
                return true
            } else {
                return false
            }
        },
        showLayer (adId) {
            this.currentAdId = adId
            this.layerStatus = true
        },
        layerCancel () {
            this.currentAdId = ''
        },
        // 通过btnId获取对应的高级选项内容
        _getFilterDataByAdId (id) {
            if (!id) {
                return null
            }
            let data = deepCopy(this.advancedFilterData)
            let result = _.filter(data, (o) => {
                return o.id === id
            })[0]
            return result ? result.child : null
        },
        queryChange (queryData) {
            this.queryData = queryData
        },
        // 将queryData转为postData {'col_1': ['','']}
        changeQueryDataToPostData (data) {
            let result = {}
            if (data && data.length > 0) {
                data.forEach((query) => {
                    let tempArr = []
                    query.child.forEach((child) => {
                        tempArr.push(child.id)
                    })
                    result[query.id] = tempArr
                })
            }
            return result
        },
        getFilterData () {
            this.getData('bodyData', (data, err) => {
                if (data) {
                    this.bodyData = data.rows
                } else {
                    this.bodyData = []
                }
                this.queryData = []
            })
        },
        watchValuesChanged () {
            this.getFilterData()
        }
    }
}
</script>
<style scoped>
.filter-container{
    position: relative;
}
.load-container{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(55,55,55,.3);
}
.nav-btn {
    display: inline;
}
.nav-btn-title{
    color: black;
}
.nav-btn-text{
    color: red;
}
.nav-btn-text:not(:last-child){
    margin-right: 10px
}

.filter-body-container{
    padding: 12px 24px;
    border: 2px solid #eeeeee;
}
.flexCenter {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px dashed #dddddd;
}
.blank-space {
    margin-right: 10px;
}
</style>