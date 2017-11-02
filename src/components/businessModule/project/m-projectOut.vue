<template>
    <div class="layout">
        <Menu mode="horizontal" active-name="1">
            <div class="layout-assistant">
                {{$route.params.title}}
            </div>
        </Menu>
        <div class="layout-content">
            <Row>
                <Col span="3">
                    <Menu active-name="0" style="width: 100%">
                        <MenuGroup title="项目管理">
                            <MenuItem :name="index" v-for="(item,index) in routers" :key="item.code">
                                <router-link :to="item.url">
                                    {{item.text}}
                                </router-link>
                            </MenuItem>
                        </MenuGroup>
                    </Menu>
                </Col>
                <Col span="21">
                    <div class="layout-content-main">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </div>
                </Col>
            </Row>
        </div>
        <div class="layout-copy">
            2011-2020 &copy; Y
        </div>
    </div>
</template>

<script>
/* eslint-disable */
    import {dispatch} from  '../../../utils/actionUtils'
    export default {
        data () {
            return {
                routers: [],
            }
        },
        methods: {
            changetitle() {
                document.title = this.$route.params.title
            }
        },
        mounted () {
            this.changetitle();
            this.$router.push({
                path:'/layoutContent/' + this.$route.params.id + '/' + this.$route.params.title + '/projectOut/projectDetails'
            });
            let urls = [
                {
                    text: '项目详情',
                    url: '/layoutContent/05/' + this.$route.params.title + '/projectOut/projectDetails',
                    code: '101'
                },
                {
                    text: '项目人员',
                    url: '/layoutContent/05/' + this.$route.params.title + '/projectOut/projectPerson',
                    code: '102'
                },
                {
                    text: '任务进度',
                    url: '/layoutContent/05/' + this.$route.params.title + '/projectOut/taskSteps',
                    code: '103'
                },
                {
                    text: '成果管理',
                    url: '',
                    code: '104'
                },
                {
                    text: '需求管理',
                    url: '',
                    code: '105'
                },
                {
                    text: '计划管理',
                    url: '',
                    code: '106'
                },
                {
                    text: '项目文档',
                    url: '',
                    code: '107'
                },
                {
                    text: '问题管理',
                    url: '',
                    code: '108'
                },
                {
                    text: '风险管理',
                    url: '',
                    code: '109'
                },
                {
                    text: '资源成本',
                    url: '',
                    code: '110'
                },
                {
                    text: '项目建议',
                    url: '',
                    code: '111'
                },
                {
                    text: '变更管理',
                    url: '',
                    code: '112'
                },
                {
                    text: '项目图表',
                    url: '',
                    code: '113'
                },
                {
                    text: '日报管理',
                    url: '',
                    code: '114'
                },
            ];
            this.routers = urls;
        }
    }
</script>

<style>
    /*隐藏父级组件*/
    .out-use-menu-vertical, .out-use-menu-horizontal {
        display: none;
    }
</style>

<style scoped>
    /*路由*/
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 0
    }
    .ivu-menu-item a {
        display: block;
        padding: 14px 24px;
        color: #cccccc;
    }
    .ivu-menu-item-selected a {
        color: #2d8cf0;
    }
    .layout{
        background: #f5f7f9;
        width: 120%;
    }
    .layout-assistant{
        width: 300px;
        margin: 0 auto;
        height: inherit;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 120px;
        color: #9ea7b4;
    }
</style>
