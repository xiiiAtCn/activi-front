<template>
    <div class="ivu-form ivu-form-label-right">
        <transition-group name="fade" mode="out-in">
            <component :key="item.ui_id" :is="item.ui_type" v-for="item in tempContent" :define="item.ui_content"
                       :content="item.ui_content"></component>
        </transition-group>
    </div>
</template>
<script>
    import mixin from './mixin'
    export default {
        mixins: [mixin],
        props: ['content', 'define'],
        data: function () {
            return {
                tempContent: this.content
            }
        },
        methods: {
            getSectionDefine () {
                this.getData('sectionDefine', (data, err) => {
                    if (data) {
                        this.tempContent = data.ui_content
                    }
                })
            },
        }
    }
</script>
