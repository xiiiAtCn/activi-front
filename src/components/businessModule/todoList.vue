<template>
    <page>
        <Table border :columns="columns" :data="data"></Table>
    </page>
</template>

<script>
    import {
        fetchDir,
    } from '../tokenConfig/constant'

    import { dispatch, getData} from '../../utils/actionUtils'

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
                            ])
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
                            ])
                        }
                    },
                    {
                        title: '创建日期',
                        key: 'createDate',
                        render:(h, {row}) => {
                            let primary = new Date(row.createDate)
                            let date = primary.toLocaleDateString().replace(/\//g, '-')
                            let time = `${primary.getHours()}:${primary.getMinutes()}`
                            return h('span', {}, `${date} ${time}`)
                        }
                    },
                    {
                        title: '处理',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, { row , index }) => {
                            let { claimed } = row
                            return h('div', [
                                !claimed ? h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.claim(index)
                                        }
                                    }
                                }, '签收') : '',
                                claimed ? h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleTask(row)
                                        }
                                    }
                                }, '办理') : '',
                                claimed ? h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            console.log('nothing to do now')
                                        }
                                    } 
                                }, '反签收') : ''
                            ])
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
                let selectTaskId = this.data[index]['taskId'];
                this.setUrl(fetchDir.claimTask)
                    .setPathVariables({taskId: selectTaskId})
                    .forGet((res, err) => {
                        if (err) {
                            this.$Message.error('任务签收失败')
                        } else {
                            this.data[index]['claimed'] = res
                        }
                    })

            },
            openTask(index) {
                let selectTaskId = this.data[index]['taskId'];
                // 画面跳转

                let action = {
                    type: "link",
                    url: fetchDir.openTask,
                    pathParams: {'taskId': selectTaskId}
                }
                dispatch(action)
            },
            handleTask(row) {
                let { taskId } = row
                let action = {
                    type: 'link',
                    url: `/process/task/${taskId}/handle/layout`,
                    at: '/layoutContent/xxx/page',
                    pathParams: {
                        taskId
                    }
                } 
                dispatch(action)
            }
        }
    }
</script>

<style scoped>

</style>