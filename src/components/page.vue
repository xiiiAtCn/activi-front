<template>
    <div>
        <Row style="margin: 10px 0px;">
            <Col span="20" >
                <h2 class="title">待办</h2>
            </Col>
            <Col span="4" >
                <div class="action-group">
                    <Button type="ghost" shape="circle" @click="back" >
                        <Icon type="reply"></Icon>
                        返回
                    </Button>
                </div>
            </Col>
        </Row>
        <Card>
            <slot>
            </slot>
        </Card>
    </div>
</template>
<script>
    export default {
        methods: {
            back() {
                this.$router.go(-1)
            }
        }
    }
</script>
<style scoped>
.title {
    margin-left: 20px;
}
.action-group {
    float: right;
    margin-right: 20px;
}
</style>
