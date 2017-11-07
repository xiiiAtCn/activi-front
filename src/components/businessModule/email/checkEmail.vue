<template>
    <div class="email_check">
        <div class="check_content">
            <Row class="option_button">
                <Button type="primary" @click="relay" style="padding-left:25px;padding-right:25px;margin-right:15px">转发</Button>
                <Button class="boxBtn" @click="read" type="info">全部标记为已读</Button>
                <Button class="boxBtn" type="ghost" @click="deleteData" style="background:#fff;color:#2db7f5;border-color:#2db7f5;padding-left:20px;padding-right:20px">删除</Button>
                <Button class="boxBtn" type="ghost" @click="compDelete" style="background:#fff;color:#2db7f5;border-color:#2db7f5;padding-left:20px;padding-right:20px">彻底删除</Button>
                <Button class="boxBtn" type="ghost" @click="close" style="background:#fff;color:#ccc">关闭</Button>
            </Row>
            <Row class="check_data">
                <h4 style="color:#5a91d0">共计 2 封邮件</h4>
                <Table :columns="columns" ref="selection" :data="data1" style="border-left:0;border-right:0"></Table>
                <p class="select_opt"><span>选择：</span> <a href="javascript:;" @click="handleSelectAll(true)">全部</a> <span> - </span> <a href="javascript:;" @click="handleSelectAll(false)">无</a> <span> - </span> <a href="javascript:;" @click="readed">已读</a> <span> - </span> <a href="javascript:;" @click="noread">未读</a></p>
            </Row>
        </div>
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
        <Modal v-model="compDeleteModal" @on-ok="compDeleteConfirm" @on-cancel="compDeleteCancel">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>彻底删除确认</span>
            </p>
            <div style="text-align:center">
                <p>此邮件删除后,邮件将在垃圾箱</p>
                <p>您是否彻底删除？</p>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { dispatch } from '../../../utils/actionUtils'
    export default {
        data() {
            return {
                deleteDataModal: false,
                compDeleteModal: false,
                columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                    {
                        width: 80,
                        align: 'center',
                        title: '状态',
                        key: 'email',
                        render: (h, params) => {
                            if (params.row.email === '1') {
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'email',
                                        },
                                        style: {
                                            fontSize: '20px',
                                            color: '#1079d7'
                                        },
                                    }),
                                    h('strong')
                                ]);
                            } else if (params.row.email === '2') {
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-filing',
                                        },
                                        style: {
                                            fontSize: '20px',
                                            color: '#adadad'
                                        },
                                    }),
                                    h('strong')
                                ]);
                            }

                        }
                    },
                    {
                        title: '发件人',
                        key: 'postPerson',
                        align: 'center'
                    },
                    {
                        title: '主题',
                        width: 1100,
                        align: 'left',
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    click: () => {
                                        params.row.email = '2'
                                        this.$router.push({
                                            path: '/email/emailDetail'
                                        });
                                    }
                                }
                            }, params.row.theme)
                        }

                    },
                    {
                        title: '时间',
                        key: 'time',
                        align: 'center',
                        sortable: true,
                        width: 120
                    },
                    {
                        title: '标签',
                        key: 'label',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'android-add-circle',
                                    },
                                    style: {
                                        fontSize: '20px',
                                        color: '#1079d7',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {

                                        }
                                    }
                                }),
                                h('strong')
                            ]);
                        }
                    },
                ],
                data1: [{
                    'email': '1',
                    'postPerson': '张杰',
                    'theme': '转发：招商银行一卡通开户通知',
                    'time': '2017-09-15'
                },
                    {
                        'email': '1',
                        'postPerson': '刘能',
                        'theme': '招商银行一卡通开户通知',
                        'time': '2017-09-25'
                    },
                    {
                        'email': '1',
                        'postPerson': '刘能',
                        'theme': '招商银行一卡通开户通知',
                        'time': '2017-09-25'
                    },
                    {
                        'email': '1',
                        'postPerson': '刘能',
                        'theme': '招商银行一卡通开户通知',
                        'time': '2017-09-25'
                    }
                ],

            }
        },
        computed: {
            iconSize() {}
        },
        methods: {
            //邮件删除
            deleteData() {
                this.deleteDataModal = true
            },
            deleteConfirm() {
                this.$Message.info('点击了确定');
            },
            deleteCancel() {
                this.$Message.info('点击了取消');
            },
            //邮件彻底删除
            compDelete() {
                this.compDeleteModal = true
            },
            compDeleteConfirm() {
                this.$Message.info('点击了确定');
            },
            compDeleteCancel() {
                this.$Message.info('点击了取消');
            },
            //邮件转发
            relay() {

            },
            //邮件已读
            read() {
                for (var i = 0; i < this.data1.length; i++) {
                    this.data1[i].email = '2'
                }
            },
            close() {
                this.$router.push({
                    path: '/email/home'
                });
            },
            handleSelectAll(status) {
                this.$refs.selection.selectAll(status);
            },
            readed(){

            },
            noread(){

            }

        },
        mounted() {

        }

    }
</script>
<style>
    .email_check .ivu-table:after {
        width: 0;
    }
</style>
<style scoped>
    .email_check {
        width: 100%;
        height: 785px;
        background: #e0e3e6
    }

    .check_content {
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

    .option_button .boxBtn {
        margin: 0 20px;
    }

    .select_opt {
        height: 30px;
        line-height: 30px;
        margin-top: 20px;
    }

    .check_data {
        padding: 0 20px;
    }

    .select_opt a {
        color: #2d8cf0
    }

    .select_opt span {
        color: #ccc
    }
</style>
