import {
    ListUrl,
    ViewUrl,
    EditUrl,
    RuleUrl,
    CacheStatus,
    PageNames,
    TempTemplateId,
    EventType,
    ErrMsg
} from './constant'
import bus from 'routers/bus'

const mixin = {
    data () {
        return {
            // 当前页面名称
            pageName: '',
            // localStorage中存放的未生效的库所id
            activeId: '',
            // 提示框
            modal: false,
            // 提示框title
            modalTitle: '',
            // 提示框显示文本
            modalMessage: '',
            // 提示框取消按钮文本
            cancelMsg: '',
            // 提示框确认按钮文本
            okMsg: '',
            // 提示框确认回调
            modalOK: () => {},
            // 提示框取消回调
            modalCancel: () => {},
            store: window.localStorage,
            // 当前页面请求数量
            requestNum: 0,
            bus: bus
        }
    },
    computed: {
        // 页面缓存状态
        cache () {
            if (!this.activeId) {
                return CacheStatus.noCache
            } else {
                if (this.routerParam.tokenId === this.activeId || this.routerQuery.tokenId === this.activeId) {
                    return CacheStatus.cache
                } else {
                    return CacheStatus.error
                }
            }
        },
        // 路径参数
        routerParam () {
            return this.$router.currentRoute.params
        },
        // 查询参数
        routerQuery () {
            return this.$router.currentRoute.query
        },
        // 当前页面数据的templateId
        templateId () {
            return this.routerParam.tokenId || this.routerQuery.tokenId
        }, 
        id () {
            return this.routerParam.id
        }
    },
    watch: {
        requestNum (val) {
            if (val == 0) {
                this.bus.$emit(EventType.hideLoading)
            } else {
                this.bus.$emit(EventType.showLoading)
            }
        }
    },
    methods: {
        // 页面初始化操作
        init() {},
        // 页面退出按钮逻辑
        exit () {
            switch (this.pageName) {
                case PageNames.viewPage:
                    // 判断当前数据是否未生效，如果未生效提示信息
                    if (!!this.activeId && this.activeId === this.templateId) {
                        this.modalTitle = '是否生效'
                        this.modalMessage = '当前库所信息未生效，是否生效它'
                        this.okMsg = '生效'
                        this.cancelMsg = '清除未生效数据并退出'
                        this.modalOK = () => {
                            this.active()
                        }
                        this.modalCancel = () => {
                            this.store.setItem(TempTemplateId, '')
                            this.activeId = ''
                            this._goToListPage()
                        }
                        this.modal = true
                    } else {
                        this._goToListPage()
                    }
                    break
                case PageNames.editPage:
                    if (!this.templateId) {
                        this._goToListPage()
                    } else {
                        this._goToViewPage()
                    }
                    break
                case PageNames.RulePage:
                    this._goToViewPage()
                    break
                default:
                    const errMsg = `当前页面名称有误, pageName: ${this.pageName}`
                    throw new Error(errMsg)
            }
        },
        // 检查页面状态，如果状态不对提示信息
        validatePageStatus (callback) {
            this.modalTitle = ErrMsg.activeTitle
            this.modalOK = () => {
                this._goToViewPage(this.activeId)
                this.$router.go(0)
            }
            this.modalCancel = () => {
                this.modal = false
            }
            this.modalMessage = ErrMsg.active
            this.okMsg = '生效或清除'
            // 当前页面错误状态提示信息
            if (this.cache === CacheStatus.error) {
                this.modal = true
            } else {
                callback()
            }
        },
        // 列表页
        _goToListPage() {
            this.$router.push({
                path: ListUrl(this.routerParam.id)
            })
        },
        // 查看页
        _goToViewPage(templageId) {
            this.$router.push({
                path: ViewUrl(
                    this.routerParam.id, 
                    templageId ? templageId : this.templateId
                )
            })
        },
        // 编辑
        _goToEditPage(templageId) {
            this.$router.push({
                path: EditUrl(
                    this.routerParam.id, 
                    templageId ? templageId : this.templateId || ''
                )
            })
        },
        // 规则页
        _goToRulePage() {
            this.$router.push({
                path: RuleUrl(this.routerParam.id, this.templateId)
            })
        }
    },
    mounted () {
        this.store = window.localStorage
        this.activeId = this.store.getItem(TempTemplateId)
        this.init()
    }
}

export default mixin