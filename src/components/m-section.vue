<template>
    <div class="ivu-form ivu-form-label-right">
        <Row v-if="define.title">
            <h3 class="title-container">{{define.title}}</h3>
        </Row>
        <transition-group name="fade" mode="out-in">
            <component :is="item.ui_type" v-for="(item, index) in content" :key="index" :define="item.ui_define"
                       :content="item.ui_content"></component>
        </transition-group>
    </div>
</template>
<script>
    import mixin from './mixin'
    export default {
        mixins: [mixin],
        props: ['content', 'define'],
    }
</script>
<style scoped>
    .title-container{
        border-bottom: 1px solid #dddee1;
        padding-bottom: 8px;
        margin-bottom: 15px;
    }
</style>
