<template>
    <div>
        <div class="picture-upload-list" v-for="item in uploadList" :key="item.url">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="picture-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name, item.url)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
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
        <Modal title="查看图片" v-model="visible">
            <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import _ from 'lodash'
    export default {
        name:'m-picture-upload',
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
                return _.get(this.define, 'uploadAddress', '')
            },
            deleteAddress() {
                return _.get(this.define, 'deleteAddress', '')
            },
            picMaxNumber() {
                return _.get(this.define, 'maxNumber', 1)
            },
            //图片后缀
            format() {
                return _.get(this.define, 'appendix', ['jpg'])
            },
            //支持上传的文件的最大尺寸(单位为kb)
            maxSize() {
                return _.get(this.define, 'maxSize', 1024)
            }
        },
        data () {
            return {
                imgUrl: '',
                visible: false,
                uploadList: [],
                hasError:false,
            }
        },
        methods: {
            handleView (name, url) {
                this.visible = true
                this.imgUrl = url
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < this.picNumber
                if (!check) {
                    this.$Message.error(`最多只能上传${this.picNumber}张图片`)
                    return check
                } 
            },
            handleRemove (file) {
                console.log(file)
                let id = file.id
                if (this.deleteUrl === '') {
                    // 从 upload 实例删除数据
                    this.uploadList.splice(this.uploadList.indexOf(file), 1)
                    this.$Message.success(`图片${file.name}已删除`)
                    this.$emit('input', this.uploadList)
                }else {
                    console.log( '请求路径为 ', this.deleteUrl + '?picId=' + id)
                    this.$http.get(this.deleteUrl + '?picId=' + id)
                        .then((res) => res.body)
                        .then((flag) => {
                            if(flag) {
                                this.uploadList.splice(this.uploadList.indexOf(file), 1)
                                this.$Message.success(`图片${file.name}已删除`)
                                this.$emit('input', this.uploadList)
                            } else {
                                this.$Message.error(`图片${file.name}删除失败`)
                            }
                        }).catch(() => {
                            this.$Message.error('服务器出错了')
                        })
                }
            },
            handleSuccess (res, file) {
                //测试数据
                file['url'] = file['response']['url']
                file['id'] = file['response']['id']
                this.$Message.success('上传成功')
                this.$emit('input', this.uploadList)
            },
            handleError() {
                this.$Message.error('上传失败，请稍后重试')
            },
            handleFormatError () {
                this.$Message.error(`文件格式不正确，请上传${this.format.join('、')}格式的文件`)
            },
            handleMaxSize () {
                this.$Message.error(`上传图片过大，文件最大为${Math.floor(this.maxSize / 1024)}M`)
            }
        }
    }
</script>
<style scoped>
    .upload-body {
        display: inline-block;
        width:58px;
    }
    .upload-camera {
        width: 58px;
        height:58px;
        line-height: 58px;
    }
    .picture-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
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