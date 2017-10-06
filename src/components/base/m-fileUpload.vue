<template>
  <div>
    <Upload
      ref="upload"
      type="drag"
      multiple
      :action="uploadAddress"
      :with-credentials="needCred"
      :format="format"
      :max-size="maxSize"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleExceedSize"
    >
      <div class="upload-content">
        <Icon type="ios-cloud-upload" size="52" style="color:#3399ff;"></Icon>
        <p>点击或将文件拖拽到这里上传</p>
      </div>
    </Upload>
    <div v-if="hasError" class="item-error">{{errorMessage}}</div>
  </div>
</template>
<script>
  import bus from '../../router/bus'
  import _ from 'lodash'

  export default {
    name: 'm-fileUpload',
    props: ['define', 'content'],
    data () {
      return {
        uploadList: [],
        hasError: false,
        errorMessage: ''
      }
    },
    computed: {
      // 必须要有
      uploadAddress () {
        return _.get(this.define, 'address', '//jsonplaceholder.typicode.com/posts/')
      },
      needCred () {
        return _.get(this.define, 'needCred', false)
      },
      required () {
        return _.get(this.define, 'required', false)
      },
      format () {
        return _.get(this.define, 'format', [])
      },
      maxSize () {
        return _.get(this.define, 'maxSize', 1024 * 1024)
      },
//      指定文件的最大数量
      maxNumber () {
        return _.get(this.define, 'maxNumber', 10)
      },
      name () {
        return _.get(this.define, 'name', 'm-fileUpload')
      },
      uid () {
        return _.get(this.define, 'ui_id', 'm-fileUpload?' + Date.now())
      },
      readonly () {
        let readonly = _.get(this.$store.state.pageStatus.status, this.name, 'readonly')
        let regex = /^readonly$/i
        return regex.test(readonly) || readonly === true
      },
      'exContent': function () {
        return _.get(this.define, 'exContent', {})
      },
      storeValue: {
        get () {
          return _.get(this.$store.state.pageData.data, this.name, [])
        },
        set (value) {
//                this.$store.commit('updateItem', {name: this.name, value: value})
          this.$store.commit('updateItem', {name: this.name, exContent: this.exContent, value: value})
        }
      }
    },
    mounted () {
      this.uploadList = this.storeValue
      this.$refs.upload.fileList = this.uploadList
      let file = {
        name: '2.pic.jpg',
        percentage: 100,
        showProgress: false,
        status: 'finished'
      }
      this.uploadList.push(file)
      bus.$on('forceValid', () => {
        this.valid()
      })
    },
    methods: {
      handleBeforeUpload (files) {
        // let flag = this.readonly
        let flag = false
        if (flag) {
          this.$Message.warning('暂时无法上传文件')
          return false
        } else {
          let check = this.uploadList.length < this.maxNumber
          if (!check) {
            // 超过限制文件数目时的处理
            this.$Message.error(`选择文件过多, 最多只能上传${this.maxNumber}个文件`)
            return false
          }
          return true
        }
      },
      handleSucces (response, file, fileList) {
        // 上传成功时的处理
        this.$Message.success('上传成功!')
      },
      handleError (error, file, fileList) {
        // 上传失败时的处理
        this.$Message.error('上传失败，请稍后重试!')
        console.log('error:' + error)
      },
      handleRemove (file, fileList) {
        this.$Message.info('删除成功!')
      },
      handleFormatError (file, fileList) {
        // 文件验证失败时的处理
        this.$Message.error(`文件格式不对, 请选择以${this.format.join('、')}结尾的文件`)
      },
      handleExceedSize (file, fileList) {
        // 文件超出限制大小时的处理
        this.$Message.error(`文件过大，请重新选择，文件最大为${Math.floor(this.maxSize / 1024)}M`)
      },
      valid () {
//        if (true) {
        this.hasError = false
        if (this.uploadList.length === 0) {
          this.hasError = true
          this.errorMessage = '请至少上传一份文件'
        }
        this.$store.dispatch('reportValid', {'id': this.uid, 'result': !this.hasError})
//        }
      }
    }
  }
</script>
<style scoped>
  .upload-content {
    padding: 10px 0;
  }

  div.item-error {
    font-size: small;
    color: red;
  }
</style>
