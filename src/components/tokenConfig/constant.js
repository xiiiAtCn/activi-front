export const addItem = 'config-table-item-add'
export const delItem = 'config-table-item-delete'
// 与后台交互接口地址
export const fetchDir = {
    // 列表页
    overviewData: "/placeConfig/getAllPlaceConfig",
    // 查看 + 编辑
    treeData: "/placeConfig/cache/getTreeData/{templateId}/{cache}",
    relData: "/placeConfig/cache/getRel/{templateId}",
    // 查看页面
    viewTableData: "/placeConfig/cache/getTableData/{templateId}/{nodeId}",
    active: "/placeConfig/cache/active/{templateId}",
    delCache: "/placeConfig/cache/delCache/{templateId}",
    getCodeRule: "/placeConfig/cache/getCodeRule/{templateId}/{cache}",
    saveCodeRule: "/placeConfig/cache/saveCodeRule/{templateId}",
    // 编辑页面
    metaList: "/placeConfig/cache/getFormMetaList/{type}",
    formData: "/placeConfig/cache/getFormData/{templateId}",
    tableData: "/placeConfig/cache/getTableData/{metaId}",
    saveData: "/placeConfig/cache/saveNode",
    delData: "/placeConfig/cache/delNode/{templateId}/{nodeId}",
    // 规则抽取
    ruleTableData: "/placeConfig/cache/getRule/{templateId}/{cache}",
    ruleMetaList: "/placeConfig/cache/getMetaList/{templateId}",
    ruleKeyList: "/placeConfig/cache/getKeyList/{templateId}/{tokenMetaId}",
    saveRule: "/placeConfig/cache/saveRule",
    // 资源选择
    resourceList: "/placeConfig/cache/getResourceList/{templateId}",
    saveResource: "/placeConfig/cache/saveResource",
    // 变迁配置
    configList: "/placeConfig/getConfigList",
    getNodesByTemplateId: "/placeConfig/cache/getNodesByTemplateId/{templateId}/{cache}",
    findAllTransition: "/transitionConfig/findAllTransition",
    saveTransition: "/transitionConfig/saveTransition",
    delTransition: "/transitionConfig/delTransition/{id}",
    // 代办任务
    todoList: 'process/myTask',
    claimTask: 'process/task/{taskId}/claim'
}
export const relTableColumns = [
    {
        title: 'tokenMetaId',
        key: 'tokenMetaId'
    },
    {
        title: '节点名称',
        key: 'nodeName'
    },
    {
        title: '表单MetaId',
        key: 'formName'
    }
]
export const PageNames = {
    listPage: 'listPage',
    viewPage: 'viewPage',
    editPage: 'editPage',
    RulePage: 'rulePage',
    transitionPage: 'transitionPage',
    resourcePage: 'resourcePage'
}
// 缓存状态
export const CacheStatus = {
    cache: true,
    noCache: false,
    error: 'error'
}
export const ErrMsg = {
    active: '当前有尚未生效的库所信息，请生效或清除它',
    activeTitle: '请生效'
}
// 事件类型
export const EventType = {
    showLoading: 'token-config-show',
    hideLoading: 'token-config-hide'
}

// 遍历树节点
export function traverseTree(root, callback) {
    if (root) {
        callback(root)
        if (root.children) {
            for (let child of root.children) {
                traverseTree(child, callback)
            }
        }
    }
}

// 存储于localstorage中的未保存的TempTemplateId
export const TempTemplateId = "TempTemplateId"

// 页面url
export function ListUrl(id) {
    return `/layoutContent/${id}/tokenOverview`
}

export function ViewUrl(id, templateId) {
    return `/layoutContent/${id}/tokenView/${templateId}`
}

export function EditUrl(id, templateId) {
    return `/layoutContent/${id}/tokenConfig?tokenId=${templateId ? templateId : ''}`
}

export function RuleUrl(id, templateId) {
    return `/layoutContent/${id}/extractConfig/${templateId}`
}

export function TransitionUrl(id) {
    return `/layoutContent/${id}/transitionConfig`
}

export function ResourceUrl(id, templateId) {
    return `/layoutContent/${id}/resourceSelect/${templateId}`
}

