<template>
    <div class="basic-container">
        <transition-group name="selector-row" mode="out-in">
            <!-- 正常选择区域 -->
            <Row 
                v-for="(row, index) in normalFilter" 
                v-show="index < option.rowCount || showAllRow"
                :key="row.id" 
                class="flexCenter selector-line">
                <Col span="2">
                    <h3>{{row.title}}</h3>
                </Col>
                <Col span="20">  
                    <Button-group 
                        v-show="currentMultiRowId !== row.id">
                        <transition-group name="query-btn">
                            <Button 
                                v-for="(btn, index) in row.child" 
                                v-show="index < option.countPerRow || showAllRowIdArr.includes(row.id)"
                                :key="btn.id" 
                                @click="queryBtnClick(row, btn)"
                                :type="isSelected(row.id, btn.id) ? 'info' : 'ghost'" 
                                class="blank-space query-btn"
                                size="small">
                                {{ btn.title }}
                            </Button>
                        </transition-group>
                    </Button-group>
                    <div 
                        v-if="row.option.multiSelect"
                        v-show="currentMultiRowId === row.id"
                        class="multi-container">
                        <Row>
                            <CheckboxGroup v-model="multiSelectModel">
                                <Checkbox
                                    v-for="btn in row.child" 
                                    :key="btn.id" 
                                    :label="btn.id"
                                    class="blank-space">
                                    {{ btn.title }}
                                </Checkbox>
                            </CheckboxGroup>
                        </Row>
                        <Row class="multi-btn-container">
                            <Button-group
                                size="small">
                                <Button 
                                    type="error"
                                    :disabled="multiSelectModel.length === 0"
                                    @click="confirmMultiType(row)">
                                    {{ option.multiConfirmText }}
                                </Button>
                                <Button @click="cancelMultiType">{{ option.multiCancelText }}</Button>
                            </Button-group>
                        </Row>
                    </div>
                </Col>
                <Col span="2">
                    <Button-group class='option-btn-container' size="small">
                        <Button 
                            v-if="row.option.multiSelect"
                            @click="changeMultiType(row)">
                            {{ option.multiSelectText }}
                        </Button>
                        <Button
                            v-if="row.child.length > option.countPerRow"
                            @click="moreOrLess(row.id)">
                            <span v-if="!showAllRowIdArr.includes(row.id)">{{ option.moreText }}</span>
                            <span v-else>{{ option.lessText }}</span>
                        </Button>
                    </Button-group>
                </Col>
            </Row>
            <!-- 区间选择区域 -->
            <Row 
                v-for="(row, index) in regionFilter" 
                v-show="(normalFilter.length < option.rowCount && index < option.rowCount - normalFilter.length) || showAllRow"
                :key="row.id" 
                class="flexCenter selector-line region-line">
                <Col span="2">
                    <h3>{{row.title}}</h3>
                </Col>
                <Col span="20">  
                    <Form ref="regionForm" :model="regionForm" :rules="regionRule" inline>
                        <FormItem prop="smallNum" class="form-item">
                            <Input @on-blur="regionInputChange('smallNum')" number v-model="regionForm.smallNum">
                                <span slot="prepend" v-if="row.option.prependText">{{ row.option.prependText }}</span>
                            </Input>
                        </FormItem>
                        <span>-</span>
                        <FormItem prop="bigNum" class="form-item">
                            <Input @on-blur="regionInputChange('bigNum')" number v-model="regionForm.bigNum">
                                <span slot="prepend" v-if="row.option.prependText">{{ row.option.prependText }}</span>
                            </Input>
                        </FormItem>
                        <Button @click="queryBtnClick(row)">{{ option.regionConfirmText }}</Button>
                    </Form>
                </Col>
            </Row>
        </transition-group>
        <Button
            v-if="normalFilter.length + regionFilter.length > option.rowCount"
            @click="showAllOrNot"
            type="info"
            class="showAllBtn2"
            size="small">
            <span v-if="!showAllRow">
                {{ option.showAllRowText}}
            </span>
            <Icon
                v-if="!showAllRow"
                type="arrow-down-b"></Icon>
            <span v-if="showAllRow">
                {{ option.showPartRowText}}
            </span>
            <Icon
                v-if="showAllRow"
                type="arrow-up-b"></Icon>
        </Button>
        <div 
            v-show=" !filterData || filterData.length === 0"
            class="no-data-container">
            {{ option.noDataText }}
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import { deepCopy } from 'utils/utils'

