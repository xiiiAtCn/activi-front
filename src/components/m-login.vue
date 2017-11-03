<template>
    <div id="main">
        <header>
            <img data-src="../assets/img/yushi-logo.png" src="../assets/img/yushi-logo.png" class="logo">
            <span class="line">|</span>
            <span class="title">一站式管理系统</span>
        </header>
        <main>
            <img src="../assets/img/login.png" class="pic">
            <div class="message">
                <form id="login-form">
                    <div class="opt">
                        <span class="login">登录</span>
                        <span class="regiet">注册</span>
                    </div>
                    <input type="text" placeholder="请输入您的账号" class="account">
                    <input type="password" placeholder="请输入您的密码" class="pwd">
                    <div class="optration">
                        <div class="check">
                            <input type="checkbox" value="1" class="checkbox">
                            <span>两周内自动登录</span>
                        </div>
                        <a href="javascript:;" class="remember"><span>忘记密码？</span></a>
                    </div>
                </form>
                <button type="submit" @click="trlToWorkbench" class="tab">登录</button>
            </div>
            <div class="clearStyle"></div>
        </main>
        <footer>
            <p>
                <a href="javascript:;" class="bottomTitle">
                    <span>关于昱石 </span>
                    <span class="bottomLine">|</span>
                </a>
                <a href="/functionLog" target="_blank" class="bottomTitle">
                    <span>功能日志 </span>
                    <span class="bottomLine">|</span>
                </a>
                <a href="javascript:;" class="bottomTitle">
                    <span>联系我们 </span>
                    <span class="bottomLine">|</span>
                </a>
                <span>杭州昱石网络科技有限公司     </span>
                <span style="margin-left:20px">备案号：浙ICP备16047571号</span>
            </p>
        </footer>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                msg: 'hello vue'
            }
        },
        methods: {
            trlToWorkbench () {
            	this.$router.push({
                    path: '/layoutContent/04/workbench'
                })
            }
        }
    }
</script>

<style scoped>
    /**
      * Daily UI :: 001
      * Design a sign up page, modal, form, app screen, etc.
      **/
    /**
    * Style Declarations
    **/
    html, body {
        height:100%
    }
    body {
        background:#fff;
        font-family: 'Proxima Nova', Arial, Helvetica, sans-serif;
    }
    span{
        font-size:12px;
    }
    #main{
        width:60%;
        height:100%;
        margin:0 auto;
    }
    header{
        width:80%;
        height:100px;
        line-height:100px;
        margin:0 auto;
    }
    img.logo{
        width:105px;
        padding-top:15px;
        float:left
    }
    span.line{
        font-size:40px;
        color:#909090;
        margin:0 20px;
        text-align:center;
        float:left
    }
    span.title{
        font-size:18px;
        color:#909090;
        float:left
    }
    main{
        width:80%;
        height:70%;
        margin:0 auto;
        margin-top:70px;
    }
    img.pic{
        float:left;
        width:43%;
        height:55%;
    }
    .message{
        float:right;
        width:50%;
        height:55%;
        border-radius:3px;
        border:1px solid #ccc;
        text-align:center
    }
    form{
        height:70%;
    }
    input.pwd{
        width:80%;
        height:30px;
        margin-bottom:21px;
        font-size:12px;
        border-radius: 4px;
        border:1px solid #ccc
    }
    input.account{
        width:80%;
        height:30px;
        margin-bottom:21px;
        font-size:12px;
        border-radius: 4px;
        border:1px solid #ccc;
    }
    .opt{
        height:70px;
        line-height:70px;
    }
    .login{
        margin:20px;
        color:#569bda;
        padding-bottom:3px;
        font-size:16px;
        border-bottom:2px solid #569bda;
        cursor:pointer
    }
    .regiet{
        margin:20px;
        color:#ababab;
        padding-bottom:3px;
        font-size:16px;
        cursor:pointer
    }
    footer{
        height:50px;
        width:60%;
        margin:0 auto;
        text-align:center
    }
    p{
        font-size:12px;
    }
    .bottomTitle{
        text-decoration:none;
        color:#0082f5
    }
    .bottomLine{
        padding:0 10px;
    }
    button{
        width:80%;
        height:35px;
        background:#107bed;
        color:#fff;
        border:0;
        border-radius:3px;
        margin:10px 0;
        cursor:pointer
    }
    .checkbox{
        width:15px;
        background:#fff
    }
    .remember{
        text-decoration:none;
        font-size:12px;
        float:right;
        margin-right:30px
    }
    .check{
        float:left;
        margin-left:30px;
    }
    .optration{
        height: 25%;
        line-height: 156%;
    }
    .clearStyle{
        clear:both;
    }
</style>
