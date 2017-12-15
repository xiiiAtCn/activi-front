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
                <div>
                    <div class="card-container" v-for="item in content">
                        <mCardTable
                            :content="item"
                        ></mCardTable>
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
                default () {
                    return [
                        {
                            tableData:[
                                {
                                    FID: '14564684',
                                    FchargeName: '王良',
                                    FchargeID: '0154863445'
                                }
                            ],
                            contentData:[
                                {
                                    title:'制单人',
                                    content:'高雪春'
                                },
                                {
                                    title:'单号',
                                    content:'bill-20171205-8'
                                },
                                {
                                    title:'询价单内码',
                                    content:'xunjia-20171205-11'
                                },
                                {
                                    title:'供应商名称',
                                    content:'北京市燃气集团有限责122222222222任公司第3分公司'
                                },
                                {
                                    title:'使用部门id',
                                    content:'09'
                                },
                                {
                                    title:'单号',
                                    content:'bill-20171205-8'
                                },
                                {
                                    title:'询价单内码',
                                    content:'xunjia-20171205-11'
                                },
                                {
                                    title:'供应商名称',
                                    content:'北京市燃气集团有限责任公司第3分公司'
                                },
                                {
                                    title:'使用部门id',
                                    content:'09'
                                },
                            ]
                        }
                    ]
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
