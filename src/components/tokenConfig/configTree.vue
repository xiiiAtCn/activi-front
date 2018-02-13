<template>
    <div class="tree-container">
        <Tree
            ref="tree"
            :data="data"
            :render="renderTree"
            @on-select-change="test"
        />
    </div>
</template>
<script>
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
        },
        getData: {
            type: Boolean,
            default: false
        },
        getTreeData: {
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
    methods: {
        test () {
            debugger
        },
        renderTree (h, {root, node, data}) {
            let plusButton = h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                        icon: 'ios-plus-empty'
                    }),
                    style: {
                        marginRight: '8px'
                    },
                    on: {
                        click: (event) => { 
                            event.stopPropagation()
                            root.forEach(treeNode => {
                                this.$set(treeNode.node, 'selected', false)
                            })
                            this.nodeAdd(root, node, data) 
                        }
                    }
                })
            let minusButton = h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                        icon: 'ios-minus-empty'
                    }),
                    on: {
                        click: () => { this.nodeDel(root, node, data) }
                    }
                })

            let buttons = []
            if (data.add) {
                buttons.push(plusButton)
            }
            if (data.del) {
                buttons.push(minusButton)
            }
            let renderButton = h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                }, buttons)
            if (!this.editable) {
                renderButton = h('span')
            }

            if (this.data.length === 0) {
                return h('Button', {
                    props: {
                        type: 'primary'
                    },
                    on: {
                        click: () => {
                            this.nodeAdd()
                        }
                    }
                })
            } else {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    },
                    on: {
                        click: () => {
                            this.selectedNode = node
                            root.forEach(treeNode => {
                                this.$set(treeNode.node, 'selected', false)
                            })
                            this.$set(data, 'selected', true)
                            this.nodeClick(root, node, data)
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
                                background: data.selected ? '#d5e8fc' : 'none'
                            }
                        }, data.title)
                    ]),
                    renderButton
                ])
            }
        },
        getSelectedNodes () {
            return this.$refs['tree'].$data.flatState.filter(obj => obj.node.selected)
        }
    },
    watch: {
        getData () {
            debugger
            this.getTreeData()
        }
    }
}
</script>
<style scoped>

</style>
