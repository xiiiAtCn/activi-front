<template>
    <span :style="{ fontSize:define.size || '14px' ,
                    color:define.color || '#333',
                    padding:define.padding || '0',
                    margin:define.margin || '0'}">{{define.text}}</span>
</template>
<script>
    export default {
        props: ['define'],
        computed: {
        },
        methods: {
        }
    }
</script>
<style scoped>
</style>
