<template>
    <div>
        <Card>
            <Table
                :data="data"
                :columns="columns"
            >
            </Table>
        </Card>
    </div>
</template>
<script>
    import { getData, dispatch } from 'utils/actionUtils'
    import { replace } from 'utils/request-addon'
    import _ from 'lodash'
    export default {
        name: 'n-list',
        props: {
            define: {
                required: true
            }
        },
        data() {
            return {
                data: [],
                columns: []                
            }
        },
        mounted() {
            let { cols , businessKey, detailUrl } = this.define
            this.columns = this.handleColumns(cols, businessKey, detailUrl)
            let { dataUrl } = this.define
            getData(dataUrl, (data) => {
                this.data = data
            })
        },
        methods: {
            handleColumns(metaList, businessKey, detailUrl) {
                let columns = []
                metaList.forEach((meta) => {
                    let column = {}
                    column.title = meta.caption
                    column.key = meta.key
                    let { type, key } = meta
                    if( key === businessKey) {
                        column.render = ( h, { row }) => {
                            return h('a', {
                                on: {
                                    click() {
                                        let urlBak = _.cloneDeep(detailUrl)
                                        urlBak.pathParams = {
                                            ...urlBak.pathParams,
                                            id: row['id']
                                        }
                                        let url = replace(urlBak.url + '/{id}', urlBak.pathParams)
                                        let bak = {
                                            url,
                                            type: 'link'
                                        } 
                                        dispatch(bak)
                                    }
                                },
                            }, row[key]) 
                        }   
                    }
                    switch(type) {
                    case 'string':
                        break
                    case 'select':
                        column.render = (h, {row}) => {
                            let value = row[meta.key]
                            return h('span', meta.options[value])
                        }
                        break
                    default:
                        break
                    }
                    columns.push(column)
                })
                return columns
            }
        }
    }
</script>
<style scoped>

</style>
