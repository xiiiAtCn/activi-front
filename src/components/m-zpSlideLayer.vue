<template>
    <div class="layer-wraper" :style="{top: visible ? 0 : '100vh'}">
        <div class="layer-container" :style="{top: currentTop, left: layerLeft}">
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
import _ from 'lodash'
import Mutations from 'store/Mutation'
import Action from 'store/Action'

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
        // 点击取消与确定是否自动关闭
        autoClose: {
            type: Boolean,
            default: true
        },
        leftInterval: {
            type: String,
            default: '50px'
        },
        topInterval: {
            type: String,
            default: '50px'
        }
    },
    data () {
        return {
            // 是否显示
            visible: this.value,
            // btn Loading状态
            buttonLoading: false,
            id: null
        }
    },
    computed: {
        // layer最外层top值
        currentTop () {
            if (this.visible) {
                return `calc(${this.layerTop})`
            } else {
                return '100vh'
            }
        },
        // layer中按钮区域top值
        btnTop () {
            return `calc(100vh - 60px - (${this.layerTop}))`
        },
        layerTop () {
            return this.$store.getters.layerTop(this.id)
        },
        layerLeft () {
            return `calc(${this.$store.getters.layerLeft(this.id)})`
        }
    },
    watch: {
        value (val) {
            this.visible = val
        },
        visible (val) {
            if (val === false) {
                this.buttonLoading = false
                this.$store.commit(Mutations.DEL_LAYER, this.id)
                this.id = null
            } else {
                this.id = this.$store.state.layerData.idNum
                this.$store.dispatch(Action.ADD_LAYER, {
                        id: this.id,
                        topInterval: this.topInterval,
                        leftInterval: this.leftInterval
                    })
            }
        },
        loading (val) {
            if (!val) {
                this.buttonLoading = false
            }
        }
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
            this.$emit('input', false)
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
            this.$emit('on-close')
        },
        cancel () {
            if (this.autoClose) {
                this.closeLayer()
            }
            this.$emit('on-cancel')
            this.$emit('on-close')
        },
        EscClose (e) {
            if (this.visible) {
                if (e.keyCode === 27) {
                    this.closeLayer()
                    this.$emit('on-cancel')
                    this.$emit('on-close')
                }
            }
        }
    }
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
    z-index: 950;
    background-color: rgba(55,55,55,.6);
    transition: all .5s;
}
.layer-container {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 900;
    border: 1px solid #e9eaec;
    border-radius: 15px;
    background: #fff;
    transition: all .5s;
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
    left: 0;
    right: 0;
    height: 60px;
}
</style>
