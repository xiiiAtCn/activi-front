<template>
    <div class="email_write">
        <Row style="margin-bottom:20px">
            <Button class="boxBtn" @click="send" shape="circle">发送</Button>
            <Button class="boxBtn" @click="fixSend" style="margin-left:10px" shape="circle">定时发送</Button>
            <Button class="boxBtn" @click="draft" style="margin-left:10px" shape="circle">存草稿</Button>
            <Button class="boxBtn" @click="close" style="margin-left:10px" shape="circle">关闭</Button>
        </Row>
        <Row :gutter="32">
            <Col span="24" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;">
                <Tabs type="card">
                    <TabPane label="普通邮件">
                        <Form :model="normalModal" ref="normalModal" :label-width="100">
                                <Form-item label="收件人" prop="recipients">
                                    <Input type="text"  v-model="normalModal.recipients"/>
                                </Form-item>
                                <Form-item style="height:30px">
                                    <p style="margin-left:10px"><a>添加抄送</a> <span>-</span> <a>添加密送</a> <span>|</span> <a>分别发送</a></p>
                                </Form-item>
                                <Form-item label="主题" prop="theme">
                                    <Input type="text" v-model="normalModal.theme"/>
                                </Form-item>
                                <Form-item style="height:30px;line-height: 30px">
                                    <p style="margin-left:10px">
                                        <Icon type="paperclip" class="fontStyle"></Icon> <a>添加附件</a> <span>|</span> <Icon type="paperclip" class="fontStyle"></Icon> <a>超大附件</a> <span>|</span> <Icon type="images" class="fontStyle"></Icon> <a>图片</a> <span>|</span> <Icon type="document-text" class="fontStyle"></Icon> <a>文档</a> <span>|</span> <Icon type="happy-outline" class="fontStyle"></Icon> <a>表情</a>
                                    </p>
                                </Form-item>
                                <Form-item label="正文" prop="article">
                                    <Input v-model="normalModal.article" type="textarea" :autosize="{minRows: 2,maxRows: 10}"  placeholder="请输入..."></Input>
                                </Form-item>
                        </Form>
                    </TabPane>
                    <TabPane label="群邮件">
                        <Form :model="manyModal" ref="manyModal" :label-width="100">
                                <Form-item label="收件人" prop="recipients">
                                    <Input type="text"  v-model="manyModal.recipients"/>
                                </Form-item>
                                <Form-item>
                                    <p>&nbsp</p>
                                </Form-item>
                                <Form-item label="主题" prop="theme">
                                    <Input type="text" v-model="manyModal.theme"/>
                                </Form-item>
                                <Form-item>
                                    <p style="margin-left:10px">
                                        <a>添加附件</a> <span>|</span> <a>超大附件</a> <span>|</span> <img style="width:20px;margin-right:5px;" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505463552478&di=ff09aa236a66bb99307f3d60a5380823&imgtype=0&src=http%3A%2F%2Fimg1.3lian.com%2F2015%2Fa1%2F122%2Fd%2F119.jpg"/><a>图片</a> <span>|</span> <img style="width:20px;margin-right:5px;" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505464489399&di=ff7cda78e3174676a3ea03cf65e30e4c&imgtype=0&src=http%3A%2F%2F1ke.co%2Ffiles%2Fcourse%2F2015%2F04-30%2F165949520887471323.png%3F4.9.3"/><a>文档</a> <span>|</span> <a>表情</a>
                                    </p>
                                </Form-item>
                                <Form-item label="正文" prop="article">
                                    <Input v-model="manyModal.article" type="textarea" :autosize="{minRows: 2,maxRows: 10}"  placeholder="请输入..."></Input>
                                </Form-item>
                        </Form>
                    </TabPane>
                    <TabPane label="音视频邮件">
                         <Form :model="videoModal" ref="videoModal" :label-width="100">
                                <Form-item label="收件人" prop="recipients">
                                    <Input type="text"  v-model="videoModal.recipients"/>
                                </Form-item>
                                <Form-item>
                                    <p>&nbsp</p>
                                </Form-item>
                                <Form-item label="主题" prop="theme">
                                    <Input type="text" v-model="videoModal.theme"/>
                                </Form-item>
                                <Form-item>
                                    <p>&nbsp</p>
                                </Form-item>
                                <Form-item label="视频" prop="article">
                                    <Input v-model="videoModal.article" type="textarea" :autosize="{minRows: 2,maxRows: 10}" ></Input>
                                </Form-item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    </div>
</template>

<script>
/* eslint-disable */
    import {dispatch} from  '../../../utils/skipUtils'
    export default {
        data () {
            return {
                normalModal:{
                    recipients:'',
                    theme:'',
                    article:''
                },
                manyModal:{
                    recipients:'',
                    theme:'',
                    article:''
                },
                videoModal:{
                    recipients:'',
                    theme:'',
                    article:''
                }
            }
        },
        computed: {
            iconSize () {
            }
        },
        methods: {
           send(){

           },
           fixSend(){

           },
           draft(){

           },
           close(){
               this.$router.push({
                  path:'/email/home'
               });
           }
        },

    }
</script>

<style scoped>
 .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
        background: #fff;
        padding: 16px;
    }

    .demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        border-color: transparent;
    }

    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
        border-color: #fff;
    }
    .email_write{
        margin-top:20px;
    }
    .email_write .ivu-form-item{
        margin-bottom:0;
    }
    .fontStyle{
        font-size: 20px;
        margin-top:5px;
    }
</style>
