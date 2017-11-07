<template>
  <div>
    <div class="demo-upload-list" v-for="item in uploadList">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
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
      :with-credentials="needCred"
      :format="format"
      :max-size="maxSize"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      multiple
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
    <div v-if="hasError" class="item-error">{{errorMessage}}</div>
  </div>
</template>
<script>
  import bus from '../../router/bus'
  import * as _ from 'lodash'

  export default {
      data () {
          return {
              imgName: '',
              imgUrl: '',
              visible: false,
              uploadList: [],
              hasError: false,
              errorMessage: ''
          }
      },
      computed: {
          uploadAddress () {
              return _.get(this.define, 'uploadAddress', 'upload')
          },
          format () {
              return _.get(this.define, 'format', ['jpg', 'jpeg', 'png'])
          },
          readonly () {
              let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly').trim()
              let regex = /^readonly$/i
              return regex.test(readonly) || readonly === true
          },
          needCred () {
              return _.get(this.define, 'needCred', false)
          },
          required () {
              return _.get(this.define, 'required', false)
          },
          maxNumber () {
              return _.get(this.define, 'maxNumber', 10)
          },
          maxSize () {
              return _.get(this.define, 'maxSize', 1024 * 1024)
          },
          name () {
              return _.get(this.define, 'name', 'm-picUpload?' + Date.now())
          },
          uid () {
              return _.get(this.define, 'ui_id', '')
          },
          storeValue: {
              get () {
                  return _.get(this.$store.state.pageData.data, this.name, [])
              },
              set (value) {
                  this.$store.commit('updateItem', {name: this.name, value: value})
              }
          }
      },
      mounted () {
          this.uploadList = this.storeValue
          this.$refs.upload.fileList = this.uploadList
          bus.$on('forceValid', () => {
              this.valid()
          })
      },
      methods: {
          handleView (name, url) {
              this.imgName = name
              this.visible = true
              this.imgUrl = url
          },
          handleBeforeUpload () {
        // let flag = this.readonly
        // 测试
              let flag = false
              if (flag) {
                  this.$Message.warning('暂时无法上传照片')
                  return false
              } else {
                  const check = this.uploadList.length < this.maxNumber
                  if (!check) {
                      this.$Message.error(`最多只能上传${this.maxNumber}张图片`)
                  }
                  return check
              }
          },
          handleRemove (file) {
              console.log('file is ', file)
        // 从 upload 实例删除数据
              this.uploadList.splice(this.uploadList.indexOf(file), 1)
              this.$Message.success(`图片${file.name}已删除`)
          },
          handleSuccess (res, file, fileList) {
        // 测试数据
              let temp = {}
              temp.name = '7eb99afb9d5f317c912f08b5212fd69a'
              temp.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/large'
              temp.status = 'finished'
              temp.percentage = 100
              this.uploadList.push(temp)
              this.$Message.success('上传成功')
          },
          handleError () {
              this.handleSuccess()
              this.$Message.error('上传失败，请稍后重试')
          },
          handleFormatError (file) {
              this.$Message.error(`文件格式不正确，请上传${this.format.join('、')}格式的文件`)
          },
          handleMaxSize (file) {
              this.$Message.error(`上传图片过大，文件最大为${Math.floor(this.maxSize / 1024)}M`)
          },
          valid () {
              if (!this.readonly) {
                  this.hasError = false
                  if (this.required && this.uploadList.length === 0) {
                      this.hasError = true
                      this.errorMessage = '请至少上传一张图片'
                  }
                  this.$store.dispatch('reportValid', {'id': this.uid, 'result': !this.hasError})
              }
          }
      }
  }
</script>
<style scoped>
  .upload-body {
    display: inline-block;
    width: 58px;
  }

  .upload-camera {
    width: 58px;
    height: 58px;
    line-height: 58px;
  }

  .demo-upload-list {
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
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
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
