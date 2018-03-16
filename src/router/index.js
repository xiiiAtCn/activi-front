import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const mLayoutContent = resolve => require(['../components/m-layout-content.vue'], resolve)
const mLayoutContentDefault = resolve => require(['../components/m-layout-content-default.vue'], resolve)
const workbench = resolve => require(['../components/businessModule/workbench.vue'], resolve)

// 登录页
const mLogin = resolve => require(['../components/m-login.vue'], resolve)

//urlSection
const mUrlSection = resolve => require(['../components/m-url-section.vue'], resolve)

// 库所配置
const tokenOverview = resolve => require(['../components/tokenConfig/tokenOverview.vue'], resolve)
const tokenConfig = resolve => require(['../components/tokenConfig/tokenConfig.vue'], resolve)
const tokenView = resolve => require(['../components/tokenConfig/tokenView.vue'], resolve)
const extractConfig = resolve => require(['../components/tokenConfig/extractConfig.vue'], resolve)
const transitionConfig = resolve => require(['../components/tokenConfig/transitionConfig.vue'], resolve)
const resourceSelect = resolve => require(['../components/tokenConfig/resourceSelect.vue'], resolve)
const mActiveStock = resolve => require(['../components/stock/m-active-stock.vue'], resolve)

//用户中心
const userCenter = resolve => require(['../components/userCenter/m-user-center.vue'], resolve)
const power = resolve => require(['../components/userCenter/m-permission-settings.vue'], resolve)

//室内地图
const ngrMap = resolve => require(['../components/m-show-map.vue'], resolve)

//帮助中心
const Helper = resolve => require(['../components/debug/m-helper.vue'], resolve)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: '/index.html',
            redirect: '/layoutContent/04/workbench'
        },
        {
            path: '/',
            component: mLogin
        },
        {
            path: '/layoutContent/:id',
            component: mLayoutContent,
            children: [
                {
                    path: '/',
                    component: mLayoutContentDefault
                },
                {
                    path: 'page',
                    component: mUrlSection,
                    props: (route) => ({ query: route.query }),
                    children: [
                        {
                            path: 'tabs',
                            component: mUrlSection,
                            props: route => ({ query: route.query })
                        }
                    ]
                },
                {
                    path: '/layoutContent/:id/workbench',
                    component: workbench
                },
                // 用户中心路由
                { path: '/layoutContent/:id/userCenter/power', component: power },
                { path: '/layoutContent/:id/userCenter/user', component: userCenter },
                // 库所一览
                {
                    path: '/layoutContent/:id/tokenOverview',
                    component: tokenOverview
                },
                // 库所配置
                {
                    path: '/layoutContent/:id/tokenConfig',
                    component: tokenConfig
                },
                // 库所浏览
                {
                    path: '/layoutContent/:id/tokenView/:tokenId',
                    component: tokenView
                },
                // 抽取一览配置
                {
                    path: '/layoutContent/:id/extractConfig/:tokenId',
                    component: extractConfig
                },
                // 变迁配置
                {
                    path: '/layoutContent/:id/transitionConfig',
                    component: transitionConfig
                },
                // 资源选择
                {
                    path: '/layoutContent/:id/resourceSelect/:tokenId',
                    component: resourceSelect
                },
                // 室内地图
                {
                    path: '/layoutContent/:id/ngrMap',
                    component: ngrMap
                },
                {
                    path: '/layoutContent/fq/helper',
                    component: Helper
                },
                //活动库所
                {
                    path: '/layoutContent/:id/mActiveStock',
                    component: mActiveStock
                },
            ]
        },
    ]
})

export default router
