<template>
    <div class="full-height">
        <Row class="full-height">
            <Col span="24" class="full-height out-use-menu-vertical">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </Col>
        </Row>
        <mLoading
            :event-bus="bus"
            :position="position"
            event-show="show-my-full-loading"
            event-hide="hide-my-full-loading"
            >
        </mLoading>
    </div>
</template>
<script>
    import bus from 'routers/bus'
    export default {
        data () {
            return {
                bus: bus,
                position: {
                    top: '30vh',
                    left: '45vw'
                }
            }
        }
    }
</script>

<style scoped>

</style>
