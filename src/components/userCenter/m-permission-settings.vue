<template>
    <div class="container">
        <h3 class="title-container">角色权限</h3>
        <Row>
            <Col span="12" class="tree-container">
                <div class="head-container" @click="addRole" >角色列表  <Icon type="plus-round"style="cursor: pointer;margin-left: 10px"></Icon></div>
                <Tree class="tree" :data="roleTree" :show-checkbox="false" :multiple="false"  @on-select-change="handleTreeClick"></Tree>
            </Col>
            <Col span="12" class="tree-container">
                <div class="head-container" @click="showAddMenu">菜单列表  <Icon type="plus-round"style="cursor: pointer;margin-left: 10px"></Icon></div>
                <Tree class="tree" :data="menuTree" show-checkbox  @on-select-change="handleTreeClick" @on-check-change="handleTreeCheck"></Tree>
            </Col>
        </Row>
        <Row>
            <Col span="24" class="btn">
                <Button type="primary" @click="handleSubmit">保存</Button>
            </Col>
        </Row>


        <mLayer :value="showLayer" titleText="添加菜单" @on-cancel="handleCancel" @on-ok="handleOk" :loading="layerLoading">
            <div>
                <Row>
                    <Col span="24" class="layerSection">
                        <h4>菜单信息</h4>
                        <Form ref="menuForm" :label-width="120" :model="formItem" :rules="rules">
                            <FormItem label="菜单名称" prop="labelName">
                                <Input v-model="formItem.labelName" placeholder="请输入菜单名称"></Input>
                            </FormItem>
                            <FormItem label="key值" prop="currentKey">
                                <Input v-model="formItem.currentKey" placeholder="key值为父节点key值+自定义数字">
                                    <Button slot="prepend" v-if="formItem.parentKey">{{formItem.parentKey}}</Button>
                                </Input>
                            </FormItem>
                            <FormItem label="描述">
                                <Input v-model="formItem.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                            <FormItem label="图标">
                                <Select v-model="formItem.icon" placeholder="请选择图标" filterable>
                                    <mIconList></mIconList>
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span="24" class="layerSection">
                        <h4>权限信息</h4>
                        <Form ref="powerForm" :label-width="120" :model="powerForm" :rules="powerRules">
                            <FormItem label="权限名称" prop="authorityName">
                                <Input v-model="powerForm.authorityName" placeholder="请输入权限名称"></Input>
                            </FormItem>
                            <FormItem label="权限英文名称" prop="alphaName">
                                <Input v-model="powerForm.alphaName" placeholder="请输入权限英文名称"></Input>
                            </FormItem>
                            <FormItem label="id" prop="authorityExpression">
                                <Input v-model="powerForm.authorityExpression" placeholder="请输入id"></Input>
                            </FormItem>
                            <FormItem label="描述">
                                <Input v-model="powerForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        </mLayer>

        <mLayer :value="showEditLayer" titleText="编辑菜单" @on-cancel="handleEditCancel" @on-ok="handleEditOk" :loading="layerEditLoading">
            <div>
                <Row>
                    <Col span="24" class="layerSection">
                        <h4>菜单信息</h4>
                        <Form ref="editForm" :label-width="120" :model="editForm" :rules="editRules">
                            <FormItem label="菜单名称" prop="labelName">
                                <Input v-model="editForm.labelName" placeholder="请输入菜单名称"></Input>
                            </FormItem>
                            <FormItem label="key值">
                                <Input v-model="editForm.currentKey" placeholder="key值为父节点key值+自定义数字">
                                </Input>
                            </FormItem>
                            <FormItem label="描述" prop="description">
                                <Input v-model="editForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                            <FormItem label="图标">
                                <Select v-model="editForm.icon" placeholder="请选择图标" filterable>
                                    <mIconList></mIconList>
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span="24" class="layerSection">
                        <h4>权限信息</h4>
                        <Form ref="powerForm" :label-width="120" :model="powerForm" :rules="powerRules">
                            <FormItem label="权限名称" prop="authorityName">
                                <Input v-model="powerForm.authorityName" placeholder="请输入权限名称"></Input>
                            </FormItem>
                            <FormItem label="权限英文名称" prop="alphaName">
                                <Input v-model="powerForm.alphaName" placeholder="请输入权限英文名称"></Input>
                            </FormItem>
                            <FormItem label="id" prop="authorityExpression">
                                <Input v-model="powerForm.authorityExpression" placeholder="请输入id"></Input>
                            </FormItem>
                            <FormItem label="描述">
                                <Input v-model="powerForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        </mLayer>

        <mLayer :value="showRoleLayer" titleText="添加角色" @on-cancel="handleRoleCancel" @on-ok="handleRoleOk" :loading="layerRoleLoading">
            <div>
                <Row>
                    <Col span="24">
                        <Form ref="roleForm" :label-width="120" :model="roleForm" :rules="roleRules">
                            <FormItem label="角色名称" prop="roleName">
                                <Input v-model="roleForm.roleName" placeholder="请输入角色名称"></Input>
                            </FormItem>
                            <FormItem label="角色英文名称" prop="roleType">
                                <Input v-model="roleForm.roleType" placeholder="请输入角色英文名称"></Input>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
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
            //验证菜单名
            const labelValid =(rule, val, callback)=>{
                let url ={
                    pathParams:{
                        menuName : val,
                        parentKey : this.formItem.parentKey
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
            //验证菜单key值是否重复
            const keyValid =(rule,val,callback)=>{
                if(!val){
                    callback('请输入key值！')
                    return
                }else if(!/^.{1,254}$/.test(val)){
                    callback('输入的字符数太多了！')
                    return
                }

                let url ={
                    pathParams:{
                        currentKey : this.formItem.parentKey?this.formItem.parentKey:'' + val
                    },
                    url:'/api/menu/usable/{currentKey}'
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
            return {
                roleTree: [],
                defaultMenu:[],
                menuTree:[],
                currentRole:'',
                checkList:[],

                showLayer:false,
                showRoleLayer:false,
                layerLoading:false,
                layerRoleLoading:false,
                showEditLayer:false,
                layerEditLoading:false,

                currentKey:'',

                formItem: {
                    labelName: '',
                    currentKey: '',
                    description: '',
                    icon:'',
                    parentKey:''
                },
                powerForm:{
                    authorityName:'',
                    description:'',
                    authorityExpression:'',
                    alphaName:''
                },
                editForm:{
                    labelName: '',
                    currentKey: '',
                    description: '',
                    icon:'',
                    id:'',
                    parentKey:''
                },
                roleForm: {
                    roleName: '',
                    roleType: ''
                },
                cKey:'',
                rules: {
                    labelName: [
                        { required: true, message:'请输入用户名', trigger: 'blur' }
                    ],
                    currentKey: [
                        { required: true, validator:keyValid , trigger: 'blur' }
                    ]
                },
                powerRules: {
                    authorityName: [
                        { required: true, message:'请输入权限名', trigger: 'blur' }
                    ],
                    authorityExpression: [
                        { required: true, message:'请输入id', trigger: 'blur' }
                    ],
                    alphaName: [
                        { required: true, message:'请输入权限英文名', trigger: 'blur' }
                    ]
                },
                editRules: {
                    labelName: [
                        { required: true, message:'请输入用户名', trigger: 'blur' }
                    ]
                },
                roleRules: {
                    roleName: [
                        { required: true, message:'请输入角色名称', trigger: 'blur' }
                    ],
                    roleType: [
                        { required: true, message:'请输入角色英文名称', trigger: 'blur' }
                    ]
                },
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init(){
                this.getRoleData()
                this.getDefaultMenu()
            },
            //获得角色列表并处理
            getRoleData(){
                getData('/api/role/roles', (result) => {
                    if(result){
                        this.handleRoleData(result)
                    }
                })
            },
            handleRoleData(data){
                let roleTree = []
                data.forEach((val)=>{
                    roleTree.push({
                        roleType:val.roleType,
                        title:val.roleName
                    })
                })
                this.roleTree = roleTree
            },
            //获得默认的菜单列表并处理
            getDefaultMenu(){
                getData('/api/menu/menus', (result) => {
                    if(result){
                        this.handleMenuData(result)
                    }
                })
            },
            handleMenuData(data){
                let menuTree = []
                menuTree = this.handleTreeData(data)
                this.defaultMenu = _.cloneDeep(menuTree)
                this.menuTree = menuTree
            },
            handleTreeData(data){
                let menuTree = []
                data.forEach((val)=>{
                    let children = []
                    if(val.children){
                        children = this.handleTreeData(val.children)
                    }
                    menuTree.push({
                        currentKey:val.menu.currentKey,
                        title:val.menu.labelName,
                        labelName : val.menu.labelName,
                        id : val.menu.id,
                        render: (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '6px'
                                        }
                                    }),
                                    h('span',{
                                        style: {
                                            cursor : 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                this.showEditMenu(data)
                                            }
                                        }
                                    }, data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        marginRight: '16px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showAddMenu(data)
                                        }
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'plus-round'
                                        },
                                        style: {
                                            width: '26px',
                                            marginLeft: '6px',
                                            cursor:'pointer'
                                        }
                                    })
                                ])
                            ]);
                        },
                        description : val.menu.description,
                        icon : val.menu.icon,
                        parentKey:val.menu.parentKey?val.menu.parentKey:'',
                        children:children,
                    })
                })
                return menuTree
            },

            //根据选中的角色展示显示的菜单
            getMenuData(){
                if(!this.currentRole){
                    this.menuTree = this.defaultMenu
                    return
                }
                let url ={
                    method:'POST',
                    pathParams:{
                        role : this.currentRole
                    },
                    url:'/api/role/menus/{role}'
                }
                getData(url, (result) => {
                    if(result){
                        let tree = _.cloneDeep(this.defaultMenu)
                        this.menuTree = this.handleMenu(tree,result)
                    }
                })
            },
            handleMenu(data,list){
                for(let i = 0;i<data.length;i++){
                    if(data[i].children){
                        data[i].children = this.handleMenu(data[i].children,list)
                    }else{
                        for(let j = list.length-1;j>=0;j--){
                            if(list[j] === data[i].currentKey){
                                data[i].checked = true
                                list.splice(j,1)
                                break
                            }
                        }
                    }
                }
                return data
            },

            //获取勾选权限列表
            handleTreeCheck(arg){
                let checkList = []
                arg.forEach((v)=>{
                    if(!v.children){
                        checkList.push(v.currentKey)
                    }
                })
                this.checkList = checkList
            },
            //点击左侧人员获得权限信息
            handleTreeClick(arg){
                if(arg.length !== 0){
                    this.currentRole = arg[0].roleType
                }else{
                    this.currentRole = ''
                }
                this.getMenuData()
            },
            //提交权限信息
            handleSubmit(){
                if(!this.currentRole){
                    iView.Message.warning('请选择角色！')
                    return
                }
                let url ={
                    method:'POST',
                    pathParams:{
                        role : this.currentRole
                    },
                    body: this.checkList,
                    url:'/api/role/menus/update/{role}'
                }
                getData(url, (result) => {
                    if(result){
                        if(result.code === 200 ){
                            this.layerLoading = false
                            iView.Message.success(result.description)
                            this.showLayer = false
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            },

            //添加菜单
            showAddMenu(data){
                if(data.currentKey){this.formItem.parentKey = data.currentKey}
                this.showLayer = true
                this.layerLoading = true
            },
            handleCancel(){
                this.showLayer = false
                this.$refs['menuForm'].resetFields()
            },
            handleOk(){
                this.layerLoading = false
                this.HandleValid('menuForm',()=>{
                    this.HandleValid('powerForm',()=>{
                        this.HandleAddMenu()
                        this.showLayer = false
                        this.getDefaultMenu()
                        if(this.currentRole){
                            this.getMenuData()
                        }
                    })
                })
                setTimeout(()=>{this.layerLoading = true},500)
            },
            HandleAddMenu(){
                let body = this.formItem
                body.currentKey = body.parentKey?body.parentKey:'' + body.currentKey
                body.authority = _.cloneDeep(this.powerForm)
                let url ={
                    method:'POST',
                    body:body,
                    url:'/api/menu/add'
                }
                getData(url, (result) => {
                    if(result){
                        if(result.code === 200 ){
                            iView.Message.success(result.description)
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            },

            //打开添加角色
            addRole(){
                this.showRoleLayer = true
                this.layerRoleLoading = true
            },
            handleRoleCancel(){
                this.showRoleLayer = false
                this.$refs['roleForm'].resetFields()
            },
            handleRoleOk(){
                this.layerRoleLoading = false
                this.HandleValid('roleForm',()=>{
                    this.handleAddRole()
                    this.showRoleLayer = false
                    this.getRoleData()
                })
                setTimeout(()=>{this.layerRoleLoading = true},500)
            },
            handleAddRole(){
                let url ={
                    method:'POST',
                    body:this.roleForm,
                    url:'/api/role/add'
                }
                getData(url, (result) => {
                    if(result){
                        if(result.code === 200 ){
                            iView.Message.success(result.description)
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            },

            //编辑菜单信息
            showEditMenu(data){
                Object.keys(this.editForm).forEach(v=>{
                    this.editForm[v] = _.get(data,v,'')
                })
                if(data.id){this.getPowerData(data.id)}

                this.showEditLayer = true
                this.layerEditLoading = true
            },
            handleEditOk(){
                this.layerEditLoading = false
                this.HandleValid('editForm',()=>{
                    this.showEditLayer = false
                    this.HandleEditMenu()
                    this.getDefaultMenu()
                })
                setTimeout(()=>{this.layerEditLoading = true},500)
            },
            handleEditCancel(){
                this.showEditLayer = false
                this.$refs['editForm'].resetFields()
            },
            HandleEditMenu(){
                let body = this.editForm
                body.currentKey = body.parentKey?body.parentKey:'' + body.currentKey
                body.authority = _.cloneDeep(this.powerForm)
                let url ={
                    method:'POST',
                    body: body,
                    url:'/api/menu/update'
                }
                getData(url, (result) => {
                    if(result){
                        if(result.code === 200 ){
                            iView.Message.success(result.description)
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            },
            //编辑时请求权限数据
            getPowerData(id){
                let url ={
                    method:'GET',
                    pathParams:{
                        id : id
                    },
                    url:'/api/authority/one/{id}'
                }
                getData(url, (result) => {
                    if(result && Object.keys(result)){
                        Object.keys(this.powerForm).forEach(v=>{
                            this.editForm[v] = _.get(result,v,'')
                        })
                    }
                })
            },

            //验证信息
            HandleValid(name,callback){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        callback()
                        this.$refs[name].resetFields()
                    } else {
                        this.$Message.error('验证失败!')
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .container{
        padding: 0 8px;
    }

    .title-container{
        padding-bottom: 5px;
        margin-bottom: 5px;
        font-size: 18px;
        border-bottom: 1px solid #ccc;
    }

    .head-container{
        padding-bottom: 6px;
        margin-bottom: 3px;
        font-size: 14px;
    }
    .tree-container{
        padding: 5px 10px;
        font-size: 20px;
    }
    .tree{
        padding: 5px 10px;
    }
    .btn{
        margin: 5px 0;
        padding: 5px 15px;
        text-align: right;
    }
    .tree-container .ivu-tree-title{
        color: #00ff00;
        font-size: 18px !important;
    }
    .ivu-tree ul li{
        font-size: 18px !important;
    }
    .tree ul.ivu-tree-children li li{
        font-size: 16px;
    }
    .tree ul.ivu-tree-children li li li{
        font-size: 14px;
    }

    .layerSection{
        padding: 0 7px;
    }
    .layerSection h4{
        font-weight: normal;
        border-bottom: 1px solid #ccc;
        margin-bottom: 18px;
        padding-bottom: 8px;
    }
</style>
