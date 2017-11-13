
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
                    <mSection :define="sectionDefine"></mSection>
                </Row>
                <Row>
                    <!--table一览部分-->
                    <!--<tableF-Shim></tableF-Shim>-->
                </Row>
            </div>
        </Col>
    </div>
</template>

<script>
    const urlList = {
        treeUrl: '/api/tree/node-list',
        sectionDefineUrl: '',
        sectionContentUrl: '',
        tableDefineUrl: '',
        tableDataUrl: ''
    }

    const ids = {
        treeId: 'treeId',
        sectionId: 'sectionId',
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

                sectionDefine: {
                    isRelated: true,
                    relation: [ids.treeId],
                    dataLink: [
                        {
                            attr: 'sectionDefine',
                            link: {
                                method: 'GET',
                                url: urlList.sectionDefineUrl,
                                pathParams: {},
                                queryParams: {
                                    id: {
                                        value: ids.treeId,
                                        defaultValue: ''
                                    }
                                },
                                body: {}
                            }
                        }
                    ],
                    id: ids.sectionId,
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
