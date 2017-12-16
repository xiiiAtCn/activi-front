<template>
    <div class="ivu-form-item m-flex" style="margin-bottom: 0px;">
        <label class="ivu-form-item-label" :style="{width: labelWidth + 'px'}" >{{label}}</label>
        <div class="ivu-form-item-content m-input">
            <component 
                :ui_form="ui_form" 
                :form="form"
                :statusKey="statusKey" 
                :is="itemType" 
                :define="childContent" 
            >
            </component>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'

export default {
    props: ['define', 'ui_form', 'content', 'statusKey', 'form'],
    computed: {
        name() {
            return _.get(this.define, 'name', '')
        },
        label() {
            return _.get(this.define, ['label'])
        },
        hidden() {
            return _.get(this.define, 'hidden', false)
        },
        //无法获取ui_type类型时默认为输入框
        itemType() {
            if(this.content instanceof Array) {
                return _.get(this.content[0], 'ui_type', 'mInput')
            }
        },
        labelWidth() {
            return _.get(this.define, 'labelWidth', 120)
        },
        childContent() {
            if(this.content instanceof Array) {
                return this.content[0]['ui_define']
            } else {
                return this.content
            }
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
