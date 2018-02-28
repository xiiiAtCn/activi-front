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
                <div class="opt">
                    <span :class="switchForm&&'current'" @click="switchForm=true">登 录</span>
                    <span :class="!switchForm&&'current'" @click="switchForm=false">注 册</span>
                </div>
                <Form id="login-form" v-show="switchForm" :labelWidth="labelWidth" :model="form" :rules="rules" ref="login-form">
                    <Form-item style="text-align: left;margin-bottom: 5px; padding-left: 45px;color: #ed3f14;">
                        <span>{{errorMessage}}</span>
                    </Form-item>
                    <Form-item class="form-element" label="用户名" prop="loginName">
                        <Input type="text" placeholder="请输入您的账号" v-model="form.loginName" />
                    </Form-item>
                    <Form-item class="form-element" label="密码" prop="password" >
                        <Input type="password" placeholder="请输入您的密码" v-model="form.password" @on-enter="login"/>
                    </Form-item>
                    <!-- <Form-item class="form-element" label="选择系统">
                        <Select v-model="system">
                            <Option
                                v-for="( value,key, index) in systems"
                                :key="index"
                                :value="key"
                            >
                                {{value}}
                            </Option>
                        </Select>
                    </Form-item> -->
                    <div class="optration">
                        <div class="check">
                            <input type="checkbox" value="1" class="checkbox">
                            <span>两周内自动登录</span>
                        </div>
                        <a href="javascript:;" class="remember"><span>忘记密码？</span></a>
                    </div>
                    <Button type="primary" @click="login" class="tab">登录</Button>
                </Form>
                <Form id="registerForm"  v-show="!switchForm" :labelWidth="labelWidth" :model="registerForm" :rules="registerRules" ref="registerForm">
                    <FormItem class="form-element" label="用户名" prop="username">
                        <Input v-model="registerForm.username" placeholder="请输入用户名" ></Input>
                    </FormItem>
                    <FormItem class="form-element" label="昵称" prop="nickName">
                        <Input v-model="registerForm.nickName" placeholder="请输入昵称"></Input>
                    </FormItem>
                    <FormItem class="form-element" label="密码" prop="password">
                        <Input type="password" v-model="registerForm.password" placeholder="请输入密码"></Input>
                    </FormItem>
                    <Button type="primary" @click="register" class="tab">注册</Button>
                </Form>
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

    import { getData } from 'utils/actionUtils'
    import iView from 'iview'

    export default{
        data () {
            const nameValid =(rule, val, callback)=>{
                let url ={
                    pathParams:{
                        username : val
                    },
                    url:'/api/user/check/{username}'
                }
                getData(url, (result) => {
                    if(result){
                        if(!result.data){
                            callback(result.description)
                        }else{
                            callback()
                        }
                    }
                })
            }
            const passValid = (rule, val, callback)=>{
                if(/^[A-Za-z0-9]{6,}$/.test(val)){
                    callback()
                }else{
                    callback('请输入6位以上数字字母密码')
                }
            }
            const nickValid =(rule, val, callback)=>{
                if(/^.{1,}$/.test(val)){
                    callback()
                }else{
                    callback('请输入昵称')
                }
            }
            return {
                errorMessage: '',
                systems: {},
                system: '',
                labelWidth:60,
                switchForm:true,
                form: {
                    loginName: '',
                    password: '',
                },
                rules:{
                    loginName: [
                        {
                            required: true,
                            message: '请输入登录名',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        }
                    ]
                },
                registerForm:{
                    username: '',
                    nickName: '',
                    password: ''
                },
                registerRules:{
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { validator:nameValid , trigger: 'blur' }
                    ],
                    nickName: [
                        { required: true, validator:nickValid,trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { validator:passValid,trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            // this.setUrl('/api/module/systems').forGet(data => this.systems = data)
        },
        methods: {
            trlToWorkbench () {
                this.$router.push({
                    path: '/layoutContent/04/workbench'
                })
            },
            login() {
                this.$refs['login-form'].validate(valid => {
                    if(valid) {
                        let body = new URLSearchParams()
                        body.append('loginName', this.form.loginName)
                        body.append('password', this.form.password)
                        this.setUrl('/api/login').setBody(body).forPost((data, error) => {
                            if(error) {
                                console.log(error)
                                if(error.response) {
                                    let { response } = error
                                    if(response.status === 401) {
                                        this.errorMessage = response.data.message
                                    }
                                }
                                return
                            }
                            this.trlToWorkbench()
                        })
                    }
                })
            },
            register(){
                this.$refs['registerForm'].validate(valid => {
                    if(valid) {
                        let body = this.registerForm
                        this.setUrl('/api/user/add').setBody(body).forPost((data, error) => {
                            if(data.code === 200 ){
                                iView.Message.success(data.description)
                                this.switchForm = true
                            }else{
                                iView.Message.info(result.description)
                            }
                        })
                    }
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
    .form-container{
        display: none;
    }
    .form-container.current{
        display: block;
    }
    form{
        height:70%;
    }
    .form-element {
        width: 80%;
        margin-left: 10%;
    }
    .opt{
        height:70px;
        line-height:70px;
    }
    .opt span{
        margin:20px;
        color:#ababab;
        padding-bottom:3px;
        font-size:16px;
        cursor:pointer
    }
    .opt span.current{
        color:#569bda;
        border-bottom:2px solid #569bda;
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
    .ivu-form{
         /*width: 80%;*/
         /*margin-left: 10%;*/
     }
</style>
