
// 更新vuex中表单元素值
export const FORM_ELEMENT_VALUE = 'form_element_value'

// 设置table数据集合
export const SET_TABLE_DATA = 'set_table_data'

// 清空弹出页表单中的数据和状态
export const CLEAR_FORM_DATA = 'clear_form_data'

// 表单数据校验结果存放(单个元素的更新)
export const ELEMENT_VALIDATE_RESULT = 'element_validate_result'

// 打开弹出层
export const OPEN_TABLE_LAYER = 'open_table_layer'

// 关闭弹出层
export const CLOSE_TABLE_LAYER = 'close_table_layer'

// 设置提交按钮可显示loading效果
export const BUTTON_START_LOADING = 'button_start_loading'

// 取消提交按钮的loading状态
export const BUTTON_CANCEL_LOADING = 'button_cancel_loading'

// 启动表单全部校验
export const FORM_DATA_VALIDATE = 'form_data_validate'

// 累计校验和
export const INCREMENT_CHECK_COUNT = 'increment_check_count'
//关闭表单校验逻辑
export const CLOSE_DATA_VALIDATE = 'close_data_validate'

// 向state中添加新的属性
export const ADD_NEW_OBJECT = 'add_new_object'

// 在form表单被从页面卸载时移除vuex中的对象
export const DESTROY_FORM_DATA = 'destroy_form_data'

//form表单卸载时移除页面状态数据
export const CLEAR_FORM_STATUS = 'clear_form_status'

// 设置组件数据payload={id: '', data: ***}
export const SET_COMPONENT_DATA = 'SET_COMPONENT_DATA'

export const CLEAR_COMPONENT_DATA = 'CLEAR_COMPONENT_DATA'


export default {
    FORM_ELEMENT_VALUE: FORM_ELEMENT_VALUE,
    SET_TABLE_DATA: SET_TABLE_DATA,
    CLEAR_FORM_DATA: CLEAR_FORM_DATA,
    ELEMENT_VALIDATE_RESULT: ELEMENT_VALIDATE_RESULT,
    OPEN_TABLE_LAYER: OPEN_TABLE_LAYER,
    CLOSE_TABLE_LAYER: CLOSE_TABLE_LAYER,
    BUTTON_START_LOADING: BUTTON_START_LOADING,
    BUTTON_CANCEL_LOADING: BUTTON_CANCEL_LOADING,
    FORM_DATA_VALIDATE: FORM_DATA_VALIDATE,
    ADD_NEW_OBJECT: ADD_NEW_OBJECT,
    SET_COMPONENT_DATA: SET_COMPONENT_DATA,
    CLEAR_COMPONENT_DATA: CLEAR_COMPONENT_DATA,
    DESTROY_FORM_DATA: DESTROY_FORM_DATA,
    CLEAR_FORM_STATUS: CLEAR_FORM_STATUS,
    CLOSE_DATA_VALIDATE: CLOSE_DATA_VALIDATE,
    INCREMENT_CHECK_COUNT: INCREMENT_CHECK_COUNT
}
