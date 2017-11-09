<template>
    <div>
        <transition-group name="fade" mode="out-in">
            <component :key="item.ui_id" :is="item.ui_type" v-for="item in content" :define="item.ui_define"
                       :content="item.ui_content"></component>
        </transition-group>
    </div>
</template>
<script>
    export default {
        props: ['content', 'define'],
        data: function () {
            return {}
        }
    }
</script>
