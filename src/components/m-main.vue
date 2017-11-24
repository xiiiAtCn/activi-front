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
                        <Breadcrumb-item
                            v-for="(item, index) in define.title"
                            href=""
                            :key="index">
                            {{item}}
                        </Breadcrumb-item>
                    </Breadcrumb>
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
                               :content="item.ui_content" :form="item.ui_form"></component>
                </transition-group>
                <transition name="fade" mode="out-in" tag="div" v-else>
                    <component :key="item.ui_id" :is="item.ui_type" :uid="item.ui_id"
                               v-for="item in content" :define="item.ui_define"
                               :content="item.ui_content" :form="item.ui_form"></component>
                </transition>
            </form>
            <ButtonGroup 
                v-show="btnArr.length > 0"
                class="form-button-group">
                <Dropdown 
                    trigger="click">
                    <Button>
                        确认
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <DropdownMenu slot="list" class="drop-down-container">
                        <template
                            v-for="(btn, index) in btnArr">
                            <Button
                                :type="btn.type"
                                class="submit-btn"
                                :key="index"
                                @click="btnClick(btn.action)">
                                {{ btn.text }}
                            </Button>
                        </template>
                    </DropdownMenu>
                </Dropdown>
            </ButtonGroup>
        </div>
        <Back-top></Back-top>
    </div>
</template>
<script>
    import fetch from '../utils/DefineFetcher'
    import router from '../router'
    import {dispatch} from '../utils/actionUtils'
    import { FETCH_FORM_DATA, SUBMIT_FORM_DATA} from 'store/Action'
    import _ from 'lodash'
    import util from 'util'

    import { deepCopy } from 'utils/utils'

    const BtnType = {
        submit: 'submit',
        save: 'save'
    }
    export default {
        router,
        data () {
            return {
                meta: null,
                errorMessage: null,
                define: {},
                content: [],
                dataUrl: null
            }
        },
        computed: {
            res: function () {
                return this.$store.state.pageData.data.hidden
            },
            leftMenu: function () {
                return this.define.leftMenu ? this.define.leftMenu : {}
            },
            btnArr () {
                return _.get(this.define, 'buttons', [])
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
                        let url = this.define.data_url
                        this.$store.dispatch(FETCH_FORM_DATA, {url: url})
                    }
                })
            },
            dataUrl(newUrl) {
                this.$store.dispatch(FETCH_FORM_DATA, {url: newUrl})
            },
            'define.status_url'() {
                if (this.define.status_url) {
                    this.$store.dispatch('putStatus',  this.define.status_url)
                }
            }
        },
        methods: {
            edit: function (url) {
                dispatch(url)
            },
            back: function () {
                this.$router.go(-1)
            },
            backUrl: function (url) {
                dispatch(url)
            },
            btnClick (action) {
                dispatch(action)
                // this.$store.dispatch(SUBMIT_FORM_DATA, {form: 'form', requestUrl: action.url})
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
                        document.title = vm.define.title || '表单'
                    })
                }
            })
        },
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

    .form-button-group {
        float: right;
    }
    .form-button-group .drop-down{
        min-width: 0;
        text-align: center;
    }
    .form-button-group .submit-btn{
        margin-bottom: 10px;
        width: 80%;
    }
    .form-button-group .drop-down-container{
        text-align: center;
    }
</style>
