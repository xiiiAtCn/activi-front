<template>
    <div class="wrap">
        <!--操作列表-->
        <Table :columns="columns" :data="data" :border="tableBorder"></Table>
        <transition name="slide-fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default{
        data () {
            return {
                documentTitle: '工作流程',
                urls: {
                    // 获取表格数据
                    getData: '/prowf/prowf/repo/findAllDeployedProWfMeta/{orgId}'
                },
                // 默认不显示纵向边框
                tableBorder: false,
                // 表格列定义
                columns: [
                    {
                        "type": "index",
                        "width": 60,
                        "align": "center"
                    },
                    {
                        "title": "操作",
                        "key": "action",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.showRouter(params.row, 'workflowCheck')
                                        }
                                    }
                                }, '查看')
                            ])
                        }
                    },
                    {
                        "title": "工作流名称",
                        "key": "name",
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    on: {
                                        click: () => {
                                            this.showRouter(params.row, 'workflowDetails')
                                        }
                                    }
                                }, params.row.name)
                            ])
                        }
                    },
                    {
                        "title": "负责人",
                        "key": "no_1"
                    },
                    {
                        "title": "运行数目",
                        "key": "no_2"
                    },
                    {
                        "title": "正常数目",
                        "key": "no_3"
                    },
                    {
                        "title": "有问题数目",
                        "key": "no_4"
                    },
                    {
                        "title": "历史数目",
                        "key": "no_5"
                    },
                    {
                        "title": "平均工时",
                        "key": "no_6"
                    },
                    {
                        "title": "平均工期",
                        "key": "no_7"
                    },
                    {
                        "title": "平均成本",
                        "key": "no_8"
                    },
                    {
                        "title": "改版次数",
                        "key": "no_9"
                    }
                ],
                data: [],
            }
        },
        methods: {
            showRouter (row, name) {
                this.$router.push({
                    name: name, params: { rowName: row.name, rowId: row.id }
                })
            },
            getData () {
                this.setUrl(this.urls.getData).setPathVariables({orgId: '56d91ab51b9e29cba863ec0e'}).forGet(res => {
                    this.data = res
                })
            }
        },
        mounted () {
            this.getData()
        }
    }
</script>

<style scoped>
    /*外层*/
    .wrap {
        padding: 20px;
        position: relative
    }
    /*路由transition*/
    .slide-fade-enter-active {
        transition: all .6s ease;
    }
    .slide-fade-leave-active {
        transition: all .6s ease;
    }
    .slide-fade-enter, .slide-fade-leave-to{
        transform: translateX(1100px);
        opacity: 0;
    }
</style>
