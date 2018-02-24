<template>
    <div class="token-view-container">
        <Row>
            <Col span="12">
                <h1>库所浏览</h1>
            </Col>
            <Col span="12" class="button-area">
                <ButtonGroup>
                    <Button @click="configToken">编辑meta</Button>
                </ButtonGroup>
            </Col>
        </Row>
        <Row class="content-container">
            <Col span="8" class="tree-container">
                <ConfigTree 
                    :data="treeData"
                    :editable="false"
                    :nodeClick="nodeClick"
                />
            </Col>
            <Col span="16" class="table-container">
                <ConfigTable
                    :define="tableDefine"
                    :data="tableData"
                    :disabled="true"
                    class="config-table"
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

const treeData = {
    1: [
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
        }
    ],
    2: [
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
}

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
        width: 100,
        rules: [
            {
                required: true,
                message: '不能为空'
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
        ],
        rules: [
            {
                required: true,
                message: '不能为空'
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

const tableData = {
    1: [
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
    ],
    2: [
        {
            id: '1',
            fields: false,
            fkey: 'Field3',
            fieldName: '',
            caption: '',
            type: '',
            visiable: false,
            required: true,
            readonly: false
        },
        {
            id: '2',
            fields: true,
            fkey: 'Field4',
            fieldName: '',
            caption: '',
            type: '',
            visiable: false,
            required: false,
            readonly: false
        }
    ]
}

export default {
    components: {
        ConfigTree,
        ConfigTable
    },
    data () {
        return {
            treeData: [],
            tableDefine: [],
            tableData: []
        }
    },
    mounted () {
        let id = this.$router.currentRoute.params.tokenId
        this.treeData = treeData[id] ? treeData[id] : []
        this.tableDefine = tableDefine
        this.tableData = tableData[id] ? tableData[id] : []
    },
    methods: {
        nodeClick (data) {
            console.log(`node data: ${data}`)
        },
        configToken () {
            let params = this.$router.currentRoute.params
            this.$router.push({
                path: `/layoutContent/${params.id}/tokenConfig?tokenId=${params.tokenId}`
            })
        }
    }
}
</script>
<style scoped>
.token-view-container {
    margin: 30px;
}
.token-view-container
.button-area {
    text-align: right;
}
.tree-container {
    overflow-x: auto;
    border-right: 1px solid #707B7C;
}
.table-container {
    overflow-x: auto;
    direction: rtl;
}
</style>
<style>
.token-view-container
.ivu-table-wrapper {
    direction: ltr;
}
</style>