<template>
    <div>
        <!-- select部分 -->
        <Row class="nav-select">
            <mNavSelect
                :relation="navSelectDefine"
                :form="form"
                :firstSelect="selectFirst"
                :addComponent="addComponent"/>
        </Row>
        <!-- filter部分 -->
        <mBoFilter
            :relation="filterDefine"
            :form="form"
            :addComponent="addComponent"/>
        <!-- table一览部分 -->
        <tableF-Shim
            :relation="tableDefine"
            :form="form"
            :addComponent="addComponent"/>
    </div>
</template>
<script>
import _ from 'lodash'
import { deepCopy } from 'utils/utils'

let navSelectDefine = {
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
} 

let filterDefine = {
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
}

let tableDefine = {
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

export default{
    props: {
        define: {
            type: Object
        },
        form: {
            type: String,
            default: 'ceshi'
        }
    },
    data () {
        let self = this
        return {
            // navSelectDefine: {},
            // filterDefine: {},
            // tableDefine: {}
            selectFirst: false,
            ready: 0,
            addComponent() {
                self.ready++
                if(self.ready === 3){
                    self.selectFirst = true
                }
            }
        }
    },
    computed: {
        navSelectDefine () {
            return _.get(this.define, 'navSelectRelation', {})
        },
        filterDefine () {
            return _.get(this.define, 'filterRelation', {})
        },
        tableDefine () {
            return _.get(this.define, 'tableRelation', {})
        }
    },
    method: {
    }
}
</script>
<style scoped>
.nav-select{
    margin-bottom: 10px;
}
</style>