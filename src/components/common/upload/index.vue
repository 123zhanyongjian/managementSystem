<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    :headers="token"
    :action="action"
    :limit="1"
    :before-upload="handleBefore"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    :on-change="handleChange"
    :show-file-list="false"
    :auto-upload="true"
    :accept="accept"
    :name="name"
    :disabled="disabled"
    :multiple="multiple"
    :data="parameter"
  >
    <!-- 文件上传 选择文件-->
    <el-button v-if="slotFlag" type="primary" icon="el-icon-upload2">{{ $t(btnName) }}</el-button>
    <slot v-else name="trigger" />
  </el-upload>
</template>
<script>
import { getCookies } from '@/utils/auth'
export default {
  props: {
    showoImportDiv: {
      type: Boolean,
      default: true
    },
    slotFlag: {
      type: Boolean,
      default: true
    },
    action: {
      type: String,
      default: '/api/fss-business-bas/basBankManagement/importBankInfo'
    },
    accept: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'file'
    },
    btnName: {
      type: String,
      default: '选取文件'
    },
    fileType: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    parameter: {
      type: Object, // 额为参数
      default: () => {}
    }
  },
  data() {
    return {
      fileList: [],
      token: {
        Authorization: getCookies('TOKEN_6PL_E3')
      }
    }
  },
  methods: {
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的csv文件
      }
    },
    handleRemove(file, fileList) {
      this.fileList = []
    },
    // 文件上传时的钩子
    handlePreview(file) {
      this.$emit('handlePreview', { file })
    },
    // 	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    handleBefore(response, file, fileList) {
      this.$emit('handleBefore', { response, file, fileList })
    },
    // 	文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
      if (!response.success) {
        this.$message.error(response.message)
        return
      }
      this.$emit('handleSuccess', { response, file, fileList })
    },
    // 文件上传失败时的钩子
    handleError(response, file, fileList) {
      this.$refs.upload.clearFiles()
      this.$message.error(response.msg)
      this.$emit('handleError', { response, file, fileList })
      this.fileList = []
    }

  }
}
</script>
<style lang="less" >
.upload-demo{
    display: inline-block;
}
.el-upload-list__item-name{
    // display: none;
}
</style>
