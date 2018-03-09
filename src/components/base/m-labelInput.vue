<template>
    <div class="ivu-form-item m-flex" style="margin-bottom: 0px;">
        <label :class="{'ivu-form-star': addStar}" class="ivu-form-item-label" :style="{width: labelWidth + 'px'}" >{{label}}</label>
        <div class="ivu-form-item-content m-input">
            <component 
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
    name: 'm-labelInput',
    props: ['define', 'content', 'statusKey'],
    data() {
        return {
        }
    },
    computed: {
        form() {
            if(this.content instanceof Array) {
                return _.get(this.content[0], 'ui_form', 'form')
            } else {
                return _.get(this.content, 'ui_form', 'form')
            }
        },
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
        },
        addStar() {
            let required = _.get(this.childContent, 'required', false)
            return required
        }
    }
}
</script>

<style scoped>

.ivu-form-item-label {
    text-align: right;
}

.ivu-form-star::before {
    content: "*";
    display: inline-block;
    margin-right: 2px;
    line-height: 1;
    font-family: SimSun;
    font-size: 1em;
    color: #ed3f14;
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
