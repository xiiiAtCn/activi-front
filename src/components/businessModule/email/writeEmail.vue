<template>
    <div class="email_write">
        <Row>
            <!--  <Col class="email_menu">
            <div class="email_title">
                <span style="float:left;font-size:14px;">分组</span>
                <a href="javascript:;" @click="addGroup" title="创建分组" style="cursor:pointer">
                    <Icon type="android-add-circle" style="float:right;font-size: 25px;color:#8ab5e8"></Icon>
                </a>
            </div>
            <p>全部(125)</p>
            <p><a href="javascript:;" @click="selected(item.name)" :class="{active: active == item.name}" v-for="item in listMenu">{{item.name}}</a></p>
            </Col> -->
            <Col class="email_man">
            <Row class="option_button">
                <Button type="primary" @click="send" style="padding-left:25px;padding-right:25px;margin-right:15px">发送</Button>
                <Button class="boxBtn" type="info" @click="fixSend">定时发送</Button>
                <Button class="boxBtn" type="ghost" @click="draft" style="background:#fff;color:#2db7f5;border-color:#2db7f5;padding-left:20px;padding-right:20px">存草稿</Button>
                <Button class="boxBtn" type="ghost" @click="close" style="background:#fff;color:#ccc">关闭</Button>
            </Row>
            <Tabs value="name1" @on-click="changeTabs" class="write_content">
                <TabPane label="普通邮件" name="name1">
                    <div>
                        <Form ref="normalModal" :model="normalModal" :rules="ruleValidate">
                            <FormItem prop="to">
                                <Input type="text" v-model="normalModal.to" placeholder="收件人  |  " />
                            </FormItem>
                            <p style="margin-bottom:30px"><a href="javascript:;" title="同时将这一封邮件发送给其他联系人">添加抄送</a> <span>-</span> <a href="javascript:;" title="同时将这一封邮件发送给其他联系人，但收件人和抄送人不会看到密送人">添加密送</a> <span>|</span> <a href="javascript:;" title="会对多个人一对一发送，每个人将收到单独发给他/她的邮件">分别发送</a></p>
                            <FormItem prop="subject">
                                <Input type="text" v-model="normalModal.subject" placeholder="主题" />
                            </FormItem>
                            <p style="margin-top:30px">
                                <Icon type="paperclip" class="fontStyle" style="color:#75b3f5"></Icon> <a>添加附件</a> <span>|</span>
                                <Icon type="android-arrow-dropdown"></Icon>
                            </p>
                            <quill-editor v-model="normalModal.text" ref="myQuillEditor" id="1" :options="editorOption">
                            </quill-editor>
                            <p style="margin-top:55px;font-weight:bold">发件人：郭佳佳
                                < fpmonitor@163.com>
                            </p>
                        </Form>
                    </div>
                </TabPane>
                <TabPane label="群邮件" name="name2">
                    <div>
                        <Form ref="manyModal" :model="manyModal" :rules="ruleValidate">
                            <FormItem prop="toList">
                                <Select placeholder="--请选择群组--" v-model="manyModal.toList">
                                    <Option v-for="item in groupMail" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <p style="margin-bottom:30px"><a href="javascript:;" title="同时将这一封邮件发送给其他联系人">添加抄送</a> <span>-</span> <a href="javascript:;" title="同时将这一封邮件发送给其他联系人，但收件人和抄送人不会看到密送人">添加密送</a> <span>|</span> <a href="javascript:;" title="会对多个人一对一发送，每个人将收到单独发给他/她的邮件">分别发送</a></p>
                            <FormItem prop="subject">
                                <Input type="text" v-model="manyModal.subject" placeholder="主题" />
                            </FormItem>
                            <p style="margin-top:30px">
                                <Icon type="paperclip" class="fontStyle" style="color:#75b3f5"></Icon> <a>添加附件</a> <span>|</span>
                                <Icon type="android-arrow-dropdown"></Icon>
                            </p>
                            <quill-editor v-model="manyModal.text" ref="myEditor" id="2" :options="editorOption">
                            </quill-editor>
                            <p style="margin-top:55px;font-weight:bold">发件人：郭佳佳
                                < fpmonitor@163.com>
                            </p>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
            </Col>
        </Row>
        <Modal v-model="addGroupModal" @on-ok="ok" @on-cancel="cancel">
            <Input v-model="value" placeholder="请输入分组名称..." ref="groupVal"></Input>
        </Modal>
        <Modal v-model="fixSendModal" title="定时发送" @on-ok="okSend" @on-cancel="cancelSend">
            <DatePicker style="margin-left:40px" type="date" placeholder="选择日期"></DatePicker>
            <TimePicker confirm type="time" placeholder="选择时间" style="margin-left:20px"></TimePicker>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { dispatch } from '../../../utils/skipUtils'

    export default {
        data() {
            return {
                listMenu: [
                    { 'name': '开发项目组(35)' },
                    { 'name': '界面设计组(12)' },
                    { 'name': '财务库房(12)' },
                    { 'name': '特别关注(45)' },
                    { 'name': '新建分组1(8)' },
                ],
                active: '',
                groupMail: [{
                    value: '1',
                    label: '开发项目组',
                    mailAdd: ['1506461525@qq.com', '13704263835@163.com']
                },
                    {
                        value: '2',
                        label: '界面设计组',
                        mailAdd: ['1506461525@qq.com', 'shanc@winice.cn']
                    },
                    {
                        value: '3',
                        label: '财务库房',
                        mailAdd: ['congshanwawa@qq.com', '13704263835@163.com']
                    },
                    {
                        value: '4',
                        label: '特别关注',
                        mailAdd: ['1506461525@qq.com', '13704263835@163.com']
                    },
                    {
                        value: '5',
                        label: '新建分组',
                        mailAdd: ['1506461525@qq.com', '13704263835@163.com']
                    },
                ],
                // content: '<h2>I am Example</h2>',
                editorOption: {
                    // some quill options
                },
                normalModal: {
                    // from: 'fpmonitor@163.com',
                    to: '',
                    subject: '',
                    text: ''
                },
                manyModal: {
                    // from: 'fpmonitor@163.com',
                    toList: [],
                    subject: '',
                    text: ''
                },
                videoModal: {
                    recipients: '',
                    theme: '',
                    article: ''
                },
                addGroupModal: false,
                fixSendModal: false,
                activeTab: 1,
                ruleValidate: {
                    to: [
                        { required: true, message: '收件人不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    subject: [
                        { required: true, message: '主题不能为空', trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
            iconSize() {},
        },
        methods: {
            changeTabs(value) {
                console.log(value)
                if (value === 'name1') {
                    this.activeTab = 1;
                    this.cleanData('manyModal')
                }
                if (value === 'name2') {
                    this.activeTab = 2;
                    this.cleanData('normalModal')
                }
            },
            addGroup() {
                this.addGroupModal = true
            },
            ok() {
                let groupVal = this.$refs.groupVal._data.currentValue
                this.listMenu.push({ 'name': groupVal })
                this.cleanData(groupVal)
                this._cleanData()
            },
            cancel() {
                this._cleanData()
                this.$Message.info('点击了取消');
            },
            _cleanData() {
                this.$refs.groupVal._data.currentValue = ""
            },
            cleanData(dataName) {
                for (let key in this[dataName]) {
                    if (typeof this[dataName][key] === 'object') {
                        this.$set(this[dataName], key, []);
                    } else {
                        this.$set(this[dataName], key, '');
                    }
                }
                // 清除验证状态
                this.$refs[dataName].resetFields();
            },
            send() {
                console.log(this.$refs.myQuillEditor)
                let data = {}
                if (this.activeTab === 1) {
                    data = this.normalModal
                    name="normalModal"
                }
                if (this.activeTab === 2) {
                    for (var i = 0; i < this.groupMail.length; i++) {
                        if (this.manyModal.toList == this.groupMail[i].value) {
                            this.manyModal.toList = this.groupMail[i].mailAdd
                        }
                    }
                    console.log(this.manyModal)
                    data = this.manyModal
                    name="manyModal"
                    //第二版，页面取不到数据
                    // let list = this.manyModal.toList.mailAdd
                    // let arr = []
                    // for (var i = 0; i < list.length; i++) {
                    //     arr.push(list[i])
                    // }
                    // delete this.manyModal.toList;
                    // this.$set(this.manyModal, 'toList', arr)
                    // console.log(this.manyModal)
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.sendMsg(data)
                    } else {
                        this.$Message.error('表单验证失败!');
                        this.cleanData(name)
                    }
                })
            },
            sendMsg(data) {
                data.from="fpmonitor@163.com"
                Vue.http.post("/api/mail/sendMail", data)
                    .then(res => {
                        console.log(res)
                        if (res.status === 200) {
                            this.$Message.info("操作成功");
                            if (this.activeTab === 1) {
                                this.cleanData('normalModal')
                            }
                            if (this.activeTab === 2) {
                                this.cleanData('manyModal')
                            }
                        } else {
                            this.$Message.error("操作失败");
                        }
                    }, data => {
                        console.error('error');
                    });
            },
            fixSend() {
                this.fixSendModal = true
            },
            okSend() {

            },
            cancelSend() {
                this.$Message.info('点击了取消');
            },
            draft() {
                this.$Message.info({
                    content: '邮件已存入草稿箱',
                    duration: 3
                });
            },
            close() {
                this.$router.push({
                    path: '/email/home'
                });
            },
            selected(name) {
                this.active = name;
            },
        },
        mounted() {
            // console.log('this is current quill instance object', this.editor)
        }

    }
</script>
<style scoped>
    .demo-tabs-style1>.ivu-tabs-card>.ivu-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

    .demo-tabs-style1>.ivu-tabs-card>.ivu-tabs-content>.ivu-tabs-tabpane {
        background: #fff;
        padding: 16px;
    }

    .demo-tabs-style1>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
        border-color: transparent;
    }

    .demo-tabs-style1>.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
        border-color: #fff;
    }

    .email_write {
        width: 100%;
        height: 785px;
        background: #d9dfe8
    }

    .email_menu {
        height: 785px;
        padding: 0 10px;
        background: #fff;
        float: left;
        width: 12%;
        margin: 0 5px;
    }

    .write_content {
        margin: 0 20px;
    }

    .email_title {
        width: 100%;
        padding-top: 15px;
        height: 50px;
        border-bottom: 1px solid #a5bad0;
    }

    .email_menu p {
        margin: 30px 0;
        color: #ccc;
    }

    .email_menu p a {
        display: block;
        color: #ccc;

        width: 90px;
        margin: 20px 0;
    }

    .active {
        color: #8ab5e8 !important;
        display: block;
        border-bottom: 2px solid #8ab5e8;
    }

    .email_write .ivu-form-item {
        margin-bottom: 0;
    }

    .fontStyle {
        font-size: 20px;
        margin-top: 5px;
    }

    .boxBtn {
        margin-left: 15px;
        margin-top: 4px
    }










    /*.option_button {
        margin-bottom: 20px;
        height: 40px;
    }*/

    .option_button {
        padding: 33px 20px;
        height: 100px;
    }

    .option_button .boxBtn {
        margin: 0 20px;
    }










    /*.email_man {
        height: 785px;
        width: 87.4%;
        float: right;
        background: #fff;
        padding: 20px 20px;
    }*/

    .email_man {
        height: 785px;
        width: 1665px;
        padding: 20px 50px;
        padding: 0 10px;
        background: #fff;
        margin: 0 5px;
    }

    .ivu-form-item-content {
        margin-left: 0px !important;
    }

    .quill-editor {
        height: 300px;
    }
</style>
