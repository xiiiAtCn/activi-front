<template>
    <div>
        <!-- select部分 -->
        <Row class="nav-select">
            <mNavSelect
                :define="navSelectDefine"/>
        </Row>
        <!-- filter部分 -->
        <mBoFilter
            :define="filterDefine"/>
        <!-- table一览部分 -->
        <tableF-Shim
            :define="tableDefine"/>
    </div>
</template>
<script>
import _ from 'lodash'
import { deepCopy } from 'utils/utils'

const idObj = {
    navSelectId: 'select',
    filterId: 'filterId',
    tableId: 'tableId'
}

const navSelectDefine = {
    isRelated: true,
    relation: [idObj.navSelectId],
    dataLink: [
        {
            attr: 'selectData',
            link: {
                method: 'GET',
                url: '',
                pathParams: {},
                queryParams: {
                    id: {
                        value: idObj.navSelectId,
                        defaultValue: ''
                    }
                },
                body: {}
            }
        }
    ],
    id: idObj.navSelectId
}
const filterDefine = {
    isRelated: true,
    relation: [idObj.navSelectId],
    dataLink: [
        {
            attr: 'bodyData',
            link: {
                method: 'GET',
                url: '',
                pathParams: {},
                queryParams: {
                    id: {
                        value: idObj.navSelectId,
                        defaultValue: ''
                    }
                },
                body: {}
            }
        }
    ],
    id: idObj.filterId
}
const tableDefine = {
    isRelated: true,
    relation: [idObj.navSelectId, idObj.filterId],
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
                        value: idObj.navSelectId,
                        defaultValue: ''
                    },
                    condition: {
                        value: idObj.filterId,
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
                        value: idObj.navSelectId,
                        defaultValue: ''
                    }
                },
                body: {}
            }
        }
    ],
    id: idObj.tableId
}

export default{
    props: {
        define: {
            type: Object
        }
    },
    data () {
        return {
            navSelectDefine: {},
            filterDefine: {
                isRelated: true,
                relation: [idObj.navSelectId],
                dataLink: [
                    {
                        attr: 'bodyData',
                        link: {
                            method: 'GET',
                            url: '',
                            pathParams: {},
                            queryParams: {
                                id: {
                                    value: idObj.navSelectId,
                                    defaultValue: ''
                                }
                            },
                            body: {}
                        }
                    }
                ],
                id: idObj.filterId
            },
            tableDefine: {
                isRelated: true,
                relation: [idObj.navSelectId, idObj.filterId],
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
                                    value: idObj.navSelectId,
                                    defaultValue: ''
                                },
                                condition: {
                                    value: idObj.filterId,
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
                                    value: idObj.navSelectId,
                                    defaultValue: ''
                                }
                            },
                            body: {}
                        }
                    }
                ],
                id: idObj.tableId
            }
        }
    },
    mounted () {
        this.navSelectDefine = navSelectDefine
        this.filterDefine = filterDefine
        this.tableDefine = tableDefine

        this.$set(this.navSelectDefine.dataLink[0].link, 'url', this.navDataUrl)
        this.$set(this.filterDefine.dataLink[0].link, 'url', this.filterDataUrl)
        this.$set(this.tableDefine.dataLink[0].link, 'url', this.tableDataUrl)
        this.$set(this.tableDefine.dataLink[1].link, 'url', this.tableDefineUrl)
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
        }
    }
}
</script>
<style scoped>
.nav-select{
    margin-bottom: 10px;
}
</style>