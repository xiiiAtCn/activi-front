<template>
    <div class="container90">
        <div>
            <Row>
                <Col span="20" style="display: flex; justify-content: flex-start; align-items: flex-end">
                    <Breadcrumb style="margin-right: 10px">
                        <Breadcrumb-item v-if="typeof caption === 'string' || !caption">
                            <h2>{{caption||'无标题'}}</h2>
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
            <hr/>
        </div>
        <div v-if="!define.title"></div>
        <div>
            <transition-group name="fade" mode="out-in" tag="div">
                <div :key="index" v-for="(items, index) in define.forms">
                    <Card style="margin-bottom: 10px;">
                        <p slot="title">
                            {{items.caption}}
                        </p>
                        <Form :model="formItem" :label-width="120" label-position="right">
                            <Row v-for="(row,rowKey) in items.ui_content" :key="rowKey">
                                <Col v-for="(col,colKey) in row.ui_content" :span="col.ui_define.col" :key="colKey">
                                    <FormItem v-for="(item,key) in col.ui_content" :label="item.ui_define.label"
                                              :key="key">
                                        <component
                                                v-for="v in item.ui_content"
                                                :is="v.ui_type"
                                                :define="v.ui_define"
                                                :content="v.ui_content"
                                                :modelText="formItem[v.ui_define.name]"
                                                :form="items.ui_define.model"
                                                :formIndex="index"
                                                @dataChange="handleChange"
                                        >
                                        </component>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </transition-group>
            <hr/>
            <div class="btn-container-bottom-right" v-for="(item, sequence) in bottomRight" :key="sequence">
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
        </div>
        <Back-top></Back-top>
    </div>
</template>
<script>
    import {dispatch, getData} from '../utils/actionUtils'
    import {FETCH_FORM_DATA} from 'store/Action'
    import _ from 'lodash'

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
            }
        },
        data() {
            return {
                topLeft: [],
                bottomRight: [],
                formData: {},
                rules: [],
                formItem: {},
                formItemDefault: {
                    item3: '123',
                    item4: '1233333'
                },
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
            define() {
                this.initialize(this.caption, this.define)
            }
        },
        inject: ['form'],
        mounted() {
            this.initialize(this.caption, this.define)
            //console.log('inject form',this.form)
        },
        methods: {
            handleChange(data) {
                if (!this.formData[data.formIndex]) {
                    this.formData[data.formIndex] = {}
                }
                this.formData[data.form][data.name] = data.data
            },
            initialize(caption, define) {
                if (caption) {
                    document.title = caption
                }
                else {
                    document.title = '无标题'
                }
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
                            console.log(data)
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
