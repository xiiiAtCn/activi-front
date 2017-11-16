<template>
    <div class="ivu-form-item m-flex" style="margin-bottom: 0px;">
        <label class="ivu-form-item-label" :style="{width: labelWidth + 'px'}" :for="uid">{{label}}</label>
        <div class="ivu-form-item-content m-input">
            <component 
                :formTmp="formTmp" 
                :statusKey="statusKey" 
                :is="itemType" 
                :define="childContent" 
                :uid="uid" 
                :focusId="uid"
            >
            </component>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'

export default {
    props: ['define', 'uid', 'formTmp', 'content', 'statusKey'],
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
