<template>
    <Tabs v-model="model" type="card">
        <TabPane v-for="(item, index) in items" :key="index" :label="item.label" :name="item.name">
            <component :is="item.component" :define="item.define" :content="item.content"></component>
        </TabPane>
    </Tabs>
</template>
<script>
    import _ from 'lodash'
    export default {
        name: 'm-tab',
        props: {
            define: {
                type: Object
            }
        },
        computed: {
            items() {
                return _.get(this.define, 'items', [])
            },
            model() {
                return _.get(this.define, 'active', '')
            }
        }
    }
</script>