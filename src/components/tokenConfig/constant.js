export const addItem = 'config-table-item-add'
export const delItem = 'config-table-item-delete'
// 与后台交互接口地址
export const fetchDir = {
    // 列表页
    overviewData: "/api/placeConfig/getAllPlaceConfig",
    // 查看 + 编辑
    treeData: "/api/placeConfig/cache/getTreeData/{templateId}",
    relData: "/api/placeConfig/cache/getRel/{templateId}",
    // 查看页面
    viewTableData: "/api/placeConfig/cache/getTableData/{templateId}/{nodeId}",
    // 编辑页面
    metaList: "/api/placeConfig/getFormMetaList/{type}",
    formData: "/api/placeConfig/cache/getFormData/{templateId}",
    tableData: "/api/placeConfig/cache/getTableData/{metaId}",
    saveData: "/api/placeConfig/cache/saveNode",
    delData: "/api/placeConfig/cache/delNode/{templateId}/{nodeId}",
    // 规则抽取
    ruleTableData: "/api/placeConfig/cache/getRule/{templateId}",
    ruleMetaList: "/api/placeConfig/cache/getMetaList/{templateId}",   
    ruleKeyList: "/api/placeConfig/cache/getKeyList/{templateId}/{tokenMetaId}",
    saveRule: "/api/placeConfig/cache/saveRule"
}
export const relTableColumns = [
    {
        title: 'TokenMeta',
        key: 'nodeName'
    },
    {
        title: '表单MetaId',
        key: 'formName'
    }
]
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

