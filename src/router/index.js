/**
 * Created by 高鹏程 on 2017/5/9.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import iView from 'iview'

const mEntry = resolve => require(['../components/m-entry.vue'], resolve)
const mMain = resolve => require(['../components/m-main.vue'], resolve)
const mLayout = resolve => require(['../components/m-layout.vue'], resolve)
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
const notice = resolve => require(['../components/businessModule/notice.vue'], resolve)
const userManage = resolve => require(['../components/businessModule/userManage.vue'], resolve)
const job = resolve => require(['../components/businessModule/job.vue'], resolve)
const workbench = resolve => require(['../components/businessModule/workbench.vue'], resolve)
const projectSummary = resolve => require(['../components/businessModule/project/m-projectSummary.vue'], resolve)
const projectOut = resolve => require(['../components/businessModule/project/m-projectOut.vue'], resolve)
const projectDetails = resolve => require(['../components/businessModule/project/m-projectDetails.vue'], resolve)
const projectPerson = resolve => require(['../components/businessModule/project/m-projectPerson.vue'], resolve)
const taskSteps = resolve => require(['../components/businessModule/project/m-taskSteps.vue'], resolve)
// const isBuilding = resolve => require(['../components/m-isBuilding.vue'], resolve)
const Test = resolve => require(['../components/base/m-number.vue'], resolve)

// 工作中心路由
const mWorkCenter = resolve => require(['../components/businessModule/workCenter/m-workCenter.vue'], resolve)
const workCenter = resolve => require(['../components/businessModule/workCenter/workCenter.vue'], resolve)
const workDesk = resolve => require(['../components/businessModule/workCenter/workDesk.vue'], resolve)

// 任务中心路由
const taskCenter = resolve => require(['../components/businessModule/m-taskCenter.vue'], resolve)

// 文档中心路由
const documentCenter = resolve => require(['../components/businessModule/m-documentCenter.vue'], resolve)

// 工作流程路由
const workflow = resolve => require(['../components/businessModule/m-workflow.vue'], resolve)
const workflowDetail = resolve => require(['../components/businessModule/workflow.vue'], resolve)

// 报价路由
const productPrice = resolve => require(['../components/businessModule/m-productPrice.vue'], resolve)

// bo关系 部门人员
const boTree = resolve => require(['../components/businessModule/boTree/boTree.vue'], resolve)
// const boTreeDetail = resolve => require(['../components/businessModule/boTree/boTreeDetail.vue'], resolve)

// bo关系 物料档案
const fileTree = resolve => require(['../components/businessModule/boTree/fileTree.vue'], resolve)
// const fileTreeDetail = resolve => require(['../components/businessModule/boTree/fileTreeDetail.vue'], resolve)

// bo关系 bo视图
const boTreeView = resolve => require(['../components/businessModule/boTree/boTreeView.vue'], resolve)

Vue.use(VueRouter)
Vue.use(iView)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {path: '/inventory', component: inventory},
    {path: '/notice', component: notice},
    {path: '/userManage', component: userManage},
    // {path: '/workbench', component: workbench},
    {path: '/job', component: job},
    {path: '/mEntry', component: mEntry},
    {path: '/p', component: mEntry},
    {path: '/page', component: mMain},
    {
      path: '/layout',
      component: mLayout,
      children: [
        {
          path: 'page',
          component: mMain
        }
      ]
    },
    {
      path: '/layoutContent/:id',
      component: mLayoutContent,
      children: [
        {
          path: '/layoutContent/:id/',
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
        //bo关系树 部门人员
        {
          path:'/layoutContent/:id/boTree', component: boTree,
          // children: [
          //   {   path:'/layoutContent/:id/boTree/boDetails/:metaId/:boId/:childMetaId/:childBoId', name: 'boDetails', component: boTreeDetail   },
          // ]
        },
        //bo关系树 物料档案
        {
          path:'/layoutContent/:id/fileTree', component: fileTree,
          // children: [
          //   {   path:'/layoutContent/:id/fileTree/fileDetails/:metaId/:boId', name: 'fileDetails', component: fileTreeDetail   },
          // ]
        },
        //bo关系 bo视图
        {
          path:'/layoutContent/:id/boTreeView', component: boTreeView
        },
        // 工作中心
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
          path: '/layoutContent/:id/workflow', component: workflow
        },
        {
          path: '/:id/workflowDetail', component: workflowDetail
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
                {path: '/layoutContent/:id/monitor/levelClassify/tabFaultHistory', component: tabFaultHistory},
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
                {path: '/layoutContent/:id/monitor/levelPump/tabFaultHistory/:pumpGroupId', component: tabFaultHistory},
                {path: '/layoutContent/:id/monitor/levelPump/tabProduceMonitor/:pumpGroupId', component: tabProduceMonitor},
                {path: '/layoutContent/:id/monitor/levelPump/tabStartStopAnls/:pumpGroupId', component: tabStartStopAnls},
                {path: '/layoutContent/:id/monitor/levelPump/tabCurveNow/:pumpGroupId', component: tabCurveNow}
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/test', component: Test
    },
    // 报价路由
    {
      path: '/productPrice',
      component: productPrice
    }

  ]
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
})
export default router
