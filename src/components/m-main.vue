<template>
    <div class="container90">
        <div v-if="define.title">
            <Row>
                <Col span="12" style="display: flex; justify-content: flex-start; align-items: flex-end">
                <Breadcrumb>
                    <Breadcrumb-item v-if="typeof define.title === 'string'">
                        <span v-text="define.title"></span>
                    </Breadcrumb-item>
                    <Breadcrumb v-if="define.title instanceof Array">
                        <Breadcrumb-item v-for="item in define.title" href="">
                            {{item}}

                        </Breadcrumb-item>
                    </Breadcrumb>
                    <!--<template v-if="typeof define.subtitle === 'string'">-->
                    <!--<span v-text="define.subtitle"></span>-->
                    <!--</template>-->
                    <!--<template v-else>-->
                    <!--<Breadcrumb-item v-for="item in define.subtitle" href="">{{item}}</Breadcrumb-item>-->
                    <!--</template>-->
                </Breadcrumb>
                </Col>
                <Col span="12" class="pull-right">
                <transition name="fade" mode="out-in">
                    <Button type="primary" v-if="define.editUrl" shape="circle" @click="edit(define.editUrl)">
                        <Icon type="document-text"></Icon>
                        编辑

                    </Button>
                </transition>
                <transition name="fade" mode="out-in">
                    <Button type="ghost" v-if="define.backUrl" shape="circle" @click="backUrl(define.backUrl)">
                        <Icon type="reply"></Icon>
                        返回

                    </Button>
                    <Button type="ghost" shape="circle" @click="back" v-else>
                        <Icon type="reply"></Icon>
                        返回

                    </Button>
                </transition>
                </Col>
            </Row>
            <hr/>
        </div>
        <div v-if="!define.title"></div>
        <div>
            <form class="ivu-form ivu-form-label-right">
                <transition-group name="fade" mode="out-in" tag="div" v-if="content.length > 1">
                    <component :key="item.ui_id" :is="item.ui_type" :uid="item.ui_id"
                               v-for="item in content" :define="item.ui_define"
                               :content="item.ui_content"></component>
                </transition-group>
                <transition name="fade" mode="out-in" tag="div" v-else>
                    <component :key="item.ui_id" :is="item.ui_type" :uid="item.ui_id"
                               v-for="item in content" :define="item.ui_define"
                               :content="item.ui_content"></component>
                </transition>
            </form>
        </div>
        <Back-top></Back-top>
    </div>
</template>
<script>
    import store from '../vuex/store'
    import fetch from '../utils/DefineFetcher'
    import router from '../router'

    import {dispatch} from '../utils/skipUtils'
    import * as _ from 'lodash'

    export default {
        store,
        router,
        methods: {
            edit: function (url) {
                dispatch(url)
            },
            back: function () {
                this.$router.go(-1)
            },
            backUrl: function (url) {
                dispatch(url)
            }
        },
        computed: {
            res: function () {
                return store.state.pageData.data.hidden
            },
            leftMenu: function () {
                return this.define.leftMenu ? this.define.leftMenu : {}
            }
        },
        components: {
            mTable: function (resolve) {
                require(['./m-table.vue'], resolve)
//        require(['./m-table-shim.js'], resolve)
            },
            mTableF: function (resolve) {
                require(['./m-table-f.vue'], resolve)
                require(['./m-table-f-shim.js'], resolve)
            },
            mTab: function (resolve) {
                require(['./m-tab.vue'], resolve)
            },
            mMenu: function (resolve) {
                require(['./m-menu.vue'], resolve)
            },
            mSection: function (resolve) {
                require(['./m-section.vue'], resolve)
            },
            mRow: function (resolve) {
                require(['./base/m-row.vue'], resolve)
            },
            mCard: function (resolve) {
                require(['./m-card.vue'], resolve)
            },
            mBoMeta: function (resolve) {
                require(['./m-boMeta.vue'], resolve)
            },
            mBillMeta: function (resolve) {
                require(['./m-billMeta.vue'], resolve)
            },
            mFilter: function (resolve) {
                require(['./m-filter.vue'], resolve)
            },
            mConfirm: function (resolve) {
                require(['./m-confirm.vue'], resolve)
            },
            mListView: function (resolve) {
//                require(['./m-listView.vue'], resolve)
                require(['./m-detailView-shim.js'], resolve)
            },
//            mBoTree: function (resolve) {
//                require(['./base/m-boTree.vue'], resolve)
//            },
            mSteps: function (resolve) {
                require(['./base/m-steps.vue'], resolve)
            },
            mListTable: function (resolve) {
                require(['./m-listTable.vue'], resolve)
            },
            mListResult: function (resolve) {
                require(['./m-listResult.vue'], resolve)
            },
            mListTask: function (resolve) {
                require(['./m-listTask.vue'], resolve)
            },
            mDeliverables: function (resolve) {
                require(['./m-deliverables.vue'], resolve)
            },
            mTree: function (resolve) {
                require(['./m-tree.vue'], resolve)
            },
            mLayout: function (resolve) {
                require(['./m-layout.vue'], resolve)
            },
            mIsBuilding: function (resolve) {
                require(['./m-isBuilding.vue'], resolve)
            },
            mProjectSummary: function (resolve) {
                require(['./businessModule/project/m-projectSummary.vue'], resolve)
            },
            mTabMapMonitor: function (resolve) {
                require(['./businessModule/monitor/m-tabMapMonitor.vue'], resolve)
            },
            mWorkCenter: function (resolve) {
                require(['./businessModule/workCenter/m-workCenter.vue'], resolve)
            },
            mFilterPrice: function (resolve) {
                require(['./m-filterPrice'], resolve)
            },
            mPriceTable: function (resolve) {
                require(['./m-priceTable'], resolve)
            },
            mProductPrice: function (resolve) {
                require(['./businessModule/m-productPrice'], resolve)
            }
        },
        data () {
            return {
                meta: null,
                errorMessage: null,
                define: {},
                content: [],
                dataUrl: null
            }
        },
        watch: {
            $route () {
                this.meta = null
                console.log('this.$route.query', this.$route.query)
                let query = this.$route.query.url
                fetch(query, (err, post) => {
                    if (err) {
                        this.errorMessage = err.message
                    } else {
                        console.log('post', post)
                        this.meta = post
                        this.define = _.get(post, 'ui_define', {})
                        this.content = _.get(post, 'ui_content', [])
                        document.title = _.get(this.define, 'title', '')
                        store.dispatch('initValidStatus')
                        store.dispatch('clearData', {})
                        let url = this.define.data_url ? this.define.data_url : query
                        store.dispatch('putData', {'url': url})
                    }
                })
            },
            dataUrl: function (newUrl, oldUrl) {
                store.dispatch('putData', {'url': newUrl})
            },
            'define.status_url': function (to, from) {
                if (this.define.status_url) {
                    store.dispatch('putStatus', {'url': this.define.status_url})
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            fetch(to.query, (err, post) => {
                if (err) {
                    console.log('main error:', err.message)
                    next(false)
                } else {
                    next(vm => {
                        vm.meta = post
                        vm.define = _.get(post, 'ui_define', {})
                        vm.content = _.get(post, 'ui_content', [])
                        vm.dataUrl = _.get(post, ['ui_define', 'data_url'], null)
                        document.title = vm.define.title
                    })
                }
            })
        }
    }
</script>

<style scoped>
    hr {
        margin-top: 10px;
        margin-bottom: 20px;
        /*border-color: #faf0f7;*/
        border: none;
        height: 1px;
        background-color: #e9eaec;
    }

    .flip-list-move {
        transition: transform 1s;
    }
</style>
