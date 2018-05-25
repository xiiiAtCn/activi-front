<template>
    <div class="container">
        <h3 class="title-container">角色权限</h3>
        <Row>
            <Col span="12" class="tree-container">
                <div class="head-container" @click="addRole">角色列表
                    <Icon type="plus-round" style="cursor: pointer;margin-left: 10px"></Icon>
                </div>
                <Tree class="tree" :data="roleTree" :show-checkbox="false" :multiple="false"></Tree>
            </Col>
            <Col span="12" class="tree-container">
                <div class="head-container" @click="showAddMenu($event, true)">菜单列表
                    <Icon type="plus-round" style="cursor: pointer;margin-left: 10px"></Icon>
                </div>
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
                            <FormItem label="描述">
                                <Input v-model="menuForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                            <FormItem label="选择URL类型" v-if="menuForm.leaf">
                                <RadioGroup v-model="menuForm.urlType">
                                    <Radio :label="item.label" v-for="(item,key) in urlTypeList" :key="key">
                                        {{item.value}}
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="选择后生成URL" v-show="menuForm.urlType !== 'other'" v-if="menuForm.leaf">
                                <Row>
                                    <Col span="11">
                                        <Select v-model="menuForm.selectResultKey" placeholder="请选择类型" filterable
                                                @on-change="selectChange">
                                            <Option v-for="(item,key) in selectList" :key="key" :value="key">
                                                {{item.name}}
                                            </Option>
                                        </Select>
                                    </Col>
                                    <Col span="2" style="text-align: center" v-show="menuForm.urlType === 'resource'">
                                        -选择metaKey:
                                    </Col>
                                    <Col span="11" v-show="menuForm.urlType === 'resource'">
                                        <Select v-model="menuForm.metaKey" placeholder="请选择类型" @on-change="generateUrl">
                                            <Option v-for="(item,key) in metaKeyList" :key="key" :value="item.formName">
                                                {{item.nodeName}}
                                            </Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="URL" v-if="menuForm.leaf">
                                <Input v-model="menuForm.url" placeholder="请输入URL"></Input>
                            </FormItem>
                            <FormItem label="背景图" v-if="!menuForm.leaf">
                                <Input v-model="menuForm.picUrl" placeholder="请输入背景图URL"></Input>
                            </FormItem>
                            <FormItem label="菜单顺序">
                                <InputNumber :min="0" v-model="menuForm.menuOrder" style="width:100%;"></InputNumber>
                            </FormItem>
                            <FormItem label="图标">
                                <Select v-model="menuForm.icon" placeholder="请选择图标" filterable>
                                    <!--<mIconList></mIconList>-->
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span="24" class="layerSection" v-if="menuForm.leaf">
                        <h4>权限信息</h4>
                        <Form ref="powerForm" :label-width="120" :model="powerForm" :rules="powerRules">
                            <FormItem label="权限名称" prop="title">
                                <Input v-model="powerForm.title" placeholder="请输入权限名称"></Input>
                            </FormItem>
                            <FormItem label="权限表达式" prop="express">
                                <Input v-model="powerForm.express" placeholder="请输入权限表达式"></Input>
                            </FormItem>
                            <FormItem label="描述" prop="description">
                                <Input v-model="powerForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        </mLayer>

        <mLayer :value="showEditLayer" titleText="编辑菜单" @on-cancel="handleEditCancel" @on-ok="handleEditOk"
                :loading="layerEditLoading">
            <div>
                <Row>
                    <Col span="24" class="layerSection">
                        <h4>菜单信息</h4>
                        <Form ref="editForm" :label-width="120" :model="editForm" :rules="editRules">
                            <FormItem label="菜单名称" prop="title">
                                <Input v-model="editForm.title" placeholder="请输入菜单名称"></Input>
                            </FormItem>
                            <FormItem label="描述" prop="description">
                                <Input v-model="editForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                            <FormItem label="选择URL类型" v-if="editForm.leaf">
                                <RadioGroup v-model="editForm.urlType">
                                    <Radio :label="item.label" v-for="(item,key) in urlTypeList" :key="key">
                                        {{item.value}}
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="选择后生成URL" v-show="editForm.urlType !== 'other'" v-if="editForm.leaf">
                                <Row>
                                    <Col span="11">
                                        <Select v-model="editForm.selectResultKey" placeholder="请选择类型" filterable
                                                @on-change="selectChange">
                                            <Option v-for="(item,key) in selectList" :key="key" :value="key">
                                                {{item.name}}
                                            </Option>
                                        </Select>
                                    </Col>
                                    <Col span="2" style="text-align: center" v-show="editForm.urlType === 'resource'">
                                        -选择metaKey:
                                    </Col>
                                    <Col span="11" v-show="editForm.urlType === 'resource'">
                                        <Select v-model="editForm.metaKey" placeholder="请选择类型" @on-change="generateUrl">
                                            <Option v-for="(item,key) in metaKeyList" :key="key" :value="item.formName">
                                                {{item.nodeName}}
                                            </Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="URL" v-if="editForm.leaf">
                                <Input v-model="editForm.url" placeholder="请输入URL"></Input>
                            </FormItem>
                            <FormItem label="背景图" v-if="!editForm.leaf">
                                <Input v-model="editForm.picUrl" placeholder="请输入背景图URL"></Input>
                            </FormItem>
                            <FormItem label="菜单顺序">
                                <InputNumber :min="0" v-model="editForm.menuOrder" style="width:100%;"></InputNumber>
                            </FormItem>
                            <FormItem label="图标">
                                <Select v-model="editForm.icon" placeholder="请选择图标" filterable>
                                    <!--<mIconList></mIconList>-->
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span="24" class="layerSection" v-if="editForm.leaf">
                        <h4>权限信息</h4>
                        <Form ref="powerForm" :label-width="120" :model="powerForm" :rules="powerRules">
                            <FormItem label="权限名称" prop="title">
                                <Input v-model="powerForm.title" placeholder="请输入权限名称"></Input>
                            </FormItem>
                            <FormItem label="权限表达式" prop="express">
                                <Input v-model="powerForm.express" placeholder="请输入权限表达式"></Input>
                            </FormItem>
                            <FormItem label="描述" prop="description">
                                <Input v-model="powerForm.description" placeholder="请输入描述信息"></Input>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        </mLayer>

        <mLayer :value="showRoleLayer" :titleText="roleTitle" @on-cancel="handleRoleCancel" @on-ok="handleRoleOk"
                :loading="layerRoleLoading">
            <div>
                <Row>
                    <Col span="24">
                        <Form ref="roleForm" :label-width="120" :model="roleForm" :rules="roleRules">
                            <FormItem label="角色名称" prop="title">
                                <Input v-model="roleForm.title" placeholder="请输入角色名称"></Input>
                            </FormItem>
                            <FormItem label="角色英文名称" prop="express">
                                <Input v-model="roleForm.express" placeholder="请输入角色英文名称"></Input>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        </mLayer>
    </div>
