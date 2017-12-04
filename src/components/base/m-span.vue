<template>
    <div>
        <Row >
            <span class="ivu-form-item-label">{{define.text}}</span>
        </Row>
        <Row >
            <div class="box"></div>
        </Row>
    </div>
</template>
<script>
    export default {
        props: ['define']
    }
</script>
<style scoped>
    .box{
        padding: 16px;
    }
    .ivu-form-item-label{
        padding-left: 10px;
    }
</style>
