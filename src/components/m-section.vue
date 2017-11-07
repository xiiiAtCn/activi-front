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
//        beforeCreate: function () {
//            this.$options.components.mRow = require('./base/m-row.vue');
//            this.$options.components.mTable = require('./m-table.vue')
//        },
        components: {
            mRow: function (resolve) {
                require(['./base/m-row.vue'], resolve)
            },
            mTable: function (resolve) {
                require(['./m-table.vue'], resolve)
            },
            mSteps: function (resolve) {
                require(['./base/m-steps.vue'], resolve)
            }
        },
        props: ['content', 'define'],
        data: function () {
            return {}
        }
    }
</script>
