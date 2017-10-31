<template>
    <div class="full-height">
        <Row class="full-height">
            <!--<Col span="3" class="full-height out-use-menu-vertical">-->
                <!--<m-head :user="username"></m-head>-->
            <!--</Col>-->
            <Col span="24" class="full-height out-use-menu-vertical">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </Col>
        </Row>
    </div>
</template>
<script>
    /**
     * Vue
     */
//    import mHead from './m-head.vue'
//    import store from '../vuex/store'

    export default {
//    store,
//        components: {mHead},
//        data () {
//            return {username: 'developer'}
//        }
    }
</script>

<style scoped>

</style>
