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
    navDataUrl: '/api/filter/getSelect',
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
    filterId: 'filterId'
}

export default{
    data () {
        return {
            navSelectDefine: {                                
                isRelated: true,
                relation: [{key: 'id', id: idObj.navSelectId, default: ''}],
                dataLink: [
                    {
                        attr: 'selectData',
                        link: {
                            method: 'GET',
                            url: urlList.navDataUrl,
                            params: {},
                            body: {}
                        }
                    }
                ],
                id: idObj.navSelectId,
            },

            filterDefine: {
                isRelated: true,
                relation: [{key: 'id', id: idObj.navSelectId, default: ''}],
                dataLink: [
                    {
                        attr: 'bodyData',
                        link: {
                            method: 'GET',
                            url: urlList.filterDataUrl,
                            params: {},
                            body: {}
                        }
                    }
                ],
                id: idObj.filterId,
            },

            tableDefine: {
                isRelated: true,
                relation: [
                    {key: 'id', id: idObj.navSelectId, default: ''},
                    {key: 'condition', id: idObj.filterId, default: {}}
                ],
                dataLink: [
                    {
                        attr: 'tableData', 
                        link: {
                            method: 'POST',
                            url: urlList.tableDataUrl,
                            params: {},
                            body: {}
                        }
                    },
                    {
                        attr: 'tableDefine', 
                        link: {
                            method: 'GET',
                            url: urlList.tableDefineUrl,
                            params: {},
                            body: {}
                        }
                    }
                ],
                id: idObj.filterId,
            }
        }
    }
}
</script>
<style scoped>
.nav-select{
    margin-bottom: 10px;
}
</style>