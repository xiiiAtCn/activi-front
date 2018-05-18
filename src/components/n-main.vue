<template>
    <div class="container90">
        <div>
            <Row>
                <Col span="20" style="display: flex; justify-content: flex-start; align-items: flex-end">
                    <Breadcrumb style="margin-right: 10px">
                        <Breadcrumb-item v-if="typeof caption === 'string' || !caption">
                            <h2 style="display: inline-block;">{{title}}</h2>
                            <h4 style="display: inline-block; margin-left: 20px;">{{subTitle}}</h4>
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
                        <template name="fade" mode="out-in" v-for="(btn, index) in item">
                            <Poptip placement="bottom" v-if="btn && btn.child" :key="index">
                                <Button :type="btn.type || 'default'">
                                    {{btn.text}}
                                    <Icon type="arrow-down-b"></Icon>
                                </Button>
                                <div slot="content" style="padding: 0 14px;">
                                    <div v-for="(v, key) in btn.child" :key="key">
                                        <mButtonLayer v-if=" v.buttonType === 'layer-button' " :define="v"
                                                      style="margin-bottom: 5px"></mButtonLayer>
                                        <mButtonIframe v-else-if="btn.buttonType === 'layer-iframe-button'"
                                                       :define="btn"></mButtonIframe>
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
                            <mButtonIframe v-else-if="btn.buttonType === 'layer-iframe-button'" :define="btn"
                                           :key="index"></mButtonIframe>
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
        </div>
        <div v-if="!define.title"></div>
        <hr v-if="define.form"/>
        <div>
            <slot name="form">
                <template v-if="define.form">
                    <Card>
                        <Form>
                            
                        </Form>
                    </Card>
                </template>
            </slot>
            <div class="btn-container-bottom-right" v-for="(item, sequence) in bottomRight" :key="sequence">
                <template name="fade" mode="out-in" v-for="(btn, index) in item">
                    <Poptip placement="bottom" v-if="btn && btn.child" :key="index">
                        <Button :type="btn.type || 'default'">
                            {{btn.text}}
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <div slot="content" style="padding: 0 14px;">
                            <div v-for="(v, key) in btn.child" :key="key">
                                <Button
                                        :type="v.type || 'default'"
                                        :key="index"
                                        :size="v.size || 'default'"
                                        @click="btnClick(v)">
                                    {{ v.text }}
                                </Button>
                            </div>
                        </div>
                    </Poptip>
                    <Button
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
        <div>
            <transition-group name="fade" mode="out-in" tag="div">
                <div :key="index" v-for="(item, index) in content">
                    <component 
                        :is="item.ui_type"
                        :define="item.ui_define"
                    >
                    </component>
                </div>
            </transition-group>
        </div>
        <Back-top></Back-top>
    </div>
</template>
<script>

    import {dispatch, getData} from '../utils/actionUtils'

    export default {
        props: {
            define: {
                type: null,
                default() {
                    return {}
                }
            },
            caption: {type: String},
            form: {
                type: String,
                default: 'form'
            },
            content: {
                type: null,
                default() {
                    return {}
                }
            },
            resource: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                topLeft: [],
                bottomRight: [],
                formData: {},
                rules: [],
                formItemDefault: {
                    item3: '123',
                    item4: '1233333'
                },
                title: '',
                subTitle: ''
            }
        },
        computed: {
            res() {
                return this.$store.state.pageData.data.hidden
            },
            leftMenu() {
                return this.define.leftMenu ? this.define.leftMenu : {}
            },
            formItem() {
                debugger
                let tmp = this.define.data || {}
                let formItem = {}
                for (let value of Object.values(tmp)) {
                    formItem = {
                        ...formItem,
                        ...value
                    }
                }
                return formItem
            }
        },
        watch: {
            define() {
                this.initialize(this.caption, this.define)
            },
            resource(newVal) {
                this.formData = newVal 
            }
        },
        inject: ['form'],
        mounted() {
            this.title = this.caption ? this.caption : this.define.caption || '无标题' 
            this.subTitle = this.define.subTitle || ''
            this.initialize(this.title, this.define)
        },
        methods: {
            handleChange(data) {
                if (!this.formData[data.form]) {
                    this.formData[data.form] = {}
                }
                this.formData[data.form][data.name] = data.data
            },
            initialize(caption, define) {
                document.title = caption
                this.handleButtonList(define.buttons)
            },
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
            btnClick(btn) {
                if (btn.action.type === 'submit') {
                    let action = btn.action
                    action.url.body = this.formData
                    getData(action.url, (data) => {
                        if (data) {
                            dispatch(data)
                        }
                    })
                } else {
                    dispatch(btn.action)
                }
            },
            handleButtonList(list) {
                this.clearButtonList()
                if (!list) {
                    return
                }
                list.forEach((val) => {
                    if (val.location === 'topLeft') {
                        if (!this.topLeft[val.groupNo]) {
                            this.topLeft[val.groupNo] = [val]
                        } else {
                            this.topLeft[val.groupNo].push(val)
                        }
                    } else if (val.location === 'bottomRight') {
                        if (!this.bottomRight[val.groupNo]) {
                            this.bottomRight[val.groupNo] = [val]
                        } else {
                            this.bottomRight[val.groupNo].push(val)
                        }
                    }
                })
            },
            clearButtonList() {
                this.topLeft = {}
                this.bottomRight = {}
            }
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

    .form-button-group {
        float: right;
    }

    .form-button-group .drop-down {
        min-width: 0;
        text-align: center;
    }

    .form-button-group .submit-btn {
        margin-bottom: 10px;
        width: 80%;
    }

    .form-button-group .drop-down-container {
        text-align: center;
    }

    .btn-container-bottom-right {
        float: right;
        margin-left: 10px;
        margin-bottom: 10px;
    }

    .btn-container-top-left {
        margin-left: 10px;
        margin-right: 10px;
    }

    .submit-btn {
        margin-right: 5px;
    }
</style>
