<template>
    <Table border :columns="columns" :data="data"></Table>
</template>

<script>
    import {
        fetchDir
    } from '../tokenConfig/constant'

    export default {
        name: "todoList",
        data() {
            return {
                columns: [
                    {
                        title: '待办事项',
                        key: 'taskName',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row['taskName'])
                            ]);
                        }
                    },
                    {
                        title: '所有者',
                        key: 'owner',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('span', params.row['owner'])
                            ]);
                        }
                    },
                    {
                        title: '创建日期',
                        key: 'createDate'
                    },
                    {
                        title: '处理',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.claim(params.index)
                                        }
                                    }
                                }, '签收')
                            ]);
                        }
                    }
                ],
                data: []
            }
        },
        mounted() {
            this.setUrl(fetchDir.todoList)
                .forGet((res, err) => {
                    if (err) {
                        this.$Message.error(res.message ? res.message : '获取待办任务列表失败')
                    } else {
                        this.data = res;
                    }
                })
        },
        methods: {
            claim(index) {
                var selectTaskId = this.data[index]['taskId'];
                this.setUrl(fetchDir.claimTask)
                    .setPathVariables({taskId: selectTaskId})
                    .forGet((res, err) => {
                        if (err) {
                            this.$Message.error('任务签收失败')
                        } else {
                            this.data[index]['claimed'] = true
                        }
                    })

            }
        }
    }
</script>

<style scoped>

</style>