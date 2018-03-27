<template>
    <div class="container">
        <h3 class="title-container">用户列表</h3>
        <Row>
            <Col span="24" class="btn">
                <Button class="button" type="primary" @click="openLayer">新建</Button>
                <Button class="button" type="default" @click="showChangeRole">分配角色</Button>
                <Button class="button" type="default" @click="editLayer">重置用户</Button>
                <Button class="button" type="error" @click="delData">禁用</Button>
            </Col>
            <Col span="24">
                <Table @on-row-click="addId" highlight-row :columns="colData" :data="tableData" size="small" ref="table"></Table>
            </Col>
            <Col span="24" class="page-container" ref="pageCt">
                <Page :total="dataTotal" :current="currentPage" @on-change="pageChange"></Page>
            </Col>
        </Row>

        <mLayer :value="showLayer" :titleText="titleText" @on-cancel="handleCancel" @on-ok="handleOk" :loading="layerLoading">
            <div>
                <Form ref="formItem" :model="formItem" :label-width="120" :rules="rules">
                    <FormItem label="用户名" prop="username" :show-message="!changeRole">
                        <Input v-model="formItem.username" placeholder="请输入用户名" :readonly="changeRole" :disabled="changeRole"></Input>
                    </FormItem>
                    <FormItem label="昵称" prop="nickName" :show-message="!changeRole">
                        <Input v-model="formItem.nickName" placeholder="请输入昵称" :readonly="changeRole" :disabled="changeRole"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password" v-if="!changeRole">
                        <Input type="password" v-model="formItem.password" placeholder="请输入密码"></Input>
                    </FormItem>
                    <FormItem label="选择用户角色" prop="roles">
                        <Select v-model="formItem.roles" multiple>
                            <Option v-for="item in defaultRole" :value="item.id">{{ item.roleName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </mLayer>

        <mLayer :value="showEditLayer" titleText="重置用户信息" @on-cancel="handleEditCancel" @on-ok="handleEditOk" :loading="layerEditLoading">
            <div>
                <Form ref="editForm" :model="editForm" :label-width="120" :rules="editRules">
                    <FormItem label="用户名" prop="username" :show-message="!changeRole">
                        <Input v-model="editForm.username" placeholder="请输入用户名" :readonly="changeRole" :disabled="changeRole"></Input>
                    </FormItem>
                    <FormItem label="昵称" prop="nickName" :show-message="!changeRole">
                        <Input v-model="editForm.nickName" placeholder="请输入昵称"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input type="password" v-model="editForm.password" placeholder="请输入密码"></Input>
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
                if(!/^[A-Za-z0-9-_]{1,}$/.test(val)){
                    callback('用户名必须为字母，数字，“-”或“_”组成')
                }

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
                colData: [
                    {
                        "title": "用户名",
                        "key": "username",
                        'align':'center'
                    },
                    {
                        "title": "昵称",
                        "key": "nickName",
                        'align':'center'
                    },
                    // {
                    //     "title": "状态",
                    //     'align':'center',
                    //     "key": "flag",
                    //     render: (h, params) =>{
                    //         return h('span', params.row.flag === 0?'可用':'禁用')
                    //     }
                    // },
                    {
                        "title": "角色",
                        "key": "roles",
                        'align':'center',
                        render: (h, params) =>{
                            if(!params.row.roles){
                                return h('div', '')
                            }
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
                allData:[],
                dataTotal:10,
                currentPage:1,

                showLayer:false,
                layerLoading:false,
                titleText:'新建用户',

                showEditLayer:false,
                layerEditLoading:false,
                formItem: {
                    username: '',
                    nickName: '',
                    password: '',
                    roles:[]
                },
                defaultForm:{
                    username: '',
                    nickName: '',
                    password: '',
                    roles:[]
                },
                editForm:{
                    username: '',
                    nickName: '',
                    password: '',
                    id:'',
                },
                rules: {
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
                },
                editRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { validator:nameValid , trigger: 'blur' }
                    ],
                    nickName: [
                        { required: true, validator:nickValid,trigger: 'blur' }
                    ],
                    password: [
                        {  message: '请输入密码', trigger: 'blur' },
                        { validator:passValid,trigger: 'blur' }
                    ]
                },
                currentData:null,
                roleList:[],
                defaultRole:[],
                changeRole:false,
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
            //获得角色列表
            getUserData(){
                getData('/api/users', (result) => {
                    if(result){
                        this.dataTotal = result.length
                        this.allData = result
                        this.tableData = result.slice(0,10)
                        this.$nextTick(function() {
                            this.$refs.pageCt.$el.querySelector('.ivu-page-item').click()
                        })
                    }
                })
            },
            //切换页
            pageChange(page){
                this.currentData = ''
                this.tableData = this.allData.slice(10*(page-1),10*page)
            },

            //新建用户
            openLayer(){
                this.getDefaultRole(()=>{
                    this.titleText = '新建用户'
                    this.changeRole = false
                    this.formItem = _.cloneDeep(this.defaultForm)
                    this.showLayer = true
                    this.layerLoading = true
                })
            },
            handleOk(){
                this.layerLoading = false
                if(this.changeRole){
                    this.HandleChangeRole()
                }else{
                    this.handleSubmit('formItem')
                }
                this.currentData = ''
                setTimeout(()=>{this.layerLoading = true},500)
            },
            handleCancel(){
                this.showLayer = false
                this.clearForm('formItem')
            },
            //提交验证
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submitMessage()
                        this.showLayer = false
                    } else {
                        this.$Message.error('验证失败!')
                    }
                })
            },
            //提交用户信息
            submitMessage(){
                this.formItem.roles = this.getRoleList(this.formItem.roles)
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
                        this.clearForm('formItem')
                    }else{
                        iView.Message.info(result.description)
                    }
                })
            },

            //更改角色
            showChangeRole(){
                if(!this.currentData){
                    iView.Message.error('请选择一条数据！')
                    return
                }
                this.formItem.username = _.get(this.currentData,'username')
                this.formItem.nickName = _.get(this.currentData,'nickName')
                let List = _.get(this.currentData,'roles',[])

                this.formItem.roles = []
                for(let i = 0;i<List.length;i++){
                    this.formItem.roles.push(List[i].id)
                }
                this.changeRole = true
                this.getDefaultRole(()=>{
                    this.showLayer = true
                    this.titleText = '分配用户权限'
                    this.layerLoading = true
                })
            },
            //获取所有可分配的角色
            getDefaultRole(callback){
                getData('/api/role/roles', (result) => {
                    if(result){
                        result.forEach((v,i)=>{
                            result[i] = this.filterObj(v)
                        })
                        this.defaultRole = result
                        callback()
                    }
                })
            },
            //提交角色更改
            HandleChangeRole(){
                let body = this.getRoleList(this.formItem.roles)

                let url ={
                    method:'POST',
                    body: body,
                    pathParams:{
                        userId :this.currentData.id
                    },
                    url:'/api/user/changeRole/{userId}'
                }
                getData(url, (result) => {
                    if(result){
                        if(result.code === 200 ){
                            iView.Message.success(result.description)
                            this.showLayer = false
                            this.clearForm('formItem')
                            this.getUserData()
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            },
            //获取可用角色列表
            getRoleList(role){
                let list = []
                let roles = new Set(role)
                this.defaultRole.forEach(value => {
                    if(roles.has(value.id)){
                        list.push(value)
                        return
                    }
                })
                return list
            },

            //存行信息
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

            //重置用户信息
            editLayer(){
                if(!this.currentData){
                    iView.Message.error('请选择一条数据！')
                    return
                }
                this.editForm.username = _.get(this.currentData,'username')
                this.editForm.nickName = _.get(this.currentData,'nickName')
                this.editForm.id = _.get(this.currentData,'id')
                this.changeRole=true

                this.showEditLayer=true
            },
            handleEditOk(){
                this.layerEditLoading = false
                this.handleReset()
                this.currentData = ''
                setTimeout(()=>{this.layerEditLoading = true},500)
            },
            handleEditCancel(){
                this.showEditLayer = false
            },
            handleReset(){
                let url ={
                    method:'POST',
                    body: this.editForm,
                    url:'/api/user/reset'
                }
                getData(url, (result) => {
                    if(result){
                        if(result.code === 200 ){
                            iView.Message.success(result.description)
                            this.showEditLayer = false
                            this.clearForm('editForm')
                            this.getUserData()
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            },

            /*工具类*/
            //表格验证清空+对象清空
            clearForm(name){
                this.$refs[name].resetFields()
                Object.keys(this[name]).forEach(v=>{
                    this[name][v] = ''
                })
            },
            //过滤对象属性null
            filterObj(obj){
                Object.keys(obj).forEach(value => {
                    if(obj[value] === null ){
                        delete obj[value]
                    }
                })
                return obj
            }
        }
    }
</script>
<style scoped>
    .container{
        margin: 15px 30px auto;
    }

    .title-container{
        padding-bottom: 10px;
        margin-bottom: 15px;
        font-size: 18px;
        border-bottom: 1px solid #ccc;
    }
    .btn{
        margin: 5px 0;
        padding: 5px 15px;
        text-align: right;
    }
    .button{
        margin-left: 8px;
    }
    .page-container{
        margin-top: 10px;
        text-align: right;
    }
</style>
