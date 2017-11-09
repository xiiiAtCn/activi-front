import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

const mMain = resolve => require(['../components/m-main.vue'], resolve)
const mContent = resolve => require(['../components/m-main-content.vue'], resolve)
const mLayoutContent = resolve => require(['../components/m-layout-content.vue'], resolve)
const mLayoutContentDefault = resolve => require(['../components/m-layout-content-default.vue'], resolve)
const inventory = resolve => require(['../components/businessModule/inventory.vue'], resolve)
const monitor = resolve => require(['../components/businessModule/monitor.vue'], resolve)
const levelClassify = resolve => require(['../components/businessModule/monitor/levelClassify.vue'], resolve)
const levelProvince = resolve => require(['../components/businessModule/monitor/levelProvince.vue'], resolve)
const levelCity = resolve => require(['../components/businessModule/monitor/levelCity.vue'], resolve)
const levelDistrict = resolve => require(['../components/businessModule/monitor/levelDistrict.vue'], resolve)
const levelCommunity = resolve => require(['../components/businessModule/monitor/levelCommunity.vue'], resolve)
const levelPump = resolve => require(['../components/businessModule/monitor/levelPump.vue'], resolve)
const tabMap = resolve => require(['../components/businessModule/monitor/m-tabMapMonitor.vue'], resolve)
const tabGrid = resolve => require(['../components/businessModule/monitor/tabGridMonitor.vue'], resolve)
const tabProduceMonitor = resolve => require(['../components/businessModule/monitor/tabProduceMonitor.vue'], resolve)
const tabFaultHistory = resolve => require(['../components/businessModule/monitor/tabFaultHistory.vue'], resolve)
const tabFaultNow = resolve => require(['../components/businessModule/monitor/tabFaultNow.vue'], resolve)
const tabStartStopAnls = resolve => require(['../components/businessModule/monitor/tabStartStopAnls.vue'], resolve)
const tabCurveNow = resolve => require(['../components/businessModule/monitor/tabCurveNow.vue'], resolve)
const workbench = resolve => require(['../components/businessModule/workbench.vue'], resolve)

// 项目管理
const projectSummary = resolve => require(['../components/businessModule/project/m-projectSummary.vue'], resolve)
const projectOut = resolve => require(['../components/businessModule/project/m-projectOut.vue'], resolve)
const projectDetails = resolve => require(['../components/businessModule/project/m-projectDetails.vue'], resolve)
const projectPerson = resolve => require(['../components/businessModule/project/m-projectPerson.vue'], resolve)
const taskSteps = resolve => require(['../components/businessModule/project/m-taskSteps.vue'], resolve)

// 登录页
const mLogin = resolve => require(['../components/m-login.vue'], resolve)

// 工作中心路由
const mWorkCenter = resolve => require(['../components/businessModule/workCenter/m-workCenter.vue'], resolve)
const workCenter = resolve => require(['../components/businessModule/workCenter/workCenter.vue'], resolve)
const workDesk = resolve => require(['../components/businessModule/workCenter/workDesk.vue'], resolve)

// 任务中心路由
const taskCenter = resolve => require(['../components/businessModule/m-taskCenter.vue'], resolve)

// 文档中心路由
const documentCenter = resolve => require(['../components/businessModule/m-documentCenter.vue'], resolve)

// 工作流程路由
const workflow = resolve => require(['../components/businessModule/workflow/workflow.vue'], resolve)
const workflowDetails = resolve => require(['../components/businessModule/workflow/workflowDetails.vue'], resolve)
const workflowCheck = resolve => require(['../components/businessModule/workflow/workflowCheck.vue'], resolve)

// 报价路由
const productPrice = resolve => require(['../components/businessModule/m-productPrice.vue'], resolve)

// bo 树
const boTree = resolve => require(['../components/taskPlan/m-boTree.vue'], resolve)

// 功能日志
const functionLog = resolve => require(['../components/businessModule/m-fonctionLog.vue'], resolve)

// 功能日志
const taskPlan = resolve => require(['../components/taskPlan/taskPlan.vue'], resolve)

// 邮件路由
const mEmail = resolve => require(['../components/businessModule/email/m-email.vue'], resolve)
const emailHome = resolve => require(['../components/businessModule/email/emailHome.vue'], resolve)
const writeEmail = resolve => require(['../components/businessModule/email/writeEmail.vue'], resolve)
const checkEmail = resolve => require(['../components/businessModule/email/checkEmail.vue'], resolve)
const emailDetail = resolve => require(['../components/businessModule/email/emailDetail.vue'], resolve)
const emailDirectory = resolve => require(['../components/businessModule/email/emailDirectory.vue'], resolve)

