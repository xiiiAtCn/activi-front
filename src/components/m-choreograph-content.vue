<template>
    <div>
        <div class="submit-cantainer">
            <Button type="primary" @click="handleSubmit">确定</Button>
        </div>
        <div class="detailTable">
            <div>
                <component
                    :define="tableModel.ui_define"
                    :content="tableModel.ui_content"
                    :ui_form="form"
                    :is="tableModel.ui_type"
                ></component>
            </div>
        </div>
        <div class="button-cantainer">
            <Button type="ghost" @click="jobEdit">任务编排</Button>
        </div>
        <div class="cardTable" v-if="taskTrack">
            <h3>已编排任务</h3>
            <component
                :is="taskTrack.ui_type"
                :define="taskTrack.ui_define"
                :content="taskTrack.ui_content"
                :form="form"
            ></component>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { FORM_ELEMENT_VALUE,ADD_PAGE_STATUS,ADD_NEW_OBJECT } from 'store/Mutation'
    import { dispatch,getData } from 'utils/actionUtils'

    export default {
        props:{
            define:{
                type:null,
                default () {
                    return {}
                }
            },
            content:{
                type:null,
                default () {
                    return {}
                }
            },
            form:{
                type:null,
                default:'form'
            }
        },
        data () {
            return {
                tableModel:{},
                taskTrack:{}
            }
        },
        computed:{
        },
        mounted(){
            this.handleDefault()
        },
        methods:{
            handleDefault(){
                debugger
                this.tableModel = this.define.table
                let name = this.define.tableName
                this.taskTrack = this.define.taskTrack
                //表格内容提交
                let keyList = Object.keys(this.define.tableData[0])

                this.$store.commit( ADD_NEW_OBJECT , {
                    attribute: this.form ,
                    value: {
                        loading: true,
                        reset: false,
                        validate: false,
                        visible: false,
                        [ this.form + 'waitCheck']: []
                    }
                })
                let value = {
                    form: this.form
                }
                keyList.forEach(element => {
                    value[element] = {
                        value: this.define.tableData[0][element]['value']
                    }
                })

                this.$store.commit( FORM_ELEMENT_VALUE,value)

                this.$store.commit( FORM_ELEMENT_VALUE, {[this.define.tableName]: { type: 'm-detail-table', value: this.define.tableData}, form: this.form})
                //状态提交
                this.$store.commit( ADD_PAGE_STATUS, {[name + this.form]:this.define.tableStatus,[name + this.form + '_detail']:this.define.statusMap})
            },
            jobEdit(){
                let url = _.cloneDeep(this.define.action)
                dispatch(url)
            },
            handleSubmit(){
                let url = _.cloneDeep(this.define.submitUrl)
                url.body={
                    'data' : _.get(this.$store.state.formData, [this.form , this.define.tableName , 'value'])
                }
                
                getData(url, (result, err) => {
                    if(err) {
                        this.$Message.error('服务器出错了, 请稍后再试!')
                        return
                    }
                    dispatch(result)
                })
            }
        }
    }
</script>

<style scoped>
    .container{
        padding:0 15px;
    }
    .card-container{
        margin-bottom: 20px;
    }
    .container>div{
        margin-bottom: 20px;
    }
    .button-cantainer{
        padding: 20px;
    }
    .submit-cantainer{
        padding:5px 20px;
    }
    .detailTable{
        overflow-x: auto;
    }
    .detailTable>div{
        width: 2000px;
    }
    .cardTable{
        border-top: 2px solid #777;
    }
    .cardTable h3 {
        margin: 15px;
    }
</style>
