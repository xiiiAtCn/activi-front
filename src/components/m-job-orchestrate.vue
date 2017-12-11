<template>
    <Row>
        <Col span="4">
            <Menu mode="vertical" :active-name="activeNumber" @on-select="handleSelect" class="menu" width="auto">
                <MenuItem v-for="(item, key) in titleList" :key="key" :name="key">
                    <Icon v-if="item.icon" type="item.icon"></Icon>
                        {{item.title}}
                </MenuItem>
            </Menu>
        </Col>
        <Col span="20">
            <div class="container">
                <!--<mDetailTable-->
                    <!--v-show="showDetailTable"-->
                    <!--:alias=""-->
                    <!--:name=""-->
                    <!--:columns=""-->
                    <!--:dataSource=""-->
                    <!--:visible=""-->
                    <!--:editable=""-->
                    <!--:formTmp=""-->
                <!--&gt;</mDetailTable>-->
                <div>
                    <div class="card-container">
                        <mCardTable></mCardTable>
                    </div>
                    <div class="card-container">
                        <mCardTable></mCardTable>
                    </div>
                    <div class="card-container">
                        <mCardTable></mCardTable>
                    </div>
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
                default:{}
            },
            content:{
                type:null,
                default:{}
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
                showDetailTable:false
            }
        },
        mounted(){
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
</style>
