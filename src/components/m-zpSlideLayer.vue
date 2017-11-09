<template>        
    <div class="layer-wraper" :style="{top: visible ? 0 : '100vh'}">
        <div  class="layer-container" :style="{top: currentTop, left: left}">
            <div class="layer-header">
                <div class="layer-header-title">
                    {{ titleText }}
                </div>
                <div class="layer-header-close">
                    <a @click="cancel">
                        <Icon size="30" type="ios-close-empty"></Icon>
                    </a>
                </div>
            </div>
            <div class="layer-body">
                <slot></slot>
            </div>
            <div class="layer-footer" :style="{top: btnTop}">
                <slot name="footer">
                    <Button type="text" size="large" @click="cancel">{{ cancelText }}</Button>
                    <Button type="primary" size="large" :loading="buttonLoading" @click="ok">{{ okText }}</Button>
                </slot>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import _ from 'lodash'

export default {
    props: {
        // 是否显示layer
        value: {
            type: Boolean,
            required: true
        },
        // 按钮loading
        loading: {
            type: Boolean,
            default: false
        },
        titleText: {
            type: String,
            default: '标题'
        },
        okText: {
            type: String,
            default: '确定'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        // 距离默认top值
        top: {
            type: String,
            default: '0'
        },
        // left值
        left: {
            type: String,
            default: '12.5%'
        },
        // 点击取消与确定是否自动关闭
        autoClose: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            // 是否显示
            visible: this.value,
            // btn Loading状态
            buttonLoading: false,
            default: {
                top: '75'
            }
        }
    },
    computed: {
        currentTop () {
            if (this.visible) {
                return parseInt(this.top) + parseInt(this.default.top) + 'px'
            } else {
                return '100vh'
            }
        },
        btnTop () {
            return `calc(100vh - 60px - ${parseInt(this.top) + parseInt(this.default.top)}px)`
        }
    },
    watch: {
        value (val) {
            this.visible = val
        },
        visible (val) {
            if (val === false) {
                this.buttonLoading = false
            }
        },
        loading (val) {
            if (!val) {
                this.buttonLoading = false
            }
        },
    },
    mounted () {
         document.addEventListener('keydown', this.EscClose)
    },
    beforeDestroy () {
        document.removeEventListener('keydown', this.EscClose)
    },
    methods: {
        // 关闭layer
        closeLayer () {
            this.visible = false
            this.$emit('input', false);
        },
        ok () {
            if (this.loading) {
                this.buttonLoading = true
            } else {
                if (this.autoClose) {
                    this.closeLayer()
                }
            }
            this.$emit('on-ok')
        },
        cancel () {
            if (this.autoClose) {
                this.closeLayer()
            }
            this.$emit('on-cancel')
        },
        EscClose (e) {
            if (this.visible) {
                if (e.keyCode === 27) {
                    this.closeLayer()
                }
            }
        }
    },
}
</script>
<style scoped>
.layer-wraper{
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 900;
    background-color: rgba(55,55,55,.6);
    transition: top .5s;
}
.layer-container {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 900;
    border: 1px solid #e9eaec;
    border-radius: 15px;
    background: #fff;
    transition: top .5s;
}
.layer-header {
    position: absolute;
    line-height: 20px;
    font-size: 14px;
    color: #1c2438;
    font-weight: 700;
    border-bottom: 1px solid #e9eaec;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
}
.layer-header-title{
    padding: 14px 20px;
}
.layer-header-close{
    position: absolute;
    right: 16px;
    top: 8px;
}
.layer-body{
    padding: 20px;
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 60px;
    overflow-y: auto;
}
.layer-footer{
    border-top: 1px solid #e9eaec;
    padding: 12px 50px;
    text-align: right;
    position: absolute;
    left: 200px;
    right: 0;
    height: 60px;
}
</style>