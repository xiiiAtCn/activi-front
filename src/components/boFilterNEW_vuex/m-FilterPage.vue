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

const urlList = {
    navDataUrl: '/api/filter/getSelect/{topMap}/{trackerClsId}',
    filterDataUrl: '/api/filter/getFilter',
    tableDataUrl: '/api/bo/list',
    tableDefineUrl: '/api/bo/simpleListDefine'
}

const reqCountFlag = {
    add: 'add',
    del: 'del'
}

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
                url: urlList.navDataUrl,
                pathParams: {
                    topMap: {
                        defaultValue: ''
                    },
                    trackerClsId: {
                        defaultValue: ''
                    } 
                },
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
                            url: urlList.filterDataUrl,
                            pathParams: {

                            },
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
                            url: urlList.tableDataUrl,
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
                            url: urlList.tableDefineUrl,
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
        this.$set(this.navSelectDefine.dataLink[0].link.pathParams.topMap, 'defaultValue', this.topMap)
        this.$set(this.navSelectDefine.dataLink[0].link.pathParams.trackerClsId, 'defaultValue', this.trackerClsId)
    },
    computed: {
        topMap () {
            return _.get(this.define, 'topMap', '')
        },
        trackerClsId () {
            return _.get(this.define, 'trackerClsId', '')
        }
    }
}
</script>
<style scoped>
.nav-select{
    margin-bottom: 10px;
}
</style>