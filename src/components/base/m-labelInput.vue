<template>
    <div class="ivu-form-item m-flex" style="margin-bottom: 0px;">
        <label class="ivu-form-item-label" :style="{width: labelWidth + 'px'}" :for="uid">{{label}}</label>
        <div class="ivu-form-item-content m-input">
            <component :formTmp="formTmp" :is="itemType" :define="ui_define" :uid="uid" :focusId="uid"></component>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'

export default {
    props: ['define', 'content', 'uid', 'formTmp'],
    computed: {
        name() {
            return _.get(this.define.uiObject.ui_define, 'name', '')
        },
        label() {
            return _.get(this.define, ['label']) || _.get(this.define, ['ui_define', 'label'], '未知')
        },
        hidden() {
            return _.get(this.define, 'hidden', false)
        },
        ui_define() {
            
            let define = _.get(this.define, ['uiObject', 'ui_define'])
            define['ui_id'] = _.get(this.define, ['uiObject', 'ui_id'])
            return define
        },
        itemType() {
            return _.get(this.define.uiObject, 'ui_type', 'mInput')
        },
        labelWidth() {
            return _.get(this.define, 'labelWidth', 120)
        }
    }
}
</script>

<style scoped>

.ivu-form-item-label {
    text-align: right;
}

.expend-all {
    width: 100%;
}

.m-flex {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
}

.m-input {
    margin-left: 0;
    width: 100%;
}
</style>
