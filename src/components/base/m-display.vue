<template>
    <div>
        <Row >
            <Input :element-id="focusId"
                   v-model="objectModel"
                   readonly
            >
            </Input>
        </Row>
        <Row >
            <div class="box"></div>
        </Row>
    </div>
</template>
<script>
    import mixin from './mixin'

    export default {
        name: 'm-display',
        mixins: [mixin],
        computed: {
        }
    }
</script>
<style scoped>
    .box{
        padding: 16px;
    }
</style>