export default {
    props: {
        // 显示用数据
        /**
         * [
         *      {
         *          title: '',  //  每一行显示标题
         *          id: '',     //  该行条件id
         *          child: [ //  该行显示的条件
         *              {
         *                  id: '',
         *                  title: ''
         *              }
         *          ],
         *          option: {// 自定义设置
         *              multiSelect: true || false, // 能否多选
         *              isRegion: true || false, // 是否为区间
         *              prependText: '$'    // 区间选择时，单位文本
         *          }
         *      },
         * ]
         *
         */
        filterData: {
            type: Array,
            default () {
                return []
            }
        },
        queryData: {
            type: Array,
            default () {
                return []
            }
        },
        // 组件设置
        globalOption: {
            type: Object,
            default () {
                return {}
            }
        },
        defaultGlobalOption: {
            type: Object,
            default () {
                return {}
            }
        },
        defaultRowOption: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        let self = this
        return {
            // 当前多选行
            currentMultiRowId: '',
            multiSelectModel: [],
            // 区间选项数据
            regionForm: {
                bigNum: 0,
                smallNum: 0
            },
            regionRule: {
                smallNum: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (!Number.isInteger(value)) {
                                callback(new Error('请输入数字'))
                            } else if (value < 0) {
                                callback(new Error('请输入正数'))
                            } else if (value - self.regionForm.bigNum > 0) {
                                callback(new Error('不能大于大值'))
                            } else {
                                callback()
                            }
                        }
                    }
                ],
                bigNum: [
                    {
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (!Number.isInteger(value)) {
                                callback(new Error('请输入数字'))
                            } else if (value < 0) {
                                callback(new Error('请输入正正数'))
                            } else if (value - self.regionForm.smallNum < 0) {
                                callback(new Error('不能小于小值'))
                            } else {
                                callback()
                            }
                        }
                    }
                ]
            },
            // 显示全部行id
            showAllRowIdArr: [],
            showAllRow: false
        }
    },
    computed: {
        // 全局设置
        option (state) {
            return {...this.defaultGlobalOption, ...this.globalOption}
        },
        // 正常数据
        normalFilter () {
            let data = deepCopy(this.filterData)
            let result = _.filter(data, (o) => {
                return !o.option.isRegion
            })
            return this._addDefaultOption(result)
        },
        // 区间选择数据
        regionFilter () {
            let data = deepCopy(this.filterData)
            let result = _.filter(data, (o) => {
                return o.option.isRegion
            })
            return this._addDefaultOption(result)
        },
        // {'123': [], '456': []}
        currentSelectedObj () {
            const queryData = deepCopy(this.queryData)
            let result = {}
            for (let query of queryData) {
                let tempIdArr = []
                for (let child of query.child) {
                    tempIdArr.push(child.id)
                }
                if (result[query.id]) {
                    result[query.id] = result[query.id].concat(tempIdArr)
                } else {
                    result[query.id] = tempIdArr
                }
            }
            console.log('currentSelectedObj', result)
            return result
        },
    },
    methods: {
        /**
         * 添加查询条件
         * 1. 如果已经选中则取消选中
         * 2.
         */
        queryBtnClick (rowData, ...btnData) {
            let option = rowData.option
            let result = this._filterQuery(rowData)
            // 单选下 点击选中的 删除此query
            if (btnData.length === 1 && this.isSelected(rowData.id, btnData[0].id) && !option['isRegion']) {

            } else {
                if (option['isRegion']) {
                    let outerValid = null
                    this.$refs['regionForm'][0].validate((valid) => {
                        outerValid = valid
                    })
                    if (!outerValid) {
                        return
                    }
                    btnData = [{...rowData.child[0], ...this.regionForm, ...{title: this.regionForm.smallNum + '-' + this.regionForm.bigNum}}]
                }
                let query = {
                    id: rowData.id,
                    title: rowData.title,
                    child: btnData
                }
                // 添加的为高级选项按钮
                if (this.currentAdBtn) {
                    let index = result.findIndex((item) => {
                        return item.id === this.currentAdId
                    })
                    let child = []
                    if (index !== -1) {
                        child = result.splice(index, 1)[0].child
                    }
                    query = {...this.currentAdBtn, child: [query].concat(child)}
                }
                result.push(query)
            }
            this.$emit('queryChange', result)
        },
        /**
         * 过滤当前query
         * 1. 普通的情况下，过滤掉与添加btn的行id相同的数据
         * 2. 高级选项情况下， 过滤掉与添加btn pId相同且行id相同的数据
         */
        _filterQuery (rowData) {
            let result = []
            let queryData = deepCopy(this.queryData)
            // 高级选项
            if (this.currentAdId) {
                for (let query of queryData) {
                    if (query.id === this.currentAdId) {
                        let child = _.filter(query.child, (o) => {
                            return o.id !== rowData.id
                        })
                        query.child = child
                        if (child.length > 0) {
                            result.push(query)
                        }
                    } else {
                        result.push(query)
                    }
                }
            } else {
                result = _.filter(this.queryData, (o) => {
                    return o.id !== rowData.id
                })
            }
            return result
        },
        /**
         *  改变当前多选模式
         *  1.如果当前行id与currentMultiRowId
         *      相同  清空currentMultiRowId 清空multiSelectModel
         *      不同  currentMultiRowId = 当前行id multiSelectModel赋值
         */
        changeMultiType (rowData) {
            if (this.currentMultiRowId === rowData.id) {
                this.currentMultiRowId = ''
                this.multiSelectModel = []
            } else {
                this.currentMultiRowId = rowData.id
                let rowQuery = this.getSelectedInRow(rowData.id)
                if (rowQuery) {
                    for (let i of rowQuery.child) {
                        this.multiSelectModel.push(i.id)
                    }
                } else {
                    this.multiSelectModel = []
                }
            }
        },
        /**
         * 找出当前行选中的数据
         */
        getSelectedInRow (rowId) {
            let queryData = deepCopy(this.queryData)
            if (this.currentAdId) {
                queryData = _.filter(queryData, (o) => {
                    return o.id === this.currentAdId
                })[0].child
            }
            return _.filter(queryData, (query) => {
                return rowId === query.id
            })[0]
        },
        /**
         * 多选模式下添加query
         * 1.生成btn数组
         * 2.调用addQuery
         * 3.调用cancelMultiType清除多选状态
         */
        confirmMultiType (rowData) {
            let btnArr = _.filter(rowData.child, (o) => {
                return this.multiSelectModel.includes(o.id)
            })
            this.queryBtnClick(rowData, ...btnArr)
            this.cancelMultiType()
        },
        /**
         * 取消多选模式
         * 1.清空multiSelectModel
         * 2.清空currentMultiRowId
         */
        cancelMultiType () {
            this.multiSelectModel = []
            this.currentMultiRowId = ''
        },
        // 添加默认值
        _addDefaultOption (filterData) {
            let data = [...filterData]
            for (let row of data) {
                row.option = {...this.defaultRowOption, ...row.option}
            }
            return data
        },
        regionInputChange (type) {
            if (type === 'bigNum') {
                this.$refs['regionForm'][0].validateField('smallNum')
            }
            if (type === 'smallNum') {
                this.$refs['regionForm'][0].validateField('bigNum')
            }
        },
        // 是否被选中
        isSelected (rowId, btnId) {
            if (this.currentSelectedObj[rowId]) {
                let arr = this.currentSelectedObj[rowId]
                if (arr.includes(btnId)) {
                    return true
                } else {
                    return false
                }
            }
            return false
        },
        /**
         * 显示更多
         * 如果有当前行id 删除，没有添加
         */
        moreOrLess (rowId) {
            if (this.showAllRowIdArr.includes(rowId)) {
                let set = new Set(this.showAllRowIdArr)
                set.delete(rowId)
                this.showAllRowIdArr = [...set]
            } else {
                this.showAllRowIdArr.push(rowId)
            }
        },
        // 显示全部
        showAllOrNot () {
            this.showAllRow = !this.showAllRow
        }
    },
}
</script>
<style scoped>
.flexCenter {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px dashed #dddddd;
}
.blank-space {
    margin-right: 10px;
}
.filter-container {
    padding: 12px 24px;
    border: 2px solid #eeeeee;
}
.option-btn-container{
    float: right;
}
.multi-btn-container{
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
}
.query-btn{
    margin-top: 5px;
    margin-bottom: 5px;
}

.tab-content-item{
    border: 1px solid #999;
    position: relative;
    top: -1px;
    z-index: 0;
}
.inner-btn{
    margin: 10px 10px 10px 0
}
.trig-btn-current {
    border: 1px solid #999 !important;
    border-bottom: 1px solid white !important; 
    z-index: 2;
}
.region-line {
    padding-top: 20px;
    padding-bottom: 20px;
}
.form-item {
    margin-bottom: 0;
}
.showAllBtn{
    float: right;
    margin-right: -20px;
    margin-top: -50px;
    width: 20px;
    border: 1px solid red;
    padding: 3px;
    cursor: pointer;
}
.selector-row-enter-active, .selector-row-leave-active{
    transition: all .5s;
}
.selector-row-enter, .selector-row-leave-to{
    opacity: 0;
}

.query-btn-enter-active, .query-btn-leave-active{
    transition: all .5s;
}
.query-btn-enter, .query-btn-leave-to{
    opacity: 0;
}

.no-data-container{
    text-align: center;
    font-size: 16px;
}
.showAllBtn2{
    margin: 0 auto;
    display: block;
}
</style>