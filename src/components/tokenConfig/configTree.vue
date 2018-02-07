<template>
    <div class="tree-container">
        <Tree
            :data="treeData"
            :render="renderTree"
        />
    </div>
</template>
<script>
const generateTreeData = (data) => {

}
export default {
    props: {
        // 树数据
        data: {
            type: Array,
            default: []
        },
        // 是否可编辑
        editable: {
            type: Boolean,
            default: false
        },
        // 节点点击事件
        nodeClick: {
            type: Function,
            default: () => {}
        },
        // 添加节点事件
        nodeAdd: {
            type: Function,
            default: () => {}
        },
        // 删除节点事件
        nodeDel: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            buttonProps: {
                type: 'ghost',
                size: 'small',
            },
            selectedNode: null
        }
    },
    computed: {
        treeData () {
            return this.data
        }
    },
    methods: {
        renderTree (h, {root, node, data}) {
            let renderButton = h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                }, [
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-plus-empty'
                        }),
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: () => { this.nodeAdd(data) }
                        }
                    }),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-minus-empty'
                        }),
                        on: {
                            click: () => { this.nodeDel(root, node, data) }
                        }
                    })
                ])
            if (!this.editable) {
                renderButton = h('span')
            }

            return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    },
                    on: {
                        click: () => {
                            this.selectedNode = node
                            this.nodeClick(data)
                        }
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', {
                            style: {
                                display: 'inline-block',
                                cursor: 'pointer',
                                padding: '0 4px',
                                'border-radius': '3px',
                                background: node === this.selectedNode ? '#d5e8fc' : 'none'
                            }
                        }, data.title)
                    ]),
                    renderButton
                ])
        }
    }
}
</script>
<style scoped>

</style>
