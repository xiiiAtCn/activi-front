<template>
    <div class="meta-config">
        <Row>
            <Col span="24">
                <h1>{{name}}meta配置</h1>
            </Col>
        </Row>
        <Row :gutter="16" class="content-container">
            <Col span="6">
                <Card>
                    <p slot="title">
                        {{inputName}}
                    </p>
                    <p>
                        <span>
                            源字段:
                        </span>
                        <div class="checkbox-container">
                            <CheckboxGroup 
                                v-model="inputSelected"
                                @on-change="inputChange"
                            >
                                <div 
                                    class="checkbox-item"
                                    v-for="node in inputNodes"
                                    :key="node.id"
                                >
                                    <Checkbox 
                                        :label="node.id"
                                        :disabled="checkboxDis(node.id, 'input')" 
                                    >
                                        <span>{{node.name}}</span>
                                    </Checkbox>
                                </div>
                            </CheckboxGroup>
                        </div>
                    </p>
                </Card>
            </Col>
            <Col span="6">
                <Card>
                    <p slot="title">
                        {{outputName}}
                    </p>
                    <p>
                        <span>
                            目标字段:
                        </span>
                        <div class="checkbox-container">
                            <CheckboxGroup 
                                v-model="outputSelected"
                                @on-change="outputChange"
                            >
                                <div 
                                    class="checkbox-item" 
                                    v-for="node in outputNodes"
                                    :key="node.id"
                                >
                                    <Checkbox
                                        :disabled="checkboxDis(node.id, 'output')" 
                                        :label="node.id"
                                    >
                                        <span>{{node.name}}</span>
                                    </Checkbox>
                                </div>
                            </CheckboxGroup>
                        </div>
                    </p>
                </Card>
            </Col>
            <Col span="4" class="button-area">
                <div>
                    <Button
                        type="primary"
                        @click="addRel"
                        :disabled="addBtnDis"
                    >
                        增加
                    </Button>
                </div>
                <div class="del-btn"> 
                    <Button
                        type="error"
                        @click="delRel"
                        :disabled="delBtnDis"
                    >
                        删除
                    </Button>
                </div>
            </Col>
            <Col span="8">
                <Card>
                    <p>
                        <span>
                            映射：
                        </span>
                        <div class="rels-container">
                            <CheckboxGroup 
                                v-model="relsSelected"
                                @on-change="relsChange"
                            >
                                <div 
                                    class="rels-item" 
                                    v-for="rel in rels"
                                    :key="rel.id"
                                >
                                    <Checkbox 
                                        :label="rel.id"
                                    >
                                        <span>{{idToNameMap[rel.from]}}</span>
                                        <span><Icon type="chevron-right"></Icon></span>
                                        <span>{{idToNameMap[rel.to]}}</span>
                                    </Checkbox>
                                </div>
                            </CheckboxGroup>
                        </div>
                    </span>
                </Card>
            </Col>
        </Row>
        <mLoading
            :event-bus="bus"
            event-show="token-config-show"
            event-hide="token-config-hide"
        >
        </mLoading>
    </div>
</template>
<script>
import {
    fetchDir,
    EventType
} from './constant'
import _ from 'lodash'
import bus from 'routers/bus'

