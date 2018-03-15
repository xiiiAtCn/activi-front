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
            <div v-for="item in objectModel" :key="item.url" >
                <template v-if="item.status === 'finished'">
                    <div class="file-item">
                        <Row>
                            <Col span="18">
                                <Icon type="document-text"></Icon>
                                <span>{{item.name}}</span>
                            </Col>
                            <Col span="6" style="min-width: 100px;">
                                <template >
                                    <div class="file-action" v-if="!readonly">
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                    <div class="file-action" >
                                        <a :href="item.url" :download="item.name">
                                            <Icon type="arrow-down-a"></Icon>
                                        </a>
                                    </div>
                                    <div class="file-action" v-show="isSupport(item)" >
                                        <Icon type="eye" style="color: rgb(92, 107, 119);" @click.native="editFile(item)"></Icon>
                                    </div>
                                </template>
                            </Col>
                        </Row>
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
        <mLayer v-model="showModal" @on-close="clearEditor">
            <div :id="id">
            </div>
        </mLayer>
    </div>
</template>
<script>
    import _ from 'lodash'
    import mixin from './mixin'
    import { ELEMENT_VALIDATE_RESULT } from 'store/Action'
    import DocsAPI from 'DocsAPI'
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
                showModal: false,
                data: {

                },
                id: '',
                docEditor: null,
                textTypes: new Set(['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 
                    'htm', 'html', 'mht', 'odt', 'pdf', 'rtf', 'txt', 'djvu', 'xps']),
                sheetTypes: new Set(['csv', 'fods', 'ods', 'xls', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx']),
                presentationTypes: new Set(['fodp', 'odp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx'])
            }
        },
        mounted() {
            this.id = 'editContainer' + this._uid
        },
        methods: {
            isSupport(item) {
                let type = item.id.substring(item.id.lastIndexOf('.') + 1).toLowerCase()
                //can only support these file types. more information: https://api.onlyoffice.com/editors/config/
                if(this.textTypes.has(type) 
                    || this.sheetTypes.has(type) 
                    || this.presentationTypes.has(type)) {
                    return true
                }
                return false
            },
            editFile(item) {
                if(DocsAPI === null || DocsAPI === undefined) {
                    this.$Message.error('预览插件加载失败, 请稍后重试')
                    return
                }
                this.showModal = true
                if(this.objectModel.length > 1 || this.docEditor === null) {
                    const id = item.id
                    const key = id.substring(id.lastIndexOf('/') + 1, id.lastIndexOf('.')).substring(0, 20)
                    const url = item.url.replace('/', '\/')
                    const fileType = id.substring(id.lastIndexOf('.') + 1)
                    let documentType = 'text'
                    if(this.sheetTypes.has(fileType)) {
                        documentType = 'spreadsheet'
                    } else if(this.presentationTypes.has(fileType)) {
                        documentType = 'presentation'
                    }
                    this.docEditor = new DocsAPI.DocEditor(this.id, {
                        //document setting. more information: https://api.onlyoffice.com/editors/config/
                        document: {
                            fileType: fileType,
                            key: key,
                            title: item.name,
                            url: url,
                            permissions: {
                                comment: false,
                                edit: false,
                                review: false,
                                print: false,
                                download: false
                            }
                        },
                        documentType: documentType
                    })
                }
            },
            clearEditor() {
                if(this.objectModel.length > 1) {
                    this.docEditor.destroyEditor()
                    this.docEditor = null
                }
            },
            valid() {
                if (!this.readonly) {
                    let hasError = false
                    let value = this.objectModel == undefined ? [] : this.objectModel
                    if (this.required) {
                        if (value === '' || value.length === 0) {
                            hasError = true
                            this.errorMessage = '请上传文件'
                        }
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.fixForm})
                } else {
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: false, form: this.fixForm})
                }
            },
            handleBeforeUpload (file) {
                const check = this.objectModel.length < this.picMaxNumber
                if (!check) {
                    this.$Message.error(`最多只能上传${this.picMaxNumber}份文件`)
                    return false
                }
                this.data['filename'] = `${encodeURI(file.name)}`
                this.objectModel = this.objectModel || []
                this.$refs.upload.fileList = this.objectModel
            },
            handleRemove (file) {
                console.log(file)
                let id = file.id
                this.$Modal.confirm({
                    content: '确认删除?',
                    onOk: () => {
                        this.setUrl(this.deleteAddress).setQuery({id: id}).forGet((result, err) => {
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
                    }
                })
                console.log( '请求路径为 ', this.deleteAddress + '?id=' + id)
            },
            handleSuccess (res, file) {
                file['url'] = file['response']['url']
                file['id'] = file['response']['id']
                this.valid()
                this.$Message.success('上传成功')
                this.objectModel = this.$refs.upload.fileList
                if(this.docEditor !== null) {
                    this.docEditor.destroyEditor()
                    this.docEditor = null
                }
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

    .file-action {
        float: right;
        cursor: pointer;
        margin-right: 5px;
        margin-left: 5px;
    }

    .file-action:hover {
        font-size: 1.8em;
        transition: all .1s ease-in-out;
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