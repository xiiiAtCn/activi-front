<template>
    <div class="wrap">
        <!--操作列表-->
        <Table :columns="columns" :data="data" :border="tableBorder"></Table>
        <transition name="slide-fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                documentTitle: '工作流程',
                urls: {
                    // 获取 columns
                    getColumns: '/api/workflow/view/getColumns',
                    // 获取 data
                    getData: '/api/workflow/view/getData'
                },
                // 默认不显示纵向边框
                tableBorder: false,
                // 详细子路由 name
                detailsRoute: 'workflowDetails',
                // 查看子路由 name
                checkRoute: 'workflowCheck',
                columns: [],
                data: []
            }
        },
        methods: {
            showRouter(row, name) {
                this.$router.push({
                    name: name, params: { rowName: row.name, rowId: row.id }
                });
            },
            getRequest(url, argument, key, returnKey) {
                let reqUrl = `${url}${argument}`
                this.setUrl(reqUrl).forGet(res => {
                    if (returnKey === ''){
                        this[key] = res
                        if (key === 'columns'){
                            for (let i of this[key]){
                                if (i['key'] === 'action'){
                                    i['render'] = (h, params) => {
                                        return h('div', [
                                            h('Button', {
                                                props: {
                                                    type: 'primary',
                                                    size: 'small'
                                                },
                                                on: {
                                                    click: () => {
                                                        this.showRouter(params.row, this.checkRoute)
                                                    }
                                                }
                                            }, '查看')
                                        ]);
                                    }
                                } else if (i['key'] === 'name'){
                                    i['render'] = (h, params) => {
                                        return h('div', [
                                            h('a', {
                                                on: {
                                                    click: () => {
                                                        this.showRouter(params.row, this.detailsRoute)
                                                    }
                                                }
                                            }, params.row.name)
                                        ]);
                                    }
                                }
                            }
                        }
                    } else {
                        this[key] = res[returnKey]
                    }
                })
            }
        },
        mounted(){
            this.getRequest(this.urls.getColumns, '', 'columns','')
            this.getRequest(this.urls.getData, '', 'data', '')
        }
    }
</script>

<style scoped>
    /*外层*/
    .wrap {
        padding: 20px;
        position: relative
    }
    /*路由transition*/
    .slide-fade-enter-active {
        transition: all .6s ease;
    }
    .slide-fade-leave-active {
        transition: all .6s ease;
    }
    .slide-fade-enter, .slide-fade-leave-to{
        transform: translateX(1100px);
        opacity: 0;
    }
</style>
