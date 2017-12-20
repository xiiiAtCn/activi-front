<template>
    <div class="container90">
        <div v-if="define.title">
            <Row>
                <Col span="20" style="display: flex; justify-content: flex-start; align-items: flex-end">
                <Breadcrumb  style="margin-right: 10px">
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

                <div class="btn-container-top-left" v-for="(item, sequence) in topLeft" :key="sequence">
                    <template name="fade" mode="out-in"  v-for="(btn, index) in item" >
                        <Poptip placement="bottom" v-if="btn && btn.child" :key="index">
                            <Button :type="btn.type || 'default'">
                                {{btn.text}}
                                <Icon type="arrow-down-b"></Icon>
                            </Button>
                            <div slot="content" style="padding: 0 14px;">
                                <div  v-for="(v, key) in btn.child" :key="key">
                                    <mButtonLayer v-if=" v.buttonType === 'layer-button' " :define="v" style="margin-bottom: 5px"></mButtonLayer>
                                    <mButtonIframe v-else-if="btn.buttonType === 'layer-iframe-button'" :define="btn"></mButtonIframe>
                                    <Button
                                        v-else
                                        :type="v.type || 'default'"
                                        :key="index"
                                        :size="v.size || 'default'"
                                        @click="btnClick(v)">
                                        {{ v.text }}
                                    </Button>
                                </div>
                            </div>
                        </Poptip>
                        <mButtonIframe v-else-if="btn.buttonType === 'layer-iframe-button'" :define="btn" :key="index"></mButtonIframe>
                        <Button
                            v-else
                            :type="btn.type || 'default'"
                            class="submit-btn"
                            :key="index"
                            :size="btn.size || 'default'"
                            @click="btnClick(btn)">
                            {{ btn.text }}
                        </Button>
                    </template>
                </div>
                </Col>
                <Col span="4" class="pull-right">
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
                    <component :key="index" :is="item.ui_type"
                               v-for="(item, index) in content" :define="item.ui_define"
                               :content="item.ui_content" :form="item.ui_form"></component>
                </transition-group>
                <transition name="fade" mode="out-in" tag="div" v-else>
                    <component :key="index" :is="item.ui_type"
                               v-for="(item, index) in content" :define="item.ui_define"
                               :content="item.ui_content" :form="item.ui_form"></component>
                </transition>
            </form>
            <hr/>
            <div class="btn-container-bottom-right" v-for="(item, sequence) in bottomRight" :key="sequence">
                <template name="fade" mode="out-in"  v-for="(btn, index) in item" >
                    <Poptip placement="bottom" v-if="btn && btn.child" :key="index">
                        <Button :type="btn.type || 'default'">
                            {{btn.text}}
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <div slot="content" style="padding: 0 14px;">
                            <div  v-for="(v, key) in btn.child" :key="key">
                                <mButtonLayer v-if=" v.buttonType === 'layer-button' " :define="v" style="margin-bottom: 5px"></mButtonLayer>
                                <mButtonIframe v-else-if="btn.buttonType === 'layer-iframe-button'" :define="btn"></mButtonIframe>
                                <Button
                                    v-else
                                    :type="v.type || 'default'"
                                    :key="index"
                                    :size="v.size || 'default'"
                                    @click="btnClick(v)">
                                    {{ v.text }}
                                </Button>
                            </div>
                        </div>
                    </Poptip>
                    <mButtonIframe v-else-if="btn.buttonType === 'layer-iframe-button'" :define="btn" :key="index"></mButtonIframe>
                    <Button
                        v-else
                        :type="btn.type || 'default'"
                        class="submit-btn"
                        :key="index"
                        :size="btn.size || 'default'"
                        @click="btnClick(btn)">
                        {{ btn.text }}
                    </Button>
                </template>
            </div>
        </div>
        <Back-top></Back-top>
    </div>
</template>
<script>
    import fetch from '../utils/DefineFetcher'
    import router from '../router'
    import {dispatch} from '../utils/actionUtils'
    import { FETCH_FORM_DATA} from 'store/Action'
    import _ from 'lodash'

    export default {
        router,
        data () {
            return {
                meta: null,
                errorMessage: null,
                define: {},
                content: [],
                dataUrl: null,
                topLeft:[],
                bottomRight:[]
            }
        },
        computed: {
            res: function () {
                return this.$store.state.pageData.data.hidden
            },
            leftMenu: function () {
                return this.define.leftMenu ? this.define.leftMenu : {}
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
                        this.handleButtonList(this.define.buttons)
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
        mounted () {
        },
        methods: {
            edit: function (url) {
                dispatch(url)
            },
            back: function () {
                this.clearButtonList()
                this.$router.go(-1)
            },
            backUrl: function (url) {
                this.clearButtonList()
                dispatch(url)
            },
            btnClick (btn) {
                dispatch(btn.action)
            },
            handleButtonList(list){
                this.topLeft={}
                this.bottomRight={}
                if(!list){
                    return
                }
                list.forEach((val)=>{
                    if(val.location === 'topLeft'){
                        if(!this.topLeft[val.groupNo]){
                            this.topLeft[val.groupNo]=[val]
                        }else{
                            this.topLeft[val.groupNo].push(val)
                        }
                    } else if(val.location === 'bottomRight'){
                        if(!this.bottomRight[val.groupNo]){
                            this.bottomRight[val.groupNo]=[val]
                        }else{
                            this.bottomRight[val.groupNo].push(val)
                        }
                    }
                })
            },
            clearButtonList(){
                this.topLeft={}
                this.bottomRight={}
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
                        console.log('beforeRouteEnter')
                        vm.handleButtonList(vm.define.buttons)

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

    .btn-container-bottom-right {
        float: right;
        margin-left: 10px;
        margin-bottom: 10px;
    }
    .btn-container-top-left{
        margin-left: 10px;
        margin-right: 10px;
    }
    .submit-btn{
        margin-right: 5px;
    }
</style>
