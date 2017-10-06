<template>
  <div>
    <h2>boTree</h2>
    <span class="f-size">选择分类：</span>
    <Select v-model="model" style="width:140px" @on-change="changeValue">
      <Option v-for="item in selectAry" :value="item.value" :key="item">{{ item.title }}</Option>
    </Select>
    <!--<template v-for="item in items">-->
    <!--<li>{{ item.message }}</li>-->
    <!--<li>&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;</li>-->
    <!--</template>-->
    <Tree :data="baseData" @on-select-change="selectNode" @on-toggle-expand="expandClick" @on-check-change="checkData"></Tree>
    <div v-if="hasError" class="item-error">{{errorMessage}}</div>
  </div>
</template>
<script>
  //  import Vue from 'vue'
  import _ from 'lodash'
  import { dispatch } from '../../utils/skipUtils'
  //  import { default as fetch, post } from '../../utils/DefineFetcher'
  //  import bus from '../../router/bus'

  export default {
    name: 'v-boTree',
    props: ['define', 'content'],
    data () {
      return {
        hasError: false,
        errorMessage: '',
        model: '',
        objAll: {},
        baseData: [
          {
            title: '初始节点',
            children: [
              {
                title: '分类1'
//                        children: [
//                            {
//                                title: '分类1-1',
//                            },
//                            {
//                                title: '分类1-2',
//                            }
//                        ]
              },
              {
                title: '分类1'
//                        children: [
//                            {
//                                title: '分类1-1',
//                            },
//                            {
//                                title: '分类1-2',
//                            }
//                        ]
              }
            ]
          }
        ],
        stockCenter: {
          fl1: [
            {
              title: '分类1'
//                        children: [
//                            {
//                                title: '分类1-1',
//                            },
//                            {
//                                title: '分类1-2',
//                            }
//                        ]
            },
            {
              title: '分类1'
//                        children: [
//                            {
//                                title: '分类1-1',
//                            },
//                            {
//                                title: '分类1-2',
//                            }
//                        ]
            }
          ],
          fl2: {
            title: '分类2'
//                        children: [
//                            {
//                                title: '分类2-1',
//                            },
//                            {
//                                title: '分类2-2',
//                            },
//                            {
//                                title: '分类2-3',
//                            }
//                        ]
          }
        },
        selectAry: [
          {
            value: 'fl1',
            title: '分类1'
          },
          {
            value: 'fl2',
            title: '分类2'
          }
        ]
      }
    },
    watch: {
      define (newVal) {
        this.baseData = _.cloneDeep(newVal)
      }
    },
    computed: {
      data_url () {
        return _.get(this.define, 'data_url', '')
      },
      multiple () {
        return _.get(this.define, 'multiple', false)
      },
      clearable () {
        return _.get(this.define, 'clearable', false)
      },
      filterable () {
        return _.get(this.define, 'filterable', false)
      },
      remote () {
        return _.get(this.define, 'remote', false)
      },
      loadingText () {
        return _.get(this.define, 'loadingText', '加载中')
      },
      notFoundText () {
        return _.get(this.define, 'notFoundText', '无匹配数据')
      },
      returnWithLabel () {
        return _.get(this.define, 'returnWithLabel', false)
      },
      placement () {
        return _.get(this.define, 'placement', 'bottom')
      },
      name () {
        return _.get(this.define, 'name', '')
      },
      uid () {
        return _.get(this.define, 'ui_id', 'm-boTree?' + Date.now())
      },
      storeValue: {
        get () {
          return _.get(this.$store.state.data, this.name, '')
        },
        set (value) {
          this.$store.commit('updateItem', {name: this.name, value: value})
        }
      }
    },
    mounted () {
//            if(this.data_url ==='') {
//                this.optionData = _.get(this.define, 'rows', [])
//            } else {
//                this.$http.get(this.data_url).then(res => JSON.parse(res.bodyText)).then(obj => {
//                    this.optionData = obj.optionData
//                })
//            }
//            bus.$on('forceValid', () => {
//                this.valid()
//            })
    },
    methods: {
      getMeta: function (action) {
        dispatch(action)
      },
      changeValue: function (value) {
        console.log('选择的值：', value)
        let obj = this.stockCenter
        this.baseData[0].children = []
        if (obj[value] instanceof Array) {
          this.baseData[0].children = obj[value]
        } else {
          this.baseData[0].children.push(obj[value])
        }
//                console.log('tree值：',this.objAll.indexAry);
//                this.baseData = this.objAll.indexAry;
      },
      selectNode: function (indexAry) {
        console.log('当前节点：', indexAry)
//                if (indexAry.length === 0){
//                    console.log("重复点击")
//                } else if (!indexAry[0].children){
//                    this.$Message.error("没有子节点了！");
//                    this.model = ''
//                } else {
//                    console.log('当前选择节点：',indexAry);
//                    let ary = [];
//                    indexAry[0].children.forEach(function (item,index) {
//                        ary.push({
//                            value: item.title,
//                            title: item.title
//                        })
//                    });
//                    let objAll = {
//                        ary: ary,
//                        indexAry: indexAry
//                    };
//                    this.objAll = objAll;
//                    this.selectAry = objAll.ary;
//                }
      },
      expandClick: function (expandObj) {
//                this.baseData = '';
//                console.log('延伸节点',expandObj.title);
//                let defaultNode = {
//                    title: expandObj.title,
//                    checked: expandObj.checked,
//                    expand: expandObj.expand,
//                    children: expandObj.children[0]
//                };
//                let newAry = [];
//                newAry.push(defaultNode);
//                this.baseData = newAry
      },
      checkData: function (checkData) {
//                console.log('选中的：',checkData)
      }
    }
    //            valid() {
//                if(!this.readonly) {
//                    if(this.storeValue === '') {
//                        this.errorMessage = '请选择一项'
//                        this.hasError = true;
//                    }
//                    this.$store.dispatch("reportValid", {'id': this.uid, 'result': !this.hasError});
//                }
//
//        }
  }
</script>
<style>
  h2 {
    margin-bottom: 8px;
  }

  .btn {
    margin-right: 2px;
  }

  .make-out-l {
    margin-left: 20px;
  }

  .make-out-t {
    margin-top: 10px;
  }

  .ivu-tree-title {
    font-size: 14px;
  }

  .f-size {
    font-size: 14px;
  }
</style>
