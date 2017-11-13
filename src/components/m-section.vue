<template>
    <div class="ivu-form ivu-form-label-right">
        <transition-group name="fade" mode="out-in">
            <component :key="item.ui_id" :is="item.ui_type" v-for="item in tempContent" :define="item.ui_define"
                       :content="item.ui_content"></component>
        </transition-group>
    </div>
</template>
<script>
    import mixin from './mixin'
    export default {
        mixins: [mixin],
        props: ['content', 'define'],
        data: function () {
            return {
                tempContent: this.content
            }
        },
        methods: {
            getSectionDefine () {
                this.getData('sectionDefine', (data, err) => {
                    if (data) {
//                        store.dispatch("clearData", {})
//                        let url = data.ui_define.dateUrl.url;
//                        store.dispatch("putData", {'url': url})
                        this.tempContent = data.ui_content
                    } else {
                        // 待删
                        this.tempContent =  [
                            {
                                "ui_id": "K^266[",
                                "ui_content": [
                                    {
                                        "ui_id": "?G3^Ik",
                                        "ui_content": [
                                            {
                                                "ui_id": "T?Ik]F",
                                                "ui_define": {
                                                    "label": "名称",
                                                    "hidden": false,
                                                    "labelWidth": 120,
                                                    "uiObject": {
                                                        "ui_id": "col_2",
                                                        "ui_define": {
                                                            "name": "FName",
                                                            "title": "名称",
                                                            "fieldId": "vendor_header_2"
                                                        },
                                                        "ui_type": "mInput"
                                                    }
                                                },
                                                "ui_type": "m-labelInput"
                                            }
                                        ],
                                        "ui_define": {
                                            "offset": 0,
                                            "col": 12
                                        },
                                        "ui_type": "m-column"
                                    },
                                    {
                                        "ui_id": "[qmG^4",
                                        "ui_content": [
                                            {
                                                "ui_id": "T?Ik]F",
                                                "ui_define": {
                                                    "label": "编码",
                                                    "hidden": false,
                                                    "labelWidth": 120,
                                                    "uiObject": {
                                                        "ui_id": "col_2",
                                                        "ui_define": {
                                                            "name": "FName",
                                                            "title": "编码",
                                                            "fieldId": "vendor_header_2"
                                                        },
                                                        "ui_type": "mInput"
                                                    }
                                                },
                                                "ui_type": "m-labelInput"
                                            }
                                        ],
                                        "ui_define": {
                                            "offset": 0,
                                            "col": 12
                                        },
                                        "ui_type": "m-column"
                                    }
                                ],
                                "ui_define": null,
                                "ui_type": "m-row"
                            }
                        ]
                    }
                })
            },
//            watchValuesChanged () {
//                this.getSectionDefine()
//            }
        },
        mounted () {
            console.log('mSection work')
            this.getSectionDefine()
        }
    }
</script>
