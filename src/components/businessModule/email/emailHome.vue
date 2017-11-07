<template>
    <div class="email_home">
        <div class="home_content">
            <div style="height:70px;margin-left:20px;padding-top:20px">
                <h3>郭佳佳您好</h3>
                <h5 style="color: #3a9eda">您有5封未读邮件!</h5>
            </div>
            <div class="home_list">
                <div class="home_listitem" v-for="item in menuList">
                    <img :src="item.title" :value="item.title" :key="item.title">
                    <span>{{item.name}}</span>
                </div>
            </div>
            <div class="home_bottom">
                <span>欢迎登陆昱石科技邮件系统</span>
            </div>
        </div>
    </div>
</template>
<script>
    import {dispatch} from '../../../utils/actionUtils'
    export default {
        data () {
            return {
                menuList: [
                	{ 'title': require('../../../assets/img/mail/1-write.png'), 'name': '写信' },
                    { 'title': require('../../../assets/img/mail/2-receiving.png'), 'name': '收信(5)' },
                    { 'title': require('../../../assets/img/mail/3-Contact.png'), 'name': '通讯录' },
                    { 'title': require('../../../assets/img/mail/4-labelling.png'), 'name': '标签组' },
                    { 'title': require('../../../assets/img/mail/5-mails.png'), 'name': '群邮件' }
                ],
                screenWidth: document.body.clientWidth
            }
        },
        computed: {
            iconSize () {
            }
        },
        methods: {},
        mounted () {

        },
        watch: {}

    }
</script>
<style scoped>
    .email_home {
        width: 100%;
        height: 785px;
        background: #d9dfe8
    }

    .home_content {
        height: 785px;
        width: 1665px;
        padding: 20px 50px;
        padding: 0 10px;
        background: #fff;
        margin: 0 5px;
    }

    .home_list {
        height: 250px;
        text-align: center;
        padding-top: 33px;
    }

    .home_listitem {
        width: 200px;
        height: 200px;
        float: left;
        margin: 0 auto;
        text-align: center;
        margin-right: 50px;
    }

    .home_listitem img {
        width: 200px;
    }

    .home_listitem span {
        display: block;
        font-size: 16px;
    }

    .home_bottom {
        width: 100%;
        height: 150px;
        background: url('../../../assets/img/mail/welcome.png') no-repeat;
        background-size: cover;
        margin-top: 70px;
        position: relative;
    }

    .home_bottom span {
        font-size: 28px;
        color: #fff;
        position: absolute;
        top: 80px;
        left: 50px;
    }
</style>
