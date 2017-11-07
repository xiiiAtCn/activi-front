<template>
    <div class="layout">
        <Col span="4">
            <div class="leftMenu">
                <!--节点树部分-->
                <mBoTree :define="treeDefine"></mBoTree>
            </div>
        </Col>
        <Col span="20">
            <div class="rightContent">
                <Row>
                    <!--section部分-->
                    <!--<mSection></mSection>-->
                    <!--table一览部分-->
                    <tableF-Shim></tableF-Shim>
                </Row>
            </div>
        </Col>
    </div>
</template>

<script>
    const urlList = {
        treeUrl: '/api/tree/node-list',
        tableDefineUrl: '',
        tableDataUrl: ''
    }

    const ids = {
        treeId: 'treeId',
        tableId: 'tableId'
    }

    export default{
        data () {
            return {

                treeDefine: {
                    isRelated: true,
                    relation: [ids.treeId],
                    dataLink: [
                        {
                            attr: 'treeData',
                            link: {
                                method: 'GET',
                                url: urlList.treeUrl,
                                pathParams: {},
                                queryParams: {
                                    id: {
                                        value: ids.treeId,
                                        defaultValue: null
                                    }
                                },
                                body: {}
                            }
                        }
                    ],
                    id: ids.treeId
                },

                tableDefine: {
                    isRelated: true,
                    relation: [ids.treeId],
                    dataLink: [
                        {
                            attr: 'tableDefine',
                            link: {
                                method: 'GET',
                                url: urlList.tableDefineUrl,
                                pathParams: {},
                                queryParams: {
                                    id: {
                                        value: ids.tableId,
                                        defaultValue: ''
                                    }
                                },
                                body: {}
                            }
                        },
                        {
                            attr: 'tableData',
                            link: {
                                method: 'POST',
                                url: urlList.tableDataUrl,
                                pathParams: {},
                                queryParams: {},
                                body: {
                                    id: {
                                        value: ids.tableId,
                                        defaultValue: ''
                                    },
                                    condition: {
                                        value: ids.tableId,
                                        defaultValue: {}
                                    }
                                }
                            }
                        }
                    ],
                    id: ids.tableId
                }

            }
        },
        methods: {

        },
        mounted () {

        }
    }
</script>

<style scoped>
    /*外层*/
    .layout{
        padding: 20px 24px;
    }
</style>
