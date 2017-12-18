<template>
    <div>
        <Row>
            <template v-if="!readonly">
                <Upload
                    ref="upload"
                    :data="data"
                    :multiple="true"
                    :show-upload-list="false"
                    :before-upload="handleBeforeUpload"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :max-size="maxSize"
                    :format="format"
                    type="drag"
                    :action="uploadAddress"
                    class="upload-body"
                >
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                </Upload>
            </template>
            <template v-else>
                <div class="upload-body upload-body-readonly">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                </div>
            </template>
            <div v-for="item in objectModel" :key="item.url">
                <template v-if="item.status === 'finished'">
                    <div class="file-item">
                        <Icon type="document-text"></Icon>
                        <span>{{item.name}}</span>
                        <template >
                            <div class="file-delete-action" v-if="!readonly">
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                    </div>
                </template>
                <template v-else>
                    {{item.name}}
                    <Progress :percent="parseInt(item.percentage)" :stroke-width="5" ></Progress>
                </template>
            </div>
        </Row>
        <Row>
            <div v-if="hasError" class="gateway-item-error">{{errorMessage}}</div>
            <div v-else class="occupation gateway-item-error">隐藏</div>
        </Row>
    </div>
</template>
<script>
    import _ from 'lodash'
    import mixin from './mixin'
    import { ELEMENT_VALIDATE_RESULT } from 'store/Action'
    export default {
        name:'m-picture-upload',
        mixins: [mixin],
        props:{
            define: {
                type: Object,
                default() {
                    return {
                    }
                }
            }
        },
        computed: {
            uploadAddress() {
                return _.get(this.define, 'uploadAddress', '/api/file/fileUpload')
            },
            deleteAddress() {
                return _.get(this.define, 'deleteAddress', '/api/file/fileDelete')
            },
            picMaxNumber() {
                return _.get(this.define, 'maxNumber', 5)
            },
            //文件后缀
            format() {
                return _.get(this.define, 'appendix', [])
            },
            //支持上传的文件的最大尺寸(单位为kb)
            maxSize() {
                return _.get(this.define, 'maxSize', 10240)
            }
        },
        watch: {
            reset(val) {
                if(val) {
                    this.$refs.upload.fileList = []
                }
            }
        },
        data() {
            return {
                data: {
                }
            }
        },
        methods: {
            valid() {
                let formFix = this.ui_form?this.ui_form: this.form
                if (!this.readonly) {
                    let hasError = false
                    let value = this.objectModel == undefined ? [] : this.objectModel
                    if (this.required) {
                        if (value === '' || value.length === 0) {
                            hasError = true
                            this.errorMessage = '请上传图片'
                        }
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: formFix})
                }
                this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: formFix})
            },
            handleBeforeUpload (file) {
                const check = this.objectModel.length < this.picMaxNumber
                if (!check) {
                    this.$Message.error(`最多只能上传${this.picMaxNumber}份文件`)
                    return false
                }
                this.data['filename'] = `${encodeURI(file.name)}`
                this.objectModel = this.$refs.upload.fileList
            },
            handleRemove (file) {
                console.log(file)
                let id = file.id
                console.log( '请求路径为 ', this.deleteAddress + '?id=' + id)
                this.setUrl(this.deleteAddress).setQuery({picId: id}).forGet((result, err) => {
                    if(err) {
                        this.$Message.error(`删除文件${file.name}失败`)
                    } else {
                        const fileList = this.$refs.upload.fileList.slice()
                        fileList.splice(fileList.indexOf(file), 1)
                        this.$refs.upload.fileList = fileList
                        this.objectModel = this.$refs.upload.fileList
                        this.$Message.success(`文件${file.name}已删除`)
                        this.valid()
                    }
                })
            },
            handleSuccess (res, file) {
                file['url'] = file['response']['url']
                file['id'] = file['response']['id']
                this.$Message.success('上传成功')
            },
            handleError() {
                this.$Message.error('上传失败，请稍后重试')
            },
            handleFormatError () {
                this.$Message.error(`文件格式不正确，请上传${this.format.join('、')}格式的文件`)
            },
            handleMaxSize () {
                this.$Message.error(`上传文件过大，文件最大为${Math.floor(this.maxSize / 1024)}M`)
            }
        }
    }
</script>
<style scoped>
    .file-upload-list{
        display: inline-block;
        width: 60px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }

    .file-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .file-upload-list:hover .file-upload-list-cover{
        display: block;
    }

    .file-item {
        font-size:16px;
        border-radius: 5px;
        padding: 0 5px;
    }

    .file-item:hover {
        background: rgba(0,0,0,.1);
    }

    .file-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .file-delete-action {
        float: right;
        cursor: pointer;
    }

    .upload-body {
        display: inline-block;
        width:200px;
    }

    .upload-body-readonly {
        line-height: 100%;
        border-radius: 5px;
        cursor: not-allowed;
        border: 1px dashed #dddee1;
        text-align: center;
    }

    div.item-error {
        font-size: small;
        color: red;
    }

</style>