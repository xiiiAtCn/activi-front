<template>
    <div class="email_directory">
        <Row>
            <!--  <Col class="directory_menu">
                 <div class="directory_title">
                     <span style="float:left;font-size:14px;">分组</span>
                     <a href="javascript:;" @click="addGroup" title="创建分组" style="cursor:pointer">
                         <Icon type="android-add-circle" style="float:right;font-size: 25px;color:#8ab5e8"></Icon>
                     </a>
                 </div>
                 <p>全部(125)</p>
                 <p><a href="javascript:;" @click="selected(item.name)" :class="{active: active == item.name}" v-for="item in listMenu">{{item.name}}</a></p>
             </Col> -->
            <Col class="directory_man">
            <div class="directory_recently">
                <p style="font-size:14px;padding:15px 0">最近联系人</p>
                <div class="directory_header">
                    <div style="float:left;margin-right:50px;" v-for="item in contactList">
                        <img :src="item.title" :value="item.title" :key="item.title">
                        <span>{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="directory_option">
                <div style="padding:20px 0">
                    <Button type="primary" style="padding-left:20px;padding-right:20px" >写信</Button>
                    <Button style="background:#b3b3b3;color:#fff;margin:0 30px;padding-left:20px;padding-right:20px" @click="deleteData">删除</Button>
                    <Select style="background:#fff;width:120px" placeholder="添加到分组..." clearable>
                        <Option v-for="item in listMenu" :value="item.name" :key="item.name">{{ item.name }}</Option>
                    </Select>
                </div>
                <div style="height:40px;line-height: 40px">
                    <span style="float:left;color:#000;font-weight:bold">公司通讯录（1/7）</span>
                    <div style="float:right;margin-right:20px;position: relative">
                        <Input  placeholder="搜索联系人..." style="width: 200px" ref="contactMan"></Input><span @click="search" style="position: absolute;top:6px;right:10px;cursor:pointer"><Icon style="font-size: 20px" type="ios-search"></Icon></span>
                    </div>
                </div>
                <Table :columns="columns1" :data="data1" style="border-left:0;margin-right:20px;margin-top:5px"></Table>
            </div>
            </Col>
        </Row>
        <Modal v-model="addGroupModal" @on-ok="ok" @on-cancel="cancel">
            <Input v-model="value" placeholder="请输入分组名称..." ref="groupVal"></Input>
        </Modal>

        <Modal v-model="deleteDataModal" @on-ok="deleteConfirm" @on-cancel="deleteCancel">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>此邮件删除后,邮件将在已删除</p>
                <p>您是否继续删除？</p>
            </div>
        </Modal>

    </div>
</template>
<script>
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
                contactList: [{
                    'title': require('../../../assets/img/mail/1-jieke.png'),
                    'name': '杰克'
                },
                    {
                        'title': require('../../../assets/img/mail/2-wangyu.png'),
                        'name': '王宇'
                    },
                    { 'title': require('../../../assets/img/mail/3-taojiajia.png'), 'name': '陶佳佳' },
                    { 'title': require('../../../assets/img/mail/4-zhuli.png'), 'name': '朱莉' },
                    { 'title': require('../../../assets/img/mail/5-laiangnaduo.png'), 'name': '雷奥纳多' },
                    { 'title': require('../../../assets/img/mail/6-hailun.png'), 'name': '海伦' },
                    { 'title': require('../../../assets/img/mail/7-simisi.png'), 'name': '露丝' },
                    { 'title': require('../../../assets/img/mail/8-weiweian.png'), 'name': '杰克' },
                ],
                active: '',
                columns1: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                    {
                        title: '姓名',
                        key: 'name',
                        width: 200,
                        align: 'center'
                    },
                    {
                        title: '邮箱',
                        key: 'mail',
                        align: 'left',
                    },

                ],
                data1: [{
                    name: '王小明',
                    mail: '1357853@qq.com'
                },
                    {
                        name: '张小刚',
                        mail: '1357853@163.com'
                    },
                    {
                        name: '李小红',
                        mail: '1357853@163.com'
                    },
                    {
                        name: '周小伟',
                        mail: '1357ee53@qq.com'
                    }
                ],
                addGroupModal: false,
                deleteDataModal:false
            }
        },
        computed: {

        },
        methods: {
            addGroup() {
                this.addGroupModal = true
            },
            ok() {
                let groupVal = this.$refs.groupVal.currentValue
                this.listMenu.push({ 'name': groupVal })
                console.log(groupVal)
            },
            cancel() {
                this._cleanData()
                this.$Message.info('点击了取消');
            },
            _cleanData() {
                this.$refs.groupVal.currentValue = ""
            },
            add() {

            },
            tool() {

            },
            deleteData(){
                this.deleteDataModal=true
            },
            deleteConfirm(){
                this.$Message.info('点击了确定');
            },
            deleteCancel(){
                this.$Message.info('点击了取消');
            },
            selected(name) {
                this.active = name;
            },
            search(){
                let contactMan = this.$refs.contactMan.currentValue
                console.log(contactMan)
            },
        },

    }
</script>
<style>
    .email_directory .ivu-table:after {
        width: 0;
    }
</style>
<style scoped>
    .active {
        color: #8ab5e8 !important;
        display: block;
        border-bottom: 2px solid #8ab5e8;
    }

    .email_directory {
        width: 100%;
        height: 785px;
        background: #d9dfe8;
    }

    .directory_menu {
        height: 785px;
        padding: 0 10px;
        background: #fff;
        float: left;
        width: 12%;
        margin: 0 5px;
    }

    /*.directory_man {
        height: 785px;
        width: 87.4%;
        float: right
    }*/
    .directory_man{
        height: 785px;
        width: 1665px;
        padding: 20px 50px;
        padding: 0 10px;
        background: #fff;
        margin: 0 5px;
    }
    .directory_title {
        width: 100%;
        padding-top: 15px;
        height: 50px;
        border-bottom: 1px solid #a5bad0;
    }

    .directory_menu p {
        margin: 30px 0;
        color: #ccc;
    }

    .directory_menu p a {
        display: block;
        width: 90px;
        margin: 20px 0;
        color: #ccc
    }

    .directory_man .directory_recently {
        width: 100%;
        height: 150px;
        background: #fff;
        margin-bottom: 5px;
        padding-left: 20px;
    }

    .directory_man .directory_option {
        width: 100%;
        height: 630px;
        background: #fff;
        padding-left: 20px;
    }

    .directory_man .directory_recently .directory_header {
        text-align: center;
    }
    .directory_man .directory_recently .directory_header  span{
        display: block;
    }
    .ivu-table-header thead {
        background: #89b5e8 !important;
    }
</style>
