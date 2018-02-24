<template>
    <div>
        <h3 class="title-container">用户列表</h3>
        <Row>
            <Col span="24" class="btn">
                <Button type="primary" @click="openLayer">新建</Button>
                <Button type="default" @click="editLayer">查看</Button>
                <Button type="error" @click="delData">禁用</Button>
            </Col>
            <Col span="24">
                <Table @on-current-change="addId" highlight-row :columns="colData" :data="tableData" size="small" ref="table"></Table>
            </Col>
        </Row>

        <mLayer :value="showLayer" :titleText="titleText" @on-cancel="handleCancel" @on-ok="handleOk" :loading="layerLoading">
            <div>
                <Form ref="formItem" :model="formItem" :label-width="120" :rules="rules">
                    <FormItem label="用户名" prop="userName" :show-message="!changeRole">
                        <Input v-model="formItem.userName" placeholder="请输入用户名" :readonly="changeRole" :disabled="changeRole"></Input>
                    </FormItem>
                    <FormItem label="昵称" prop="nickName" :show-message="!changeRole">
                        <Input v-model="formItem.nickName" placeholder="请输入昵称" :readonly="changeRole" :disabled="changeRole"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password" v-if="!changeRole">
                        <Input type="password" v-model="formItem.password" placeholder="请输入密码"></Input>
                    </FormItem>
                    <FormItem label="选择用户角色" prop="role" v-if="changeRole">
                        <Select v-model="formItem.role" multiple>
                            <Option v-for="item in defaultRole" :value="item.id">{{ item.roleName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </mLayer>
    </div>
</template>

<script>
    import { getData } from 'utils/actionUtils'
    import _ from 'lodash'
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
                            if(this.validResult === true){
                                this.validResult = false
                            }
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
                colData: [
                    {
                        "title": "用户名",
                        "key": "userName"
                    },
                    {
                        "title": "昵称",
                        "key": "nickName"
                    },
                    {
                        "title": "状态",
                        "key": "flag"
                    },
                    {
                        "title": "角色",
                        "key": "roles",
                        render: (h, params) =>{
                            let roleList = params.row.roles
                            let roleContainer = []
                            for(let i=0;i<roleList.length;i++){
                                roleContainer.push(h('span',
                                    {
                                        style:{
                                            marginLeft: '5px'
                                        }
                                    },
                                    roleList[i].roleName
                                ))
                            }
                            return h('div', roleContainer)
                        }
                    }
                ],
                tableData:[],
                showLayer:false,
                layerLoading:false,
                titleText:'新建用户',
                formItem: {
                    userName: '',
                    nickName: '',
                    password: '',
                    role:[]
                },
                defaultForm:{
                    userName: '',
                    nickName: '',
                    password: '',
                    role:[]
                },
                rules: {
                    userName: [
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
                },
                validResult:true,
                currentData:null,
                roleList:[],
                defaultRole:[],
                changeRole:false
            }
        },
        watch:{},
        mounted() {
            this.init()
        },
        methods: {
            init(){
                this.getUserData()
            },
            getUserData(){
                getData('/api/user/findLike', (result) => {
                    if(result){
                        this.tableData =result
                    }
                })
            },
            //新建用户
            openLayer(){
                this.titleText = '新建用户'
                this.changeRole = false
                this.formItem = _.cloneDeep(this.defaultForm)
                this.showLayer = true
                this.layerLoading = true
            },
            //点击ok
            handleOk(){
                this.layerLoading = false
                if(this.changeRole){
                    this.HandleChangeRole()
                }else{
                    this.handleSubmit('formItem')
                }
                setTimeout(()=>{this.layerLoading = true},500)
            },
            //点击取消
            handleCancel(){
                this.showLayer = false
                this.$refs['formItem'].resetFields()
            },
            //提交用户信息
            submitMessage(){
                delete this.formItem.role
                let url ={
                    method:'POST',
                    body:this.formItem,
                    url:'/api/user/add'
                }
                getData(url, (result) => {
                    if(result.code === 200 ){
                        iView.Message.success(result.description)
                        this.showLayer = false
                        this.getUserData()
                    }else{
                        iView.Message.info(result.description)
                    }
                })
            },
            //提交验证
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submitMessage()
                        this.showLayer = false
                        this.$refs['formItem'].resetFields()
                    } else {
                        this.$Message.error('验证失败!')
                    }
                })
            },
            //存id
            addId(arg){
                this.currentData = arg
            },
            //按id禁用用户
            delData(){
                if(!this.currentData){
                    iView.Message.error('请选择一条数据！')
                    return
                }
                let url ={
                    method:'DELETE',
                    pathParams:{
                        userId :this.currentData.id
                    },
                    url:'/api/user/del/{userId}'
                }
                getData(url, (result) => {
                    if(result){
                        iView.Message.success(result.description)
                        this.getUserData()
                    }
                })
            },

            //查看编辑用户信息
            editLayer(){
                if(!this.currentData){
                    iView.Message.error('请选择一条数据！')
                    return
                }
                this.formItem.userName = _.get(this.currentData,'userName')
                this.formItem.nickName = _.get(this.currentData,'nickName')
                let List = _.get(this.currentData,'roles',[])

                this.formItem.role = []
                for(let i = 0;i<List.length;i++){
                    this.formItem.role.push(List[i].id)
                }
                this.changeRole = true
                this.getDefaultRole()
            },
            //获取所有可分配的角色
            getDefaultRole(){
                getData('/api/role/roles', (result) => {
                    if(result){
                        this.defaultRole = result
                        this.showLayer = true
                        this.titleText = '编辑用户信息'
                        this.layerLoading = true
                    }
                })
            },
            //提交角色更改
            HandleChangeRole(){
                let url ={
                    method:'POST',
                    pathParams:{
                        userId :this.currentData.id
                    },
                    body: this.formItem.role,
                    url:'/api/user/changeRole/{userId}'
                }
                getData(url, (result) => {
                    if(result){
                        if(result.code === 200 ){
                            iView.Message.success(result.description)
                            this.showLayer = false
                            this.$refs['formItem'].resetFields()
                            this.getUserData()
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .title-container{
        padding-bottom: 8px;
        margin-bottom: 5px;
        font-size: 17px;
    }
    .btn{
        margin: 5px 0;
        padding: 5px 15px;
        text-align: right;
    }
</style>
