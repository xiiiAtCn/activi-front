<template>
    <Row>
        <Col span="3">
            <Menu mode="vertical" :active-name="activeNumber" @on-select="handleSelect" class="menu" width="auto">
                <MenuItem v-for="(item, key) in titleList" :key="key" :name="key">
                    <Icon v-if="item.icon" type="item.icon"></Icon>
                        {{item.title}}
                </MenuItem>
            </Menu>
        </Col>
        <Col span="21">
            <div class="container">
                <div class="detailTable">
                    <mDetailTable
                    :define="tableModel.ui_define"
                    :content="tableModel.ui_content"
                    :ui_form="tableModel.ui_form"
                    ></mDetailTable>
                </div>
                <div class="cardTable">
                    <component
                        v-if="taskTrack"
                        :is="taskTrack.ui_type"
                        :define="taskTrack.ui_define"
                        :content="taskTrack.ui_content"
                    ></component>
                </div>
            </div>
        </Col>
    </Row>
</template>

<script>
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
            }
        },
        data () {
            return {
                theme1: 'light',
                menuName: 0,
                activeNumber:0,
                titleList:[
                    {title:'采购计划'},
                    {title:'生产计划'},
                    {title:'仓储'},
                    {title:'物流计划'},
                    {title:'售后'},
                    {title:'应收应付'}
                ],
                taskTrack:{}
            }
        },
        computed:{
            tableModel () {
                return this.define.table
            }
        },
        mounted(){
            this.taskTrack = this.define.taskTrack
        },
        methods:{
            handleSelect(name){
                this.menuName = Number(name)
            },
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
    .detailTable{

    }
    .cardTable{

    }
</style>
