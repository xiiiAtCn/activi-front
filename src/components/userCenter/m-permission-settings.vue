<template>
    <div class="container">
        <h3 class="title-container">角色权限</h3>
        <Row>
            <Col span="12" class="tree-container">
                <div class="head-container" @click="addRole" >角色列表  <Icon type="plus-round"style="cursor: pointer;margin-left: 10px"></Icon></div>
                <Tree class="tree" :data="roleTree" :show-checkbox="false" :multiple="false"></Tree>
            </Col>
            <Col span="12" class="tree-container">
                <div class="head-container" @click="showAddMenu">菜单列表  <Icon type="plus-round"style="cursor: pointer;margin-left: 10px"></Icon></div>
                <Tree class="tree" :data="menuTree" show-checkbox @on-check-change="handleTreeCheck"></Tree>
            </Col>
        </Row>

        <div class="btn">
            <Button @click="selectAll">选中所有</Button>
            <Button @click="resetSelect">重置菜单</Button>
            <Button @click="foldMenu">折叠菜单</Button>
            <Button type="primary" @click="handleSubmitConfirm">保存</Button>
        </div>


        <mLayer :value="showLayer" titleText="添加菜单" @on-cancel="handleCancel" @on-ok="handleOk" :loading="layerLoading">
            <div>
                <Row>
                    <Col span="24" class="layerSection">
                        <h4>菜单信息</h4>
                        <Form ref="menuForm" :label-width="120" :model="menuForm" :rules="rules">
                            <FormItem label="菜单名称" prop="title">
                                <Input v-model="menuForm.title" placeholder="请输入菜单名称"></Input>
                            </FormItem>
                            <FormItem label="key值" prop="currentKey">
                                <Input v-model="menuForm.currentKey" placeholder="key值为父菜单key值+自定义数字">
                                    <span slot="prepend" >{{menuForm.parentKey||'无父菜单'}}</span>
                                </Input>
                            </FormItem>
                            <FormItem label="描述">
                                <Input v-model="menuForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                            <FormItem label="选择URL类型" v-if="menuForm.parentKey">
                                <RadioGroup v-model="menuForm.urlType">
                                    <Radio :label="item.label" v-for="(item,key) in urlTypeList" :key="key">{{item.value}}</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="选择后生成URL" v-show="menuForm.urlType !== 'other'" v-if="menuForm.parentKey">
                                <Row>
                                    <Col span="11">
                                        <Select v-model="menuForm.selectResultKey" placeholder="请选择类型" filterable @on-change="selectChange">
                                            <Option v-for="(item,key) in selectList" :key="key" :value="key">{{item.name}}</Option>
                                        </Select>
                                    </Col>
                                    <Col span="2" style="text-align: center" v-show="menuForm.urlType === 'resource'">-选择metaKey:</Col>
                                    <Col span="11" v-show="menuForm.urlType === 'resource'">
                                        <Select v-model="menuForm.metaKey" placeholder="请选择类型" @on-change="generateUrl">
                                            <Option v-for="(item,key) in metaKeyList" :key="key" :value="item.formName">{{item.nodeName}}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="URL" v-if="menuForm.parentKey">
                                <Input v-model="menuForm.url" placeholder="请输入URL"></Input>
                            </FormItem>
                            <FormItem label="背景图" v-if="!menuForm.parentKey">
                                <Input v-model="menuForm.picUrl" placeholder="请输入背景图URL"></Input>
                            </FormItem>
                            <FormItem label="菜单顺序">
                                <InputNumber :min="0" v-model="menuForm.menuOrder"  style="width:100%;"></InputNumber>
                            </FormItem>
                            <FormItem label="图标">
                                <Select v-model="menuForm.icon" placeholder="请选择图标" filterable>
                                    <mIconList></mIconList>
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span="24" class="layerSection">
                        <h4>权限信息</h4>
                        <Form ref="powerForm" :label-width="120" :model="powerForm" :rules="powerRules">
                            <FormItem label="权限名称" prop="title">
                                <Input v-model="powerForm.title" placeholder="请输入权限名称"></Input>
                            </FormItem>
                            <FormItem label="权限表达式" prop="authority">
                                <Input v-model="powerForm.authority" placeholder="请输入权限表达式"></Input>
                            </FormItem>
                            <FormItem label="描述" prop="description">
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
                            <FormItem label="菜单名称" prop="title">
                                <Input v-model="editForm.title" placeholder="请输入菜单名称"></Input>
                            </FormItem>
                            <FormItem label="key值" prop="currentKey">
                                <Input v-model="editForm.currentKey" placeholder="key值为父菜单key值+自定义数字" readonly disabled>
                                    <span slot="prepend" >{{editForm.parentKey||'无父菜单'}}</span>
                                </Input>
                            </FormItem>
                            <FormItem label="描述" prop="description">
                                <Input v-model="editForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                            <FormItem label="选择URL类型" v-if="editForm.parentKey">
                                <RadioGroup v-model="editForm.urlType">
                                    <Radio :label="item.label" v-for="(item,key) in urlTypeList" :key="key">{{item.value}}</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="选择后生成URL" v-show="editForm.urlType !== 'other'" v-if="editForm.parentKey">
                                <Row>
                                    <Col span="11">
                                    <Select v-model="editForm.selectResultKey" placeholder="请选择类型" filterable @on-change="selectChange">
                                        <Option v-for="(item,key) in selectList" :key="key" :value="key">{{item.name}}</Option>
                                    </Select>
                                    </Col>
                                    <Col span="2" style="text-align: center" v-show="editForm.urlType === 'resource'">-选择metaKey:</Col>
                                    <Col span="11" v-show="editForm.urlType === 'resource'">
                                    <Select v-model="editForm.metaKey" placeholder="请选择类型" @on-change="generateUrl">
                                        <Option v-for="(item,key) in metaKeyList" :key="key" :value="item.formName">{{item.nodeName}}</Option>
                                    </Select>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="URL" v-if="editForm.parentKey">
                                <Input v-model="editForm.url" placeholder="请输入URL"></Input>
                            </FormItem>
                            <FormItem label="背景图" v-if="!editForm.parentKey">
                                <Input v-model="editForm.picUrl" placeholder="请输入背景图URL"></Input>
                            </FormItem>
                            <FormItem label="菜单顺序">
                                <InputNumber :min="0" v-model="editForm.menuOrder" style="width:100%;"></InputNumber>
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
                            <FormItem label="权限名称" prop="title">
                                <Input v-model="powerForm.title" placeholder="请输入权限名称"></Input>
                            </FormItem>
                            <FormItem label="权限表达式" prop="authority">
                                <Input v-model="powerForm.authority" placeholder="请输入权限表达式"></Input>
                            </FormItem>
                            <FormItem label="描述" prop="description">
                                <Input v-model="powerForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        </mLayer>

        <mLayer :value="showRoleLayer" :titleText="roleTitle" @on-cancel="handleRoleCancel" @on-ok="handleRoleOk" :loading="layerRoleLoading">
            <div>
                <Row>
                    <Col span="24">
                        <Form ref="roleForm" :label-width="120" :model="roleForm" :rules="roleRules">
                            <FormItem label="角色名称" prop="title">
                                <Input v-model="roleForm.title" placeholder="请输入角色名称"></Input>
                            </FormItem>
                            <FormItem label="角色英文名称" prop="authority">
                                <Input v-model="roleForm.authority" placeholder="请输入角色英文名称"></Input>
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
    import  bus from '../../router/bus'

    export default{
        data () {
            //验证菜单名
            const labelValid =(rule, val, callback)=>{
                let url ={
                    pathParams:{
                        menuName : val,
                        parentKey : this.menuForm.parentKey
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
                }else if(this.cKey === val){
                    callback()
                    return
                }
                let url ={
                    pathParams:{
                        currentKey : (this.menuForm.parentKey||this.editForm.parentKey||'') + val
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
                defaultList:[],

                showLayer:false,
                showRoleLayer:false,
                layerLoading:false,
                layerRoleLoading:false,
                showEditLayer:false,
                layerEditLoading:false,

                currentKey:'',
                roleTitle:'添加角色',

                urlTypeList:[
                    {
                        value:'资源',
                        label:'resource'
                    },
                    {
                        value:'活动库所',
                        label:'petri'
                    },
                    {
                        value:'其他',
                        label:'other'
                    }
                ],
                selectList:[],
                metaKeyList:[],

                menuForm: {
                    title: '',
                    currentKey: '',
                    description: '',
                    url:'',
                    urlType:'resource',
                    selectResultKey:'',
                    metaKey:'',
                    icon:'',
                    menuOrder:0,
                    picUrl:'',
                    id:'',
                    parentKey:''
                },
                powerForm:{
                    title:'',
                    description:'',
                    authority:'',
                    id:''
                },
                editForm:{
                    title: '',
                    currentKey: '',
                    description: '',
                    url:'',
                    urlType:'resource',
                    selectResultKey:'',
                    metaKey:'',
                    picUrl:'',
                    menuOrder:0,
                    icon:'',
                    id:'',
                    parentKey:''
                },
                roleForm: {
                    title: '',
                    authority: ''
                },
                roleDefault: {
                    title: '',
                    authority: ''
                },
                cKey:'',
                rules: {
                    title: [
                        { required: true, message:'请输入用户名', trigger: 'blur' }
                    ],
                    currentKey: [
                        { required: true, validator:keyValid.bind(this) , trigger: 'blur' }
                    ]
                },
                powerRules: {
                    title: [
                        { required: true, message:'请输入权限名', trigger: 'blur' }
                    ],
                    authority: [
                        { required: true, message:'请输入权限表达式', trigger: 'blur' }
                    ]
                },
                editRules: {
                    title: [
                        { required: true, message:'请输入用户名', trigger: 'blur' }
                    ],
                    currentKey: [
                        { required: true, validator:keyValid.bind(this) , trigger: 'blur' }
                    ]
                },
                roleRules: {
                    title: [
                        { required: true, message:'请输入角色名称', trigger: 'blur' }
                    ],
                    authority: [
                        { required: true, message:'请输入角色英文名称', trigger: 'blur' }
                    ]
                },
            }
        },
        mounted() {
            this.init()
            this.getSelectData()
        },
        methods: {
            selectChange(key){
                if(key === ''){return}
                if(this.menuForm.selectResultKey){
                    if(this.menuForm.urlType === 'petri'){
                        this.setFormUrl('menuForm')
                        return
                    }
                }else{
                    if(this.editForm.urlType === 'petri'){
                        this.setFormUrl('editForm')
                        return
                    }
                }
                this.getmetaKey(this.selectList[key].id)
            },
            getSelectData(){
                getData('/api/placeConfig/getAllPlaceConfig', (result) => {
                    if(result){
                        this.selectList = result
                    }
                })
            },
            getmetaKey(id){
                const url ={
                    method:'GET',
                    pathParams:{
                        templateId : id
                    },
                    url:'/api/placeConfig/cache/getRel/only/{templateId}'
                }
                getData(url, (result) => {
                    if(result){
                        this.metaKeyList =result
                    }
                })
            },
            generateUrl(key){
                if(!key){return}
                if(this.menuForm.metaKey){
                    this.setFormUrl('menuForm')
                } else{
                    this.setFormUrl('editForm')
                }
            },
            setFormUrl(form){
                let Form = this[form]
                if(Form.urlType){
                    if(Form.urlType === 'resource'){
                        if(!Form.metaKey){
                            iView.Message.warning('请选择一个metaKey！')
                            return
                        }
                        Form.url = `/api/resource/template/url/${this.selectList[Form.selectResultKey].id}/?at=/layoutContent/${Form.parentKey}/page&title=${this.selectList[Form.selectResultKey].name}&subTitle=${this.selectList[Form.selectResultKey].name}一览&metaKey=${Form.metaKey}`
                    }else if(Form.urlType === 'petri'){
                        Form.url = `/api/petri/template/url/${this.selectList[Form.selectResultKey].id}/?at=/layoutContent/${Form.parentKey}/page&title=${this.selectList[Form.selectResultKey].name}&subTitle=${this.selectList[Form.selectResultKey].name}一览`
                    }
                }else{
                    iView.Message.warning('请选择一个URL类型！')
                }
            },
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
                        authority:val.authority,
                        title:val.title,
                        id:val.id,
                        flag:val.flag,
                        renderSelect:false,
                        render: (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('span',{
                                        style: {
                                            cursor : 'pointer',
                                            minWidth:'100px'
                                        },
                                        class:{
                                            'ivu-tree-title':true,
                                            'ivu-tree-title-selected':data.renderSelect
                                        },
                                        on: {
                                            click: () => {
                                                //点击左侧人员获得权限信息
                                                this.roleTreeClick(root,data)
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
                                            this.showEditRole(data)
                                        }
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'edit'
                                        },
                                        style: {
                                            width: '26px',
                                            marginLeft: '6px',
                                            cursor:'pointer',
                                            fontSize:'15px'
                                        }
                                    })
                                ])
                            ])
                        },
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
                this.defaultList = []
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
                    this.defaultList.push(val.currentKey)
                    menuTree.push({
                        currentKey:val.currentKey,
                        title:val.title,
                        id : val.id,
                        url : val.url,
                        picUrl:val.picUrl,
                        menuOrder:val.menuOrder,
                        render: (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span',{
                                    style: {
                                        display: 'inline-block',
                                        minWidth: '100px'
                                    }
                                }, [
                                    h('span', {
                                        style: {
                                            marginRight: '8px'
                                        }
                                    },'['+ (data.menuOrder||0) +']'),
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
                                        marginRight: '2px'
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
                                            width: '15px',
                                            marginLeft: '6px',
                                            cursor:'pointer'
                                        }
                                    })
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        marginRight: '2px'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteMenuConfirm(data)
                                        }
                                    }
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'minus-round'
                                        },
                                        style: {
                                            width: '15px',
                                            marginLeft: '6px',
                                            cursor:'pointer'
                                        }
                                    })
                                ])
                            ]);
                        },
                        description : val.description,
                        icon : val.icon,
                        parentKey:val.parentKey||'',
                        children:children,
                        expand:false,
                        checked:false
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
                        let list = new Set(result)
                        this.menuTree = this.handleMenu(tree,list)
                    }
                })
            },
            handleMenu(data,list){
                for(let i = 0;i<data.length;i++){
                    if(data[i].children.length !== 0){
                        data[i].children = this.handleMenu(data[i].children,list)
                    }else{
                        if(list.has(data[i].currentKey)){
                            data[i].checked = true
                            list.delete(data[i].currentKey)
                        }
                    }
                }
                return data
            },

            //获取勾选权限列表
            handleTreeCheck(arg){
                let checkList = []
                arg.forEach((v)=>{
                    checkList.push(v.currentKey)
                })
                this.checkList = checkList
            },

            //提交权限信息
            handleSubmitConfirm(){
                if(!this.currentRole){
                    iView.Message.warning('请选择角色！')
                    return
                }

                this.$Modal.confirm({
                    title:'确认操作',
                    content:'您确定要保存该角色对应的菜单么？',
                    onOk:()=>{
                        let url ={
                            method:'POST',
                            pathParams:{
                                role : _.cloneDeep(this.currentRole)
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
                    }
                })
            },

            //打开添加角色
            addRole(){
                this.roleTitle = '添加角色'
                this.showRoleLayer = true
                this.layerRoleLoading = true
                this.roleForm = _.cloneDeep(this.roleDefault)
            },
            handleRoleCancel(){
                this.showRoleLayer = false
                this.clearForm('roleForm')
            },
            handleRoleOk(){
                this.layerRoleLoading = false
                this.HandleValid('roleForm',()=>{
                    this.handleAddRole()
                })
                setTimeout(()=>{this.layerRoleLoading = true},500)
            },
            handleAddRole(){
                let url='/api/role/add'
                if(this.roleForm.id){
                    url='/api/role/update'
                }
                this.handlePost(this.roleForm,url,()=>{
                    this.showRoleLayer = false
                    this.getRoleData()
                })
            },

            //编辑角色信息
            showEditRole(data){
                this.roleTitle = '编辑角色信息'
                this.showRoleLayer = true
                this.layerRoleLoading = true
                this.roleForm = _.cloneDeep(data)
                delete this.roleForm.renderSelect
            },

            //添加菜单
            showAddMenu(data){
                if(data.currentKey){this.menuForm.parentKey = data.currentKey}
                this.showLayer = true
                this.layerLoading = true
            },
            handleCancel(){
                this.showLayer = false
                this.clearForm('menuForm')
                this.clearForm('powerForm')
            },
            handleOk(){
                this.layerLoading = false
                this.HandleValid('menuForm',()=>{
                    this.HandleValid('powerForm',()=>{
                        this.HandleAddMenu()
                    })
                })
                setTimeout(()=>{this.layerLoading = true},500)
            },
            HandleAddMenu(){
                let body = _.cloneDeep(this.menuForm)
                body.currentKey = (body.parentKey||'') + body.currentKey
                body.authorityEntity = _.cloneDeep(this.powerForm)
                delete body.metaKey
                delete body.selectResultKey
                delete body.urlType

                this.handlePost(body,'/api/menu/add',()=>{
                    this.showLayer = false
                    this.updateMenu()
                })
            },

            //编辑菜单信息
            showEditMenu(data){
                Object.keys(this.editForm).forEach(v=>{
                    this.editForm[v] = _.get(data,v,'')
                })
                if(data.id){this.getPowerData(data.id)}

                this.editForm.currentKey = this.editForm.currentKey.replace(this.editForm.parentKey,'')
                this.cKey = this.editForm.currentKey

                this.showEditLayer = true
                this.layerEditLoading = true
            },
            handleEditOk(){
                this.layerEditLoading = false
                this.HandleValid('editForm',()=>{
                    this.HandleValid('powerForm',()=>{
                        this.showEditLayer = false
                        this.HandleEditMenu()
                    })
                })
                setTimeout(()=>{this.layerEditLoading = true},500)
            },
            handleEditCancel(){
                this.showEditLayer = false
                this.clearForm('editForm')
                this.clearForm('powerForm')
            },
            HandleEditMenu(){
                let body = _.cloneDeep(this.editForm)
                body.currentKey = (body.parentKey||'') + body.currentKey
                body.authorityEntity = _.cloneDeep(this.powerForm)
                delete body.metaKey
                delete body.selectResultKey
                delete body.urlType

                this.handlePost(body,'/api/menu/update',()=>{
                    this.updateMenu()
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
                            this.powerForm[v] = _.get(result,v,'')
                        })
                    }
                })
            },

            //重新获取菜单列表
            updateMenu(){
                this.getDefaultMenu()
                if(this.currentRole){
                    this.getMenuData()
                }
            },

            //删除菜单
            deleteMenuConfirm(data){
                this.$Modal.confirm({
                    title:'确认操作',
                    content:'您确定要删除该条菜单么？',
                    onOk:()=>{
                        let url ={
                            method:'DELETE',
                            pathParams:{
                                id : data.id
                            },
                            url:'/api/menu/{id}'
                        }
                        getData(url, (result) => {
                            if(result){
                                if(result.code === 200 ){
                                    iView.Message.success(result.description)
                                    result.data && this.updateMenu()
                                }else{
                                    iView.Message.info(result.description)
                                }
                            }
                        })
                    }
                })
            },

            //角色树点击事件
            roleTreeClick(root,data){
                root.forEach(v=>{
                    v.node.renderSelect = false
                })
                data.renderSelect = true
                this.currentRole = data.authority
                this.getMenuData()
            },

            //重置，全选，折叠 操作
            selectAll(){
                this.menuTree.forEach(v=>{
                    v.checked = true
                    bus.$emit('layoutTop')
                })
                this.checkList = _.cloneDeep(this.defaultList)
            },
            resetSelect(){
                this.menuTree = _.cloneDeep(this.defaultMenu)
                this.checkList = []
                bus.$emit('layoutTop')
            },
            foldMenu(){
                this.menuTree.forEach(v=>{
                    v.expand = false
                    bus.$emit('layoutTop')
                })
            },

            /*工具类*/
            //验证信息
            HandleValid(name,callback){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        callback()
                        this.clearForm(name)
                    } else {
                        this.$Message.error('验证失败!')
                    }
                })
            },
            //纯提交操作
            handlePost(body,link,callback){
                let data = _.cloneDeep(body)
                let url ={
                    method:'POST',
                    body:data,
                    url:link
                }
                getData(url, (result) => {
                    if(result){
                        if(result.code === 200 ){
                            iView.Message.success(result.description)
                            callback()
                        }else{
                            iView.Message.info(result.description)
                        }
                    }
                })
            },
            //表格验证清空+对象清空
            clearForm(name){
                this.$refs[name].resetFields()
                Object.keys(this[name]).forEach(v=>{
                    if(v==='menuOrder'){this[name][v] = 0}
                    else{this[name][v] = ''}
                })
            },

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

    .head-container{
        padding-bottom: 6px;
        margin-bottom: 3px;
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
        position: fixed;
        right: 40px;
        bottom: 50px;
    }
    .btn .ivu-btn{
        margin-left: 10px;
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
<style>
    .ivu-tree ul {
        font-size: 16px;
    }
</style>
