<template>
    <div>
        <Row>
            <Col span="12" class="tree-container">
                <h3 class="title-container">选择用户</h3>
                <Tree class="tree" :data="roleTree" :show-checkbox="false" :multiple="false"  @on-select-change="handleTreeClick"></Tree>
            </Col>
            <Col span="12" class="tree-container">
                <h3 class="title-container">选择菜单</h3>
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
                    <Col span="24">
                    <Form ref="menuForm" :label-width="80" :model="formItem" :rules="rules">
                        <FormItem label="菜单名称" prop="labelName">
                            <Input v-model="formItem.labelName" placeholder="请输入菜单名称"></Input>
                        </FormItem>
                        <FormItem label="key值" prop="currentKey">
                            <Input v-model="formItem.currentKey" placeholder="key值为父节点key值+自定义数字">
                                <Button slot="prepend">{{formItem.parentKey}}</Button>
                            </Input>
                        </FormItem>
                        <FormItem label="描述">
                            <Input v-model="formItem.description" placeholder="请输入描述信息"></Input>
                        </FormItem>
                        <FormItem label="图标">
                            <Select v-model="formItem.icon" placeholder="请选择图标">
                                <Option value="beijing">New York</Option>
                                <Option value="shanghai">London</Option>
                                <Option value="shenzhen">Sydney</Option>
                            </Select>
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
                        currentKey : this.formItem.parentKey + val
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
                layerLoading:false,
                formItem: {
                    labelName: '',
                    currentKey: '',
                    description: '',
                    icon:'',
                    parentKey:''
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
                data.forEach((val)=>{
                    let children = []
                    if(val.children){
                        val.children.forEach((val)=>{
                            children.push({
                                currentKey:val.menu.currentKey,
                                title:val.menu.labelName,
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
                                            h('span', data.title)
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
                                                props: Object.assign({}, this.buttonProps, {
                                                    type: 'plus-round'
                                                }),
                                                style: {
                                                    width: '26px',
                                                    marginLeft: '6px',
                                                    cursor:'pointer'
                                                }
                                            })
                                        ])
                                    ]);
                                },
                                parentKey:val.menu.parentKey
                            })
                        })
                    }
                    menuTree.push({
                        currentKey:val.menu.currentKey,
                        title:val.menu.labelName,
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
                                    h('span', data.title)
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
                                        },
                                        on: {
                                            click: () => {
                                                console.log(1)
                                            }
                                        }
                                    }),
                                    // h('Icon', {
                                    //     props: {
                                    //         type: 'edit'
                                    //     },
                                    //     style: {
                                    //         width: '26px',
                                    //         marginLeft: '6px',
                                    //         cursor:'pointer'
                                    //     },
                                    //     on: {
                                    //         click: () => {
                                    //             console.log(2)
                                    //         }
                                    //     }
                                    // })
                                ])
                            ]);
                        },
                        children:children
                    })
                })
                this.defaultMenu = _.cloneDeep(menuTree)
                this.menuTree = menuTree
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
                            iView.Message.success(result.description)
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            },

            //添加菜单
            showAddMenu(data){
                this.formItem.parentKey = data.currentKey
                this.showLayer = true
            },
            handleCancel(){
                this.showLayer = false
            },
            handleOk(){
                this.$refs['menuForm'].validate((valid) => {
                    if (valid) {
                        this.layerLoading = false
                        this.HandleAddMenu()
                    } else {
                        this.$Message.error('验证失败!')
                    }
                })
                this.showLayer = false
            },
            HandleAddMenu(){
                let body = this.formItem
                body.currentKey = body.parentKey + body.currentKey
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
            //编辑信息
            showEditMenu(){
                getData('', (result) => {
                    if(result){
                        this.formItem = result
                    }
                })
            },
            HandleEditMenu(){

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
</style>
