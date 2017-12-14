<template>
    <div>
        <div class="submit-cantainer">
            <Button type="primary" @click="handleSubmit">确定</Button>
        </div>
        <div class="detailTable">
            <component
                :define="tableModel.ui_define"
                :content="tableModel.ui_content"
                :ui_form="tableModel.ui_form"
                :is="tableModel.ui_type"
            ></component>
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
            ></component>
        </div>
    </div>
</template>

<script>

    import { FORM_ELEMENT_VALUE,CHANGE_PAGE_STATUS } from 'store/Mutation'
    import { dispatch } from 'utils/actionUtils'

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
                this.tableModel = this.define.table
                this.taskTrack = this.define.taskTrack
                this.define.tableData && this.$store.commit( FORM_ELEMENT_VALUE, {[this.define.tableName]: { 'value': this.define.tableData}, form: this.form})
                this.$store.commit( CHANGE_PAGE_STATUS, {[this.define.tableName]:this.define.tableStatus,[this.define.tableName + '_detail']:this.define.statusMap})
            },
            jobEdit(){
                dispatch(this.define.action)
            },
            handleSubmit(){
                dispatch(this.define.tableSubmitAction)
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

    }
    .cardTable{
        border-top: 2px solid #777;
    }
    .cardTable h3 {
        margin: 15px;
    }
</style>
