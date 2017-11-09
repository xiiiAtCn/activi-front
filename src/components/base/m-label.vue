<template>
    <Row >
        <Col class="label">
            {{label}}
        </Col>
    </Row>
</template>
<script>
    import _ from 'lodash'
    export default {
        name: 'm-label',
        props: ['define'],
        computed: {
            label () {
                return _.get(this.define, 'label', '标签')
            },
            visible () {
                return _.get(this.define, 'visible', true)
            },
            bindTarget () {
                return _.get(this.define, 'target', '')
            }
        }
    }
</script>
<style scoped>
    .label {
        line-height: 32px;
        height: 32px;
        font-size: 16px;
    }
</style>
