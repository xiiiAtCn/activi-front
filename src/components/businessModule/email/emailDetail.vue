<template>
    <div class="email_detail">
        <div class="detail_content">
            <div class="option_button">
                <Row style="float:left">
                    <Button type="primary" @click="relay" style="padding-left:25px;padding-right:25px;margin-right:15px">恢复</Button>
                    <Button class="boxBtn" @click="replay" style="padding-left:25px;padding-right:25px;margin-right:15px" type="info">转发</Button>
                    <Button class="boxBtn" type="ghost" @click="deleteData" style="background:#fff;color:#2db7f5;border-color:#2db7f5;padding-left:20px;padding-right:20px">删除</Button>
                    <Button class="boxBtn" type="ghost" @click="compDelete" style="background:#fff;color:#2db7f5;border-color:#2db7f5;padding-left:20px;padding-right:20px">彻底删除</Button>
                </Row>
                <div style="width:30px;height:30px;float:left;color:#3a9eda;margin-top:-5px;margin-left:10px;cursor:pointer" @click="close">
                    <Icon type="reply" style="font-size: 20px"></Icon>
                    <br/><span style="margin-top:-5px">返回</span></div>
            </div>
            <Row class="detail_msg">
                <h3>{{returnData.theme}}</h3>
                <p class="emailMsg"><span>发件人：</span><span>{{returnData.postPerson}}</span></p>
                <p class="emailMsg"><span>时 &nbsp 间：</span><span>{{returnData.time}}</span></p>
                <p class="emailMsg"><span>收件人：</span><span>{{returnData.resivePerson}}</span></p>
                <hr style="background:#2d8cf0;margin-top:20px;" />
            </Row>
            <Row style="height:200px;padding: 0 20px;pading-bottom:33px">
                <p>
                    欢迎开立招商银行账户！您预留在我行的137****3835手机号非常重要，是我行与您联系和交易确认的关键电话，如需变更请及时通过我行专业版或柜台修改。用卡指南详见http://cmbt.cn/vrn7nR
                </p>
            </Row>
            <Row v-if="!changeFlag" style="padding:0 20px">
                <input type="text" style="width:1608px" placeholder="快捷回复给..." @click="toggle" />
            </Row>
            <Row v-if="changeFlag" style="padding:0 20px">
                <quill-editor v-modal="" style="width:1608px;height:200px;resize:none" autofocus="autofocus"></quill-editor>
                <br>
                <Button type="primary" @click="send" style="padding-left:25px;padding-right:25px;margin-right:15px;margin-top:30px">发送</Button>
            </Row>
        </div>
    </div>
</template>
<script>
    import { dispatch } from '../../../utils/actionUtils'
    export default {
        data() {
            return {
                changeFlag: false,
                returnData: {
                    'theme': '转发：外挂？破解？网易重磅推出手游保护解决方案',
                    'postPerson': '耿胜男 <13704263835@163.com>',
                    'time': '2017年9月15日(星期五) 下午2:26',
                    'resivePerson': '宇宙无敌美少女 <1506461525@qq.com>'
                }
            }
        },
        computed: {

        },
        methods: {
            goback() {
                window.history.go(-1);
            },
            replay() {

            },
            deleteData() {

            },
            compDelete() {

            },
            relay() {

            },
            report() {

            },
            regection() {

            },
            toggle() {
                this.changeFlag = true
            },
            send() {

            },
            close() {
                window.history.go(-1);
            }

        },

    }
</script>
<style scoped>

    .email_detail {
        width: 100%;
        height: 785px;
        background: #e0e3e6
    }

    .detail_content {
        height: 785px;
        width: 1665px;
        padding: 20px 50px;
        padding: 0 10px;
        background: #fff;
        margin: 0 5px;
    }

    .option_button {
        padding: 33px 20px;
        height: 100px;
    }

    .detail_msg {
        padding: 33px 20px;
    }

    .detail_msg p {
        padding: 5px 0;
        font-weight: bold;
    }

    .option_button .boxBtn {
        margin: 0 20px;
    }
</style>
