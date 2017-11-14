<template>
    <input type="hidden" v-if="hidden" :id="name" :name="name" v-model="value"/>
    <div v-else class="ivu-form-item m-flex" style="margin-bottom: 0px;">
        <label class="ivu-form-item-label" :style="{width: labelWidth + 'px'}" :for="uid">{{label}}</label>
        <div class="ivu-form-item-content m-input">
            <component :is="itemType" :define="inputDefine" :uid="uid" :focusId="uid"></component>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'

export default {
    props: ['define', 'content', 'uid'],

    data() {
        return {

        }
    },
    computed: {
        inputDefine: function () {
            let filtedDefine = {
                label: this.label,
                hidden: this.hidden,
                labelWidth: this.labelWidth,
                name: this.name
            }
            return filtedDefine
        },
        name() {
            return _.get(this.define.uiObject.ui_define, 'name', '')
        },
        label() {
            return _.get(this.define, 'label', false)
        },
        hidden() {
            return _.get(this.define, 'hidden', false)
        },
        itemType() {
            return _.get(this.define.uiObject, 'ui_type', 'mInput')
        },
        labelWidth() {
            return _.get(this.define, 'labelWidth', 0)
        },
        value: {
            get () {
                return _.get(this.$store.state.pageData.data, this.name, '')
            },
            set (value) {
                this.$store.commit('updateItem', {name: this.name, value: value})
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
