<template>
    <div class="config-page-container">
        <Row class="content-container">
            <Col span="8" class="tree-container">
                <ConfigTree 
                    :data="treeData"
                    :editable="true"
                    :nodeClick="nodeClick"
                    :nodeAdd="append"
                    :nodeDel="remove"
                />
            </Col>
            <Col span="16">

                <ConfigTable
                    :define="tableDefine"
                    :data="tableData"
                />
            </Col>
        </Row>
        <Row>
            <Col span="24" class="footer-container">
            </Col>
        </Row>
    </div>
</template>
<script>
import ConfigTree from './configTree'
import ConfigTable from './configTable'

const treeData = [
    {
        title: 'parent1',
        id: '1',
        selected: true,
        children: [
            {
                title: 'child 1-1',
                id: '1-1',
                children: [
                    {
                        title: 'leaf 1-1-1',
                        id: '1-1-1'
                    },
                    {
                        title: 'leaf 1-1-2',
                        id: '1-1-2'
                    }
                ]
            }
        ]
    },
    {
        title: 'parent2',
        id: '2',
        children: [
            {
                title: 'child 2-1',
                id: '2-1',
                children: [
                    {
                        title: 'leaf 2-1-1',
                        id: '2-1-1'
                    },
                    {
                        title: 'leaf 2-1-2',
                        id: '2-1-2'
                    }
                ]
            },
            {
                title: 'child 2-2',
                id: '2-2',
                children: [
                    {
                        title: 'leaf 2-2-1',
                        id: '2-2-1'
                    },
                    {
                        title: 'leaf 2-2-2',
                        id: '2-2-2'
                    }
                ]
            }
        ]
    }
]

const tableDefine = [
    {
        key: 'fields',
        title: '启用字段',
        type: 'checkbox'
    },
    {
        key: 'fkey',
        title: 'fkey',
        type: 'text'
    },
    {
        key: 'fieldName',
        title: 'fieldName',
        type: 'input',
        rules: [
            {
                required: true,
                message: '不能为空',
                trigger: 'blur'
            }
        ]
    },
    {
        key: 'caption',
        title: 'caption',
        type: 'input',
        rules: [
            {
                min: 10,
                type: 'string',
                message: '应大于10个字符'
            }
        ]
    },
    {
        key: 'type',
        title: 'type',
        type: 'select',
        option: [
            {
                value: '1',
                label: '类型1'
            },
            {
                value: '2',
                label: '类型2'
            }
        ]
    },
    {
        key: 'visiable',
        title: 'visiable',
        type: 'checkbox'
    },
    {
        key: 'required',
        title: 'required',
        type: 'checkbox'
    },
    {
        key: 'readonly',
        title: 'readonly',
        type: 'checkbox'
    }
]

const tableData = [
    {
        id: '1',
        fields: false,
        fkey: 'Field1',
        fieldName: '111',
        caption: '',
        type: '',
        visiable: false,
        required: true,
        readonly: false
    },
    {
        id: '2',
        fields: true,
        fkey: 'Field2',
        fieldName: '',
        caption: '',
        type: '',
        visiable: false,
        required: false,
        readonly: false
    }
]

export default {
    components: {
        ConfigTree,
        ConfigTable
    },
    data () {
        return {
            buttonProps: {
                type: 'ghost',
                size: 'small',
            },
            treeData: [],
            tableDefine: [],
            tableData: []
        }
    },
    mounted () {
        this.treeData = this.convertToTreeData(treeData)
        this.tableDefine = tableDefine
        this.tableData = tableData
    },
    methods: {
        nodeClick (data) {
            console.log(`node data: ${data}`)
        },
        append (data) {
            const children = data.children || [];
            children.push({
                title: 'appended node',
                expand: true
            });
            this.$set(data, 'children', children);
        },
        remove (root, node, data) {
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            parent.children.splice(index, 1);
        },
        convertToTreeData (data) {
            return data
        }
    }
}
</script>
<style scoped>
.config-page-container {
    margin: 30px;
}
.config-page-container .content-container,
.config-page-container .footer-container {
    border: 1px solid #707B7C;
    border-radius: 5px;
}
.tree-container {
    overflow-x: auto;
    border-right: 1px solid #707B7C;
}
</style>