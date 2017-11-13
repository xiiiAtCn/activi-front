<template>
    <div>
        <h3 class="title">{{alias}}</h3>
        <div  class="operation" >
            <Button v-for="(operation, index) in operations" :key="index" type="primary" style="margin-left: 20px;"
            @click="openLayer(operation.action)">{{operation.name}}</Button>
        </div>
        <div style="padding: 0 20px;clear: both;">
            <Table :columns="columns" :data="dataSource" size="small"></Table>
        </div>
        <mLayer v-model="visible" :loading="loading" :autoClose="false" @on-ok="submit2Table" @on-cancel="cancel">
            <Form>
                <Row v-for="column in columns" :key="column.key">
                    <component
                        :is="column.type"
                        :define="column.define">
                    </component>
                </Row>
            </Form>
        </mLayer>
    </div>
</template>
<script>
    import {CLEAR_FORM_DATA, OPEN_TABLE_LAYER, CLOSE_TABLE_LAYER } from 'store/Mutation'
    import {SUBMIT_FORM_DATA} from 'store/Action'
    export default {
        props: {
            alias: {
                type: String
            },
            operations: {
                type: Array,
                default:() => {
                    return []
                }
            },
            columns: {
                type: Array,
                required: true
            },
            dataSource: {
                type: Array,
                default:() => {
                    return []
                }
            },
            visible: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                action: ''
            }
        },
        methods: {
            openLayer(action) {
                this.action = action
                this.$store.commit(OPEN_TABLE_LAYER, {form: '75d8706'})
            },
            submit2Table() { 
                this.$store.dispatch(SUBMIT_FORM_DATA, {form: '75d8706'})
            },
            cancel() {
                this.$store.commit(CLEAR_FORM_DATA, {form: '75d8706'})
                this.$store.commit(CLOSE_TABLE_LAYER, {form: '75d8706'})
            }
        }
    }

</script>

<style>
    .form-item {
        margin-bottom: 0px;
    }
</style>

<style scoped>
    .title {
        margin: 0 20px 5px;
    }

    .operation {
        margin: 0 20px 5px;
        float: right;
    }
</style>

