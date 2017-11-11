<template>
    <Row :gutter="16" class="wrap">
        <Row v-for="item in items" class="row">
            <Button icon="navicon-round" :class="item.template.type">{{item.template.title}}</Button>
            <div class="rowBorder"></div>
            <Col v-for="boMeta in item.children" :key="item.ui_id" class="childRow">
            <Button-group>
                <Button :key="button.text" v-for="button in boMeta.buttons" :type="button.type"
                        @click="getMeta(button.url)">{{button.text}}
                    </Button>
            </Button-group>
            </Col>
        </Row>
    </Row>
</template>

<script>
    import _ from 'lodash'
    import {dispatch} from '../utils/actionUtils'
    export default{
        props: {
            define: {
                type: Object
            }
        },
        computed: {
            items: function () {
                return _.get(this.define, 'links', [])
            }
        },
        methods: {
            getMeta: function (url) {
                dispatch(url)
            }
        }
    }
</script>

<style scoped>
    .wrap {
        padding: 0 10px
    }
    .row {
        margin: 10px 0 30px 0
    }
    .primary {
        border-radius: 0;
        background: #2db7f5;
        color: white;
        border: 1px solid #2db7f5;
        transition: 0.5s;
    }
    .primary:hover {
        background: #57c5f7;
        border: 1px solid #57c5f7;
    }
    .warning {
        border-radius: 0;
        background: #fabf8f;
        color: white;
        border: 1px solid #fabf8f;
        transition: 0.5s;
    }
    .warning:hover {
        background: #ffcc99;
        border: 1px solid #ffcc99;
    }
    .rowBorder {
        border-bottom: 1px solid #2db7f5;
        margin-bottom: 16px
    }
    .childRow {
        display: inline-block;
        margin-right: 12px
    }
    a.btn {
        margin-right: 5px;
    }
</style>