// bo过滤
const boFilter = resolve => require(['../components/boFilterNEW_vuex/m-boFilterPage.vue'], resolve)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {path: '/', component: mLogin},
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
                    component: mMain
                },
                {
                    path: '/layoutContent/:id/workbench',
                    component: workbench
                },
                {
                    path: '/layoutContent/:id/allMenu',
                    component: mContent
                },
                {
                    path: '/layoutContent/:id/inventory',
                    component: inventory
                },
                // 任务计划
                {
                    path: '/layoutContent/:id/taskPlan',
                    component: taskPlan
                },
                // bo 树
                {
                    path: '/layoutContent/:id/boTree/:nodeId/:nodeMetaId',
                    component: boTree
                },
                {
                    path: '/layoutContent/:id/mWorkCenter', component: mWorkCenter
                },
                {
                    path: '/layoutContent/:id/mWorkCenter/:cid/workCenter', component: workCenter
                },
                {
                    path: '/layoutContent/:id/mWorkCenter/:sid/workDesk', component: workDesk
                },
                // 任务中心
                {
                    path: '/layoutContent/:id/taskCenter', component: taskCenter
                },
                // 文档中心
                {
                    path: '/layoutContent/:id/documentCenter', component: documentCenter
                },
                // 工作流程
                {
                    path: '/layoutContent/:id/workflow',
                    component: workflow,
                    children: [
                        { path: 'details/:rowId/:rowName', name: 'workflowDetails', component: workflowDetails }
                    ]
                },
                // 工作流程 查看
                {
                    path: '/layoutContent/:id/workflow/check/:rowId', name: 'workflowCheck', component: workflowCheck
                },
                {
                    path: '/layoutContent/:id/projectSummary', component: projectSummary
                },
                {
                    path: '/layoutContent/:id/:title/projectOut',
                    component: projectOut,
                    children: [
                        {path: '/layoutContent/:id/:title/projectOut/projectDetails', component: projectDetails},
                        {path: '/layoutContent/:id/:title/projectOut/projectPerson', component: projectPerson},
                        {path: '/layoutContent/:id/:title/projectOut/taskSteps', component: taskSteps}
                    ]
                },
                {
                    path: '/layoutContent/:id/monitor',
                    component: monitor,
                    children: [
                        {
                            path: '/layoutContent/:id/monitor/levelClassify',
                            component: levelClassify,
                            children: [
                                {path: '/layoutContent/:id/monitor/levelClassify/tabMapMonitor', component: tabMap},
                                {path: '/layoutContent/:id/monitor/levelClassify/tabGridMonitor', component: tabGrid},
                                {
                                    path: '/layoutContent/:id/monitor/levelClassify/tabFaultHistory',
                                    component: tabFaultHistory
                                },
                                {path: '/layoutContent/:id/monitor/levelClassify/tabFaultNow', component: tabFaultNow}
                            ]
                        },
                        {
                            path: '/layoutContent/:id/monitor/levelProvince',
                            component: levelProvince
                        },
                        {
                            path: '/layoutContent/:id/monitor/levelCity',
                            component: levelCity
                        },
                        {
                            path: '/layoutContent/:id/monitor/levelCommunity',
                            component: levelCommunity
                        },
                        {
                            path: '/layoutContent/:id/monitor/levelDistrict',
                            component: levelDistrict
                        },
                        {
                            path: '/layoutContent/:id/monitor/levelPump',
                            component: levelPump,
                            children: [
                                {
                                    path: '/layoutContent/:id/monitor/levelPump/tabFaultHistory/:pumpGroupId',
                                    component: tabFaultHistory
                                },
                                {
                                    path: '/layoutContent/:id/monitor/levelPump/tabProduceMonitor/:pumpGroupId',
                                    component: tabProduceMonitor
                                },
                                {
                                    path: '/layoutContent/:id/monitor/levelPump/tabStartStopAnls/:pumpGroupId',
                                    component: tabStartStopAnls
                                },
                                {
                                    path: '/layoutContent/:id/monitor/levelPump/tabCurveNow/:pumpGroupId',
                                    component: tabCurveNow
                                }
                            ]
                        }
                    ]
                },
                {
                    path: '/layoutContent/:id/boFilter', component: boFilter
                }
            ]
        },
        {
            path: '/functionLog', component: functionLog
        },
        // 邮件路由
        {
            path: '/email',
            component: mEmail,
            children: [
                { path: '/email/home', component: emailHome },
                { path: '/email/writeEmail', component: writeEmail },
                { path: '/email/checkEmail', component: checkEmail },
                { path: '/email/emailDetail', component: emailDetail },
                { path: '/email/emailDirectory', component: emailDirectory }
            ]
        },
        // 报价路由
        {
            path: '/productPrice',
            component: productPrice
        },
        {
            path: '/formSubmit',
            component: resolve =>
                require(['../test/m-formContainer.vue'], resolve)
        }
    ]
})

export default router
