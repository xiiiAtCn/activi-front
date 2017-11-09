<template>
    <Row>
        <span>
            {{label}}
        </span>
    </Row>
</template>
<script>
    import _ from 'lodash'
    export default {
        name: 'm-label',
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