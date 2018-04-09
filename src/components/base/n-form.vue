<template>
    <div>
        <Form :ref="define.model" :model="formItem" :label-width="120" label-position="right" :rules="ruleValidate">
            <Row v-for="(row,rowKey) in content" :key="rowKey">
                <Col v-for="(col,colKey) in row.ui_content" :span="col.ui_define.col" :key="colKey">
                    <FormItem v-for="(item,key) in col.ui_content" :label="item.ui_define.label" :key="key"
                              :rules="{required: true, message: '不能为空', trigger: 'blur'}"
                    >
                        <component
                            v-for="v in item.ui_content"
                            :is="v.ui_type"
                            :define="v.ui_define"
                            :content="v.ui_content"
                            :modelText="formItem[v.ui_define.name]"
                            @dataChange="handleChange"
                        >
                        </component>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Button @click="handleClick">模拟数据注入</Button>
    </div>
</template>
<script>
import _ from 'lodash'

export default {
    props: ['define', 'content', 'form'],
    data() {
        return {
            formData:{},
            rules:[],
            formItem:{},
            formItemDefault:{
                item3:'123',
                item4:'1233333'
            },
            ruleValidate: {
                item3: [
                    { required: true, message: '请输入xxx3', trigger: 'blur' }
                ],
                item4: [
                    { required: true, message: '请输入xxx4', trigger: 'blur' }
                ],
            }
        }
    },
    computed: {

    },
    mounted(){
    },
    methods:{
        handleClick(){
            this.formItem = this.formItemDefault
        },
        handleChange(data){
            this.formData[data.name] = data.data
        }
    }
}
</script>

<style scoped>

.ivu-form-item-label {
    text-align: right;
}

.ivu-form-star::before {
    content: "*";
    display: inline-block;
    margin-right: 2px;
    line-height: 1;
    font-family: SimSun;
    font-size: 1em;
    color: #ed3f14;
}

.expend-all {
    width: 100%;
}

.m-flex {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
}

.m-input {
    margin-left: 0;
    width: 100%;
}
</style>