export default {
    props: {
        // 变迁名称
        name: {
            type: String,
            required: true
        },
        inputId: {
            type: String,
            required: true
        },
        outputId: {
            type: String,
            required: true
        },
        // 是否显示 （是否取数据）
        show: {
            type: Boolean,
            required: true
        },
        relation: {
            type: Array,
            default () {
                return []
            }
        },
        getRelation: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            inputName: '',
            outputName: '',
            requestNum: 0,
            inputNodes: [],
            outputNodes: [],
            // 缓存的数据
            storeData: {},
            inputSelected: [],
            outputSelected: [],
            relsSelected: [],
            rels: [],
            idToNameMap: {},
            bus: bus,
            inputToOutputMap: {},
            outputToInputMap: {}
        }
    },
    computed: {
        addBtnDis () {
            // input与output都只选择了一个时可以添加
            return this.inputSelected.length !== 1 || this.outputSelected.length !== 1
        },
        delBtnDis () {
            return this.relsSelected.length === 0
        }
    },
    watch: {
        show (newVal, oldVal) {
            // 显示时 执行初始化
            if (newVal === true) {
                this.init()
            }
            // 隐藏时将数据提交到主页面
            if (newVal === false ) {
                this.generateOneToMultiMap('input')

                let result = []
                for (let from in this.inputToOutputMap) {
                    result.push({
                        from: from,
                        to: this.inputToOutputMap[from]
                    })
                }

                this.getRelation(result)
            }
        },
        requestNum (val) {
            if (val == 0) {
                this.bus.$emit(EventType.hideLoading)
            } else {
                this.bus.$emit(EventType.showLoading)
            }
        },
        rels () {
            this.generateOneToMultiMap('input')
            this.generateOneToMultiMap('output')
        }
    },
    methods: {
        init () {
            this.resetData()
            this.getNodes(this.inputId)
                .then(data => {
                    this.inputName = data.name
                    this.inputNodes = data.nodes
                    this.getNodes(this.outputId)
                        .then(data => {
                            this.outputName = data.name
                            this.outputNodes = data.nodes
                        })
                })
            this.fillData()
        },
        // 重置页面数据
        resetData () {
            this.inputName = ''
            this.outputName = ''
            this.requestNum = 0
            this.inputNodes = []
            this.outputNodes = []
            this.inputSelected = []
            this.outputSelected = []
            this.rels = []
            this.relsSelected = []
        },
        // 生成关联
        fillData () {
            for (let rel of this.relation) {
                for (let to of rel.to) {
                    this.rels.push({
                        from: rel.from,
                        to: to,
                        id: this.generateRelId(rel.from, to)
                    })
                }
            }
        },
        addRel () {
            const from = this.inputSelected[0],
                  to = this.outputSelected[0]
            this.rels.push({
                from: from,
                to: to,
                id: this.generateRelId(from, to)
            })
            this.inputSelected = []
            this.outputSelected = []
        },
        generateRelId(from, to) {
            return `${from}-${to}`
        },
        delRel () {
            const relIdIndex = {}
            this.relsSelected.forEach(id => {
                this.rels.splice(this.rels.findIndex(item => {
                    return item.id === id
                }), 1)
            })
            this.relsSelected = []
        },
        // 获取templateId对应的节点
        getNodes (id) {
            // 缓存中有从缓存中取
            if (!!this.storeData[id]) {
                 return new Promise((resolve, reject) => {
                     resolve(_.cloneDeep(this.storeData[id]))
                 })
            } else {
                return new Promise((resolve, reject) => {
                    this.requestNum++
                    this.setUrl(fetchDir.getNodesByTemplateId)
                        .setPathVariables({
                            templateId: id,
                            cache: true
                        })
                        .forGet((result, err) => {
                            this.requestNum--
                            if (err || !result.success) {
                                this.$Message(result.message || "获取节点失败")
                                reject()
                            } else {
                                this.$set(this.storeData, id, result.data)
                                resolve(_.cloneDeep(result.data))
                                this.generateIdToNameMap(_.cloneDeep(result.data.nodes))
                            }
                        })
                })
            }
        },
        generateIdToNameMap (nodes) {
            for (let node of nodes) {
                this.idToNameMap[node.id] = node.name
            }
        },
        // 单选控制
        inputChange (arr) {
            this.singleCheck(arr, 'input')
        },
        // 单选控制
        outputChange (arr) {
            this.singleCheck(arr, 'output')
        },
        singleCheck (arr, type) {
            let attr = ''
            switch(type) {
                case 'input':
                    attr = 'inputSelected'
                    break
                case 'output':
                    attr = 'outputSelected'
                    break
                default:
                    throw new Error(`当前type不对:${type}`)
            }
            if (arr.length > 0) {
                this[attr] = [arr[arr.length - 1]]
            } else {
                this[attr] = []
            }
        },
        relsChange (arr) {

        },
        // 生成一对多的关系
        generateOneToMultiMap (type) {
            let attr = '',
                reverseAttr = '',
                mapAttr = '',
                rels = _.cloneDeep(this.rels)
            switch (type) {
                case 'input':
                    attr = 'from'
                    reverseAttr = 'to'
                    mapAttr = 'inputToOutputMap'
                    break
                case 'output':
                    attr = 'to'
                    reverseAttr = 'from'
                    mapAttr = 'outputToInputMap'
                    break
                default:
                    throw new Error(`generateOneToMultiMap方法不支持的type:${type}`)
            }

            let map = {}
            for (let rel of rels) {
                if (!map[rel[attr]]) {
                    map[rel[attr]] = []
                }
                map[rel[attr]].push(rel[reverseAttr])
            }
            this[mapAttr] = map
        },
        checkboxDis(id, type) {
            switch (type) {
                case 'input':
                    // 输出都被选择完 不能选择
                    if (Object.keys(this.outputToInputMap).length === this.outputNodes.length) {
                        return true
                    }

                    // 都选择了也不能选择
                    if (!!this.inputToOutputMap[id] && this.inputToOutputMap[id].length === this.outputNodes.length) {
                        return true
                    } else {
                        return false
                    }
                    break
                case 'output':
                    if (!!this.outputToInputMap[id]) {
                        return true
                    } else {
                        return false
                    }
                    break
                default:
                    throw new Error(`方法checkboxDis不支持的type:${type}`)
            }
        }
    }
}
</script>
<style scoped>
.content-container {
    margin-top: 15px; 
}
.button-area {
    text-align: center;
}
.button-area .del-btn {
    margin-top: 15px; 
}
</style>


