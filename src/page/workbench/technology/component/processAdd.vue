<template>
  <div class="processAdd">
    <el-dialog
      :title="editState===1?$t('重命名'):editState===0?$t('新增工艺集'):$t('重置密码')"
      :visible.sync="processAddShow"
      :close-on-click-modal="false"
      custom-class="miniMessage"
      top="30vh"
      :before-close="handleClose"
    >
      <my_form
        :form-data="formData"
        :column="column"
        :rule="rules1"
        :save-btn-visible="true"
        :close-hide="true"
        :is-scroller="true"
        :cancel-btn-visible="false"
        label-width="100px"
        :save-btn-loading="$bus.saveBtnLoading"
        @handleSave="saveFormdata"
        @handleChange="handleChange"
        @handleCancel="handleClose"
      />
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->

    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'Add',

  props: {
    processAddShow: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    treeData: {
      type: Array,
      default: function() {
        return []
      }
    },
    editState: {
      type: [Number, String],
      default: 0 // 0 新增 1 编辑 2 重置密码
    },
    regioncountryList: {
      type: Array, // 国家列表
      default: function() {
        return []
      }
    }
  },
  data() {
    return {

      rules: {

        password: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }

      },
      rules1: {

        name: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }

      },
      iconShow: false,
      column: [

        {
          content: [
            {
            //   label: '工艺名称',
              type: 'label_input',
              disabled: false,
              genre: 'text',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'name'
            }]
        }

      ]
    }
  },
  mounted() {

  },
  methods: {
    handleChange(v, w) {
      console.log(v, w)
    },
    handleClose() {
      this.$emit('update:processAddShow', false)
    },
    saveFormdata() {
      if (this.editState === 0 && this.formData.id) {
        delete this.formData.id
      }
      this.formData.nodeType = 1
      this.$bus.saveBtnLoading = true
      this.$emit('save', this.formData)
    }
  }
}
</script>
<style lang='less'>
.processAdd{
     .el-dialog__body {
    padding: 30px 110px 0 110px !important;
}
}
</style>
