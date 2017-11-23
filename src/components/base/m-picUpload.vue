<template>
    <div>
        <Row>
            <div class="picture-upload-list" v-for="item in objectModel" :key="item.url">
                <template v-if="item.status === 'finished'">
                    <img :src="item.thumbnailUrl">
                    <div class="picture-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.name, item.previewUrl)"></Icon>
                        <template >
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </div>
            <template >
                <Upload
                    ref="upload"
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
                    class="upload-body">
                    <div class="upload-camera">
                        <Icon type="camera" size="20"></Icon>
                    </div>
                </Upload>
            </template>
            <Modal title="查看图片" v-model="show" :width="640">
                <img :src="imgUrl" v-if="show" style="width: 100%">
            </Modal>
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
                return _.get(this.define, 'uploadAddress', '/api/file/picUpload')
            },
            deleteAddress() {
                return _.get(this.define, 'deleteAddress', '/api/file/picDelete')
            },
            picMaxNumber() {
                return _.get(this.define, 'maxNumber', 5)
            },
            //图片后缀
            format() {
                return _.get(this.define, 'appendix', ['jpg', 'png'])
            },
            //支持上传的文件的最大尺寸(单位为kb)
            maxSize() {
                return _.get(this.define, 'maxSize', 4096)
            }
        },
        watch: {
            reset(val) {
                if(val) {
                    this.$refs.upload.fileList = []
                }
            }
        },
        data () {
            return {
                imgUrl: '',
                show: false
            }
        },
        
        methods: {
            valid() {
                debugger
                if (!this.readonly) {
                    let hasError = false
                    let value = this.objectModel == undefined ? [] : this.objectModel
                    if (this.required) {
                        if (value === '' || value.length === 0) {
                            hasError = true
                            this.errorMessage = '请上传图片'
                        }
                    }
                    this.$store.dispatch(ELEMENT_VALIDATE_RESULT, {[this.name]: hasError, form: this.form})
                }
            },
            handleView (name, url) {
                debugger
                this.show = true
                this.imgUrl = url
            },
            handleBeforeUpload () {
                const check = this.objectModel.length < this.picMaxNumber
                if (!check) {
                    this.$Message.error(`最多只能上传${this.picMaxNumber}张图片`)
                    return false
                } 
                this.objectModel = this.$refs.upload.fileList
            },
            
            handleRemove (file) {
                console.log(file)
                let {originalId, thumbnailId, previewId} = file
                this.setUrl(this.deleteAddress).setQuery({originalId, thumbnailId, previewId}).forGet((result, err) => {
                    debugger
                    if(err) {
                        this.$Message.error(`删除图片${file.name}失败`)
                    } else {
                        this.objectModel.splice(this.objectModel.indexOf(file), 1)
                        this.$Message.success(`图片${file.name}已删除`)
                        this.valid()
                    }
                })
            },
            handleSuccess (res, file) {
                //测试数据
                debugger
                Object.assign(file, {
                    ...file['response']
                })
                this.valid()
                this.$Message.success('上传成功')
            },
            handleError() {
                this.$Message.error('图片上传失败，请稍后重试')
            },
            handleFormatError () {
                this.$Message.error(`图片格式不正确，请上传${this.format.join('、')}格式的图片`)
            },
            handleMaxSize () {
                this.$Message.error(`上传图片过大，图片最大为${Math.floor(this.maxSize / 1024)}M`)
            }
        }
    }
</script>
<style scoped>
    .upload-body {
        display: inline-block;
        width:96px;
    }
    .upload-camera {
        width: 96px;
        height:96px;
        line-height: 96px;
    }
    .picture-upload-list{
        display: inline-block;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .picture-upload-list img{
        width: 100%;
        height: 100%;
    }
    .picture-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .picture-upload-list:hover .picture-upload-list-cover{
        display: block;
    }
    .picture-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    div.item-error {
        font-size: small;
        color: red;
    }
</style>