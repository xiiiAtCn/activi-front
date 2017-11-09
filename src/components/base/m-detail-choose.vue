<template>
    <div v-show="visible">
        <Row >
            <Col span="22">
                <Input readonly 
                    :value="visibleName" 
                    :placeholder="placeholder">
                </Input>
            </Col>
            <Col span="2" >
                <Button 
                    :disabled="readonly"
                    style="float: right;" 
                    @click="openLayer" >
                    选择
                </Button>
            </Col>
        </Row>
        <Row>
            <div v-if="hasError" class="gateway-item-error">{{errorMessage}}</div>
            <div v-else class="occupation gateway-item-error">隐藏</div>
        </Row>
        <mLayer v-model="visible" :autoClose="true">
            <Table 
                :columns="columns" 
                :data="data"
            >
            </Table>
        </mLayer>
    </div>
</template>
<script>
    import mixin from './mixin'
    import { ELEMENT_VALIDATE_RESULT } from 'store/Action'
    import _ from 'lodash'
    export default {
        name: 'm-detail-choose',
        mixins: [mixin],
        data () {
            return {
                visible: false,
                columns: [{}],
                data: []
            }
        },
        computed: {
            placeholder () {
                return _.get(this.define, 'placeholder', '请选择')
            },
            showAttribute () {
                return _.get(this.define, 'showAttribute', 'name')
            },
            visibleName () {
                return this.objectModel[this.showAttribute] || ''
            }
        },
        methods: {
            openLayer () {
                this.visible = true
            },
            valid () {
                if (!this.readonly) {
                    let hasError = false
                    if (this.visibleName === '') {
                        hasError = true
                        this.errorMessage = '请输入必填项'
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.form})
                }
            }
        }
    }
</script>