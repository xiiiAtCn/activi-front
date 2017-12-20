<template>
    <div>
        <component :is="type" :define="define" :content="content"></component>
    </div>
</template> 
<script> 
    import _ from 'lodash'
    export default {
        props: {
            type: {
                type: String,
                default: 'mRow'
            },
            define: {
                type: Object,
                default () {
                    return {
                        gutter: 10
                    }
                }
            },
            content: {
                type: Array,
                default () {
                    return [
                        {
                            ui_define: {
                                col: 2
                            },
                            ui_id: 'ae_fgl80k',
                            ui_content: [
                                {
                                    ui_id: 'akf_lu9jf',
                                    ui_type: 'mLabel',
                                    ui_define: {
                                        label: '数据测试'
                                    }
                                }
                            ]
                        },
                        {
                            ui_define: {
                                col: 10
                            },
                            ui_id: 'aaf42d_9',
                            ui_content: [
                                {
                                    ui_id: 'adf_kju',
                                    ui_type: 'mInput',
                                    ui_define: {

                                    }
                                }
                            ]
                        },
                        {
                            ui_define: {
                                col: 2
                            },
                            ui_id: 'ae_fgo80k',
                            ui_content: [
                                {
                                    ui_id: 'akf_lupjf',
                                    ui_type: 'mLabel',
                                    ui_define: {
                                        label: '生产地址'
                                    }
                                }
                            ]
                        },
                        {
                            ui_define: {
                                col: 10
                            },
                            ui_id: 'aaf42g_9',
                            ui_content: [
                                {
                                    ui_id: 'adf_klu',
                                    ui_type: 'mInput',
                                    ui_define: {

                                    }
                                }
                            ]
                        },
                        {
                            ui_define: {
                                col: 2
                            },
                            ui_id: 'ae_fgl80k',
                            ui_content: [
                                {
                                    ui_id: 'akf_lu9jf',
                                    ui_type: 'mLabel',
                                    ui_define: {
                                        label: '数据测试'
                                    }
                                }
                            ]
                        },
                        {
                            ui_define: {
                                col: 10
                            },
                            ui_id: 'aaf42d_9',
                            ui_content: [
                                {
                                    ui_id: 'adf_kju',
                                    ui_type: 'mInput',
                                    ui_define: {

                                    }
                                }
                            ]
                        },
                        {
                            ui_define: {
                                col: 2
                            },
                            ui_id: 'ae_fgo80k',
                            ui_content: [
                                {
                                    ui_id: 'akf_lupjf',
                                    ui_type: 'mLabel',
                                    ui_define: {
                                        label: '生产地址'
                                    }
                                }
                            ]
                        },
                        {
                            ui_define: {
                                col: 10
                            },
                            ui_id: 'aaf42g_9',
                            ui_content: [
                                {
                                    ui_id: 'adf_klu',
                                    ui_type: 'mInput',
                                    ui_define: {

                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        computed: {
            form () {
                return _.get(this.define, 'form', 'form')
            }
        }
    }
</script>