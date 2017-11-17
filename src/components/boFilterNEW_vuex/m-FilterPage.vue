<template>
    <div>
        <!-- select部分 -->
        <Row class="nav-select">
            <mNavSelect
                :define="navSelectDefine"
                :form="form"/>
        </Row>
        <!-- filter部分 -->
        <mBoFilter
            :define="filterDefine"
            :form="form"/>
        <!-- table一览部分 -->
        <tableF-Shim
            :define="tableDefine"
            :form="form"/>
    </div>
</template>
<script>
import _ from 'lodash'
import { deepCopy } from 'utils/utils'

export default{
    props: {
        define: {
            type: Object
        },
        form: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            navSelectDefine: {
                isRelated: true,
                relation: [],
                dataLink: [
                    {
                        attr: 'selectData',
                        link: {
                            method: 'GET',
                            url: '',
                            pathParams: {},
                            queryParams: {
                                id: {
                                    value: '',
                                    defaultValue: ''
                                }
                            },
                            body: {}
                        }
                    }
                ],
                id: '',
            },
            filterDefine: {
                isRelated: true,
                relation: [this.navSelectId],
                dataLink: [
                    {
                        attr: 'bodyData',
                        link: {
                            method: 'GET',
                            url: '',
                            pathParams: {},
                            queryParams: {
                                id: {
                                    value: this.navSelectId,
                                    defaultValue: ''
                                }
                            },
                            body: {}
                        }
                    }
                ],
                id: '',
            },
            tableDefine: {
                isRelated: true,
                relation: [],
                dataLink: [
                    {
                        attr: 'tableData',
                        link: {
                            method: 'POST',
                            url: '',
                            pathParams: {},
                            queryParams: {},
                            body: {
                                id: {
                                    value: '',
                                    defaultValue: ''
                                },
                                condition: {
                                    value: '',
                                    defaultValue: {}
                                }
                            }
                        }
                    },
                    {
                        attr: 'tableDefine',
                        link: {
                            method: 'GET',
                            url: '',
                            pathParams: {},
                            queryParams: {
                                id: {
                                    value: '',
                                    defaultValue: ''
                                }
                            },
                            body: {}
                        }
                    }
                ],
                id: '',
            }
        }
    },
    mounted () {
        // 设置id
        this.$set(this.navSelectDefine, 'id', this.navSelectId)
        this.$set(this.filterDefine, 'id', this.filterId)
        this.$set(this.tableDefine, 'id', this.tableId)

        // 设置url
        this.$set(this.navSelectDefine.dataLink[0].link, 'url', this.navDataUrl)
        this.$set(this.filterDefine.dataLink[0].link, 'url', this.filterDataUrl)
        this.$set(this.tableDefine.dataLink[0].link, 'url', this.tableDataUrl)
        this.$set(this.tableDefine.dataLink[1].link, 'url', this.tableDefineUrl)

        // 设置关联关系
        this.$set(this.navSelectDefine, 'relation', [this.navSelectId])
        this.$set(this.navSelectDefine.dataLink[0].link.queryParams.id, 'value', this.navSelectId)
        this.$set(this.filterDefine, 'relation', [this.navSelectId])
        this.$set(this.filterDefine.dataLink[0].link.queryParams.id, 'value', this.navSelectId)
        this.$set(this.tableDefine, 'relation', [this.navSelectId, this.filterId])
        this.$set(this.tableDefine.dataLink[0].link.body.id, 'value', this.navSelectId)
        this.$set(this.tableDefine.dataLink[0].link.body.condition, 'value', this.filterId)
        this.$set(this.tableDefine.dataLink[1].link.queryParams.id, 'value', this.navSelectId)
    },
    computed: {
        navDataUrl () {
            return _.get(this.define, 'navDataUrl', '')
        },
        filterDataUrl () {
            return _.get(this.define, 'filterDataUrl', '')
        },
        tableDataUrl () {
            return _.get(this.define, 'tableDataUrl', '')
        },
        tableDefineUrl () {
            return _.get(this.define, 'tableDefineUrl', '')
        },
        navSelectId () {
            return _.get(this.define, 'navSelectId', 'select')
        },
        filterId () {
            return _.get(this.define, 'filterId', 'filter') 
        },
        tableId () {
            return _.get(this.define, 'dataListName', 'table')
        },
    }
}
</script>
<style scoped>
.nav-select{
    margin-bottom: 10px;
}
</style>