</template>

<script>
    import {getData} from 'utils/actionUtils'
    import _ from 'lodash'
    import iView from 'iview'
    import bus from '../../router/bus'

    export default {
        data() {
            return {
                roleTree: [],
                defaultMenu: [],
                menuTree: [],
                currentRole: '',

                menuTreeMap: {},
                currentMenuData: {},

                checkList: [],
                defaultList: [],

                showLayer: false,
                showRoleLayer: false,
                layerLoading: false,
                layerRoleLoading: false,
                showEditLayer: false,
                layerEditLoading: false,

                id: '',
                roleTitle: '添加角色',

                urlTypeList: [
                    {
                        value: '资源',
                        label: 'resource'
                    },
                    {
                        value: '活动库所',
                        label: 'petri'
                    },
                    {
                        value: '其他',
                        label: 'other'
                    }
                ],
                selectList: [],
                metaKeyList: [],

                menuForm: {
                    title: '',
                    id: '',
                    description: '',
                    url: '',
                    urlType: 'resource',
                    selectResultKey: '',
                    metaKey: '',
                    icon: '',
                    menuOrder: 0,
                    picUrl: '',
                    parentId: '',
                    leaf: false
                },
                powerForm: {
                    title: '',
                    description: '',
                    express: '',
                    id: ''
                },
                editForm: {
                    title: '',
                    id: '',
                    description: '',
                    url: '',
                    urlType: 'resource',
                    selectResultKey: '',
                    metaKey: '',
                    picUrl: '',
                    menuOrder: 0,
                    icon: '',
                    parentId: '',
                    leaf: false
                },
                roleForm: {
                    title: '',
                    express: ''
                },
                roleDefault: {
                    title: '',
                    express: ''
                },
                cKey: '',
                rules: {
                    title: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ]
                },
                powerRules: {
                    title: [
                        {required: true, message: '请输入权限名', trigger: 'blur'}
                    ],
                    express: [
                        {required: true, message: '请输入权限表达式', trigger: 'blur'}
                    ]
                },
                editRules: {
                    title: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ]
                },
                roleRules: {
                    title: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    express: [
                        {required: true, message: '请输入角色英文名称', trigger: 'blur'}
                    ]
                },
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            selectChange(key) {
                if (key === '') {
                    return
                }
                if (this.menuForm.selectResultKey) {
                    if (this.menuForm.urlType === 'petri') {
                        this.setFormUrl('menuForm')
                        return
                    }
                } else {
                    if (this.editForm.urlType === 'petri') {
                        this.setFormUrl('editForm')
                        return
                    }
                }
                this.getmetaKey(this.selectList[key].id)
            },
            getmetaKey(id) {
                const url = {
                    method: 'GET',
                    pathParams: {
                        templateId: id
                    },
                    url: '/placeConfig/cache/getRel/only/{templateId}'
                }
                getData(url, (result) => {
                    if (result) {
                        this.metaKeyList = result
                    }
                })
            },
            generateUrl(key) {
                if (!key) {
                    return
                }
                if (this.menuForm.metaKey) {
                    this.setFormUrl('menuForm')
                } else {
                    this.setFormUrl('editForm')
                }
            },
            setFormUrl(form) {
                let Form = this[form]
                if (Form.urlType) {
                    if (Form.urlType === 'resource') {
                        if (!Form.metaKey) {
                            iView.Message.warning('请选择一个metaKey！')
                            return
                        }
                        Form.url = `/resource/template/url/${this.selectList[Form.selectResultKey].id}/?at=/layoutContent/${Form.parentId}/page&title=${this.selectList[Form.selectResultKey].name}&subTitle=${this.selectList[Form.selectResultKey].name}一览&metaKey=${Form.metaKey}`
                    } else if (Form.urlType === 'petri') {
                        Form.url = `/petri/template/url/${this.selectList[Form.selectResultKey].id}/?at=/layoutContent/${Form.parentId}/page&title=${this.selectList[Form.selectResultKey].name}&subTitle=${this.selectList[Form.selectResultKey].name}一览`
                    }
                } else {
                    iView.Message.warning('请选择一个URL类型！')
                }
            },
            init() {
                this.getRoleData()
                this.getDefaultMenu()
            },
            //获得角色列表并处理
            getRoleData() {
                getData('/role/roles', (result) => {
                    if (result) {
                        this.handleRoleData(result)
                    }
                })
            },
            handleRoleData(data) {
                let roleTree = []
                data.forEach((val) => {
                    roleTree.push({
                        express: val.express,
                        title: val.title,
                        id: val.id,
                        flag: val.flag,
                        renderSelect: false,
                        render: (h, {root, node, data}) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('span', {
                                        style: {
                                            cursor: 'pointer',
                                            minWidth: '100px'
                                        },
                                        class: {
                                            'ivu-tree-title': true,
                                            'ivu-tree-title-selected': data.renderSelect
                                        },
                                        on: {
                                            click: () => {
                                                //点击左侧人员获得权限信息
                                                this.roleTreeClick(root, data)
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
                                            cursor: 'pointer',
                                            fontSize: '15px'
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
            getDefaultMenu() {
                getData('/menu/menus', (result) => {
                    if (result) {
                        this.handleMenuData(result)
                    }
                })
            },
            handleMenuData(data) {
                let menuTree = []
                this.defaultList = []
                menuTree = this.handleTreeData(data)
                this.defaultMenu = _.cloneDeep(menuTree)
                this.menuTree = menuTree
            },
            handleTreeData(data) {
                let menuTree = []
                data.forEach((val) => {
                    let children = []
                    if (val.children) {
                        children = this.handleTreeData(val.children)
                    }
                    this.defaultList.push(val.id)
                    let obj = val
                    obj.render = (h, {root, node, data}) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    minWidth: '100px'
                                }
                            }, [
                                h('span', {
                                    style: {
                                        marginRight: '8px'
                                    }
                                }, '[' + (data.menuOrder || 0) + ']'),
                                h('span', {
                                    style: {
                                        cursor: 'pointer'
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
                                        cursor: 'pointer'
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
                                        cursor: 'pointer'
                                    }
                                })
                            ])
                        ]);
                    }
                    obj.expand = false
                    obj.checked = false
                    obj.children = children
                    menuTree.push(obj)
                    this.menuTreeMap[val.id] = obj
                })
                return menuTree
            },

            //根据选中的角色展示显示的菜单
            getMenuData() {
                if (!this.currentRole) {
                    this.menuTree = this.defaultMenu
                    return
                }
                let url = {
                    method: 'GET',
                    pathParams: {
                        role: this.currentRole
                    },
                    url: '/role/{role}/menus'
                }
                getData(url, (result) => {
                    if (result) {
                        let tree = _.cloneDeep(this.defaultMenu)
                        let list = new Set(result)
                        this.menuTree = this.handleMenu(tree, list)
                    }
                })

            },
            handleMenu(data, list) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].children.length !== 0) {
                        data[i].children = this.handleMenu(data[i].children, list)
                    } else {
                        if (list.has(data[i].auth.express)) {
                            data[i].checked = true
                            list.delete(data[i].id)
                        }
                    }
                }
                return data
            },

            //获取勾选权限列表
            handleTreeCheck(arg) {
                let checkList = []
                arg.forEach((v) => {
                    if(v.auth) {
                        checkList.push(v.auth.id)
                    }
                })
                this.checkList = checkList
            },


            //递归去render
            deleteRander(list) {
                list.forEach(v => {
                    delete v.render
                    if (v.children && v.children.length) {
                        this.deleteRander(list)
                    }
                })
            },
            //提交权限信息
            handleSubmitConfirm() {
                // let body = [],list = _.cloneDeep(this.menuTree)
                // list.forEach(v=>{
                //     delete v.render
                //     if(v.children){
                //
                //     }
                // })
                // let url ={
                //     method:'POST',
                //     body:this.menuTree,
                //     url:'/menu'
                // }
                // getData(url, (result) => {
                //     if(result){
                //         console.log(result)
                //     }
                // })


                if (!this.currentRole) {
                    iView.Message.warning('请选择角色！')
                    return
                }

                this.$Modal.confirm({
                    title: '确认操作',
                    content: '您确定要保存该角色对应的菜单么？',
                    onOk: () => {
                        let url = {
                            method: 'POST',
                            pathParams: {
                                role: _.cloneDeep(this.currentRole)
                            },
                            body: this.checkList,
                            url: '/role/{role}/menus'
                        }
                        getData(url, (result) => {
                            if (result) {
                                if (result.code === 200) {
                                    iView.Message.success(result.description)
                                } else {
                                    iView.Message.info(result.description)
                                }
                            }
                        })
                    }
                })
            },

            //打开添加角色
            addRole() {
                this.roleTitle = '添加角色'
                this.showRoleLayer = true
                this.layerRoleLoading = true
                this.roleForm = _.cloneDeep(this.roleDefault)
            },
            handleRoleCancel() {
                this.showRoleLayer = false
                this.clearForm('roleForm')
            },
            handleRoleOk() {
                this.layerRoleLoading = false
                this.HandleValid('roleForm', () => {
                    this.handleAddRole()
                })
                setTimeout(() => {
                    this.layerRoleLoading = true
                }, 500)
            },
            handleAddRole() {
                let url = '/role/add'
                if (this.roleForm.id) {
                    url = '/role/update'
                }
                this.handlePost(this.roleForm, url, () => {
                    this.showRoleLayer = false
                    this.getRoleData()
                })
            },

            //编辑角色信息
            showEditRole(data) {
                this.roleTitle = '编辑角色信息'
                this.showRoleLayer = true
                this.layerRoleLoading = true
                this.roleForm = _.cloneDeep(data)
                delete this.roleForm.renderSelect
            },

            //添加菜单
            showAddMenu(data, isRoot) {
                if (data.id) {
                    this.menuForm.parentId = data.id
                    this.menuForm.parentData = data
                }
                if(!isRoot) {
                    this.menuForm.leaf = true
                }
                this.showLayer = true
                this.layerLoading = true
            },
            handleCancel() {
                this.showLayer = false
                this.clearForm('menuForm')
                this.clearForm('powerForm')
            },
            handleOk() {
                this.layerLoading = false
                this.HandleValid('menuForm', () => {
                    this.HandleValid('powerForm', () => {
                        this.HandleAddMenu()
                        this.clearForm('editForm')
                        this.clearForm('powerForm')
                    })
                })
                setTimeout(() => {
                    this.layerLoading = true
                }, 500)
            },
            HandleAddMenu() {
                let body = _.cloneDeep(this.menuForm), obj = {}
                delete body.metaKey
                delete body.selectResultKey
                delete body.urlType
                body.auth = _.cloneDeep(this.powerForm)
                body.children = []
                if (body.parentId) {
                    obj = _.cloneDeep(body.parentData)
                    delete body.parentData
                    delete body.parentId
                    obj.children.push(body)
                    delete obj.render
                } else {
                    obj = body
                }

                this.showLayer = false

                this.handlePost(obj, '/menu', () => {
                    this.showLayer = false
                    this.updateMenu()
                })

                /*let body = _.cloneDeep(this.menuForm)
                body.id = (body.parentId||'') + body.id
                body.authorityEntity = _.cloneDeep(this.powerForm)
                delete body.metaKey
                delete body.selectResultKey
                delete body.urlType
                */
            },

            //编辑菜单信息
            showEditMenu(data) {
                Object.keys(this.editForm).forEach(v => {
                    this.editForm[v] = _.get(data, v, '')
                })
                if (data.auth) {
                    this.powerForm = data.auth
                }

                this.cKey = this.editForm.id

                this.showEditLayer = true
                this.layerEditLoading = true
            },
            handleEditOk() {
                this.layerEditLoading = false
                this.HandleValid('editForm', () => {
                    this.HandleValid('powerForm', () => {
                        this.HandleEditMenu()
                        this.showEditLayer = false
                        this.clearForm('editForm')
                        this.clearForm('powerForm')
                    })
                })
                setTimeout(() => {
                    this.layerEditLoading = true
                }, 500)
            },
            handleEditCancel() {
                this.showEditLayer = false

                if (this.editForm.leaf) {
                    this.clearForm('powerForm')
                }
                this.clearForm('editForm')
            },
            HandleEditMenu() {
                let body = _.cloneDeep(this.editForm)
                body.auth = _.cloneDeep(this.powerForm)
                this.handlePost(body, '/menu', () => {
                    this.updateMenu()
                })

                // body.id = (body.parentId||'') + body.id
                // body.authorityEntity = _.cloneDeep(this.powerForm)
                // delete body.metaKey
                // delete body.selectResultKey
                // delete body.urlType
                //
                // this.handlePost(body,'/menu/update',()=>{
                //     this.updateMenu()
                // })
            },
            //编辑时请求权限数据
            getPowerData(id) {
                let url = {
                    method: 'GET',
                    pathParams: {
                        id: id
                    },
                    url: '/authority/one/{id}'
                }
                getData(url, (result) => {
                    if (result && Object.keys(result)) {
                        Object.keys(this.powerForm).forEach(v => {
                            this.powerForm[v] = _.get(result, v, '')
                        })
                    }
                })
            },

            //重新获取菜单列表
            updateMenu() {
                this.getDefaultMenu()
                if (this.currentRole) {
                    this.getMenuData()
                }
            },

            //删除菜单
            deleteMenuConfirm(data) {
                this.$Modal.confirm({
                    title: '确认操作',
                    content: '您确定要删除该条菜单么？',
                    onOk: () => {
                        let url = {
                            method: 'DELETE',
                            pathParams: {
                                id: data.id
                            },
                            url: '/menu/{id}'
                        }
                        getData(url, (result) => {
                            if (result) {
                                if (result.code === 200) {
                                    iView.Message.success(result.description)
                                    result.data && this.updateMenu()
                                } else {
                                    iView.Message.info(result.description)
                                }
                            }
                        })
                    }
                })
            },

            //角色树点击事件
            roleTreeClick(root, data) {
                root.forEach(v => {
                    v.node.renderSelect = false
                })
                data.renderSelect = true
                this.currentRole = data.id
                this.getMenuData()
            },

            //重置，全选，折叠 操作
            selectAll() {
                this.menuTree.forEach(v => {
                    v.checked = true
                    bus.$emit('layoutTop')
                })
                this.checkList = _.cloneDeep(this.defaultList)
            },
            resetSelect() {
                this.menuTree = _.cloneDeep(this.defaultMenu)
                this.checkList = []
                bus.$emit('layoutTop')
            },
            foldMenu() {
                this.menuTree.forEach(v => {
                    v.expand = false
                    bus.$emit('layoutTop')
                })
            },

            /*工具类*/
            //验证信息
            HandleValid(name, callback) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        callback()
                    } else {
                        this.$Message.error('验证失败!')
                    }
                })
            },
            //纯提交操作
            handlePost(body, link, callback) {
                let data = _.cloneDeep(body)
                let url = {
                    method: 'POST',
                    body: data,
                    url: link
                }
                getData(url, (result) => {
                    if (result) {
                        if (result.code === 200) {
                            iView.Message.success(result.description)
                            callback()
                        } else {
                            iView.Message.info(result.description)
                        }
                    }
                })
            },
            //表格验证清空+对象清空
            clearForm(name) {
                this.$refs[name].resetFields()
                Object.keys(this[name]).forEach(v => {
                    if (v === 'menuOrder') {
                        this[name][v] = 0
                    }
                    else {
                        this[name][v] = ''
                    }
                })
            },

        }
    }
</script>
<style scoped>
    .container {
        margin: 15px 30px auto;
    }

    .title-container {
        padding-bottom: 10px;
        margin-bottom: 15px;
        font-size: 18px;
        border-bottom: 1px solid #ccc;
    }

    .head-container {
        padding-bottom: 6px;
        margin-bottom: 3px;
        font-size: 17px;
    }

    .tree-container {
        padding: 5px 10px;
        font-size: 20px;
    }

    .tree {
        padding: 5px 10px;
    }

    .btn {
        margin: 5px 0;
        padding: 5px 15px;
        text-align: right;
        position: fixed;
        right: 40px;
        bottom: 50px;
    }

    .btn .ivu-btn {
        margin-left: 10px;
    }

    .tree-container .ivu-tree-title {
        color: #00ff00;
        font-size: 18px !important;
    }

    .ivu-tree ul li {
        font-size: 18px !important;
    }

    .tree ul.ivu-tree-children li li {
        font-size: 16px;
    }

    .tree ul.ivu-tree-children li li li {
        font-size: 14px;
    }

    .layerSection {
        padding: 0 7px;
    }

    .layerSection h4 {
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
