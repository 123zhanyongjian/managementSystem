<template>
  <div class="materialLibraryDataAddDialog">
    <el-dialog
      :title="editState===1?$t('编辑'):editState===0?$t('新增'):$t('查看')"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="39.58%"
      :before-close="handleClose"
    >
      <my_form
        :form-data="formData"
        :column="column1"
        :rule="rules"
        :save-btn-visible="true"
        :close-hide="true"
        :is-scroller="true"
        :save-btn-loading="$bus.saveBtnLoading"
        :cancel-btn-visible="false"
        label-width="100px"
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
    addShow: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    },
    editState: {
      type: [Number, String],
      default: 0 // 0 新增 1 编辑 2 查看
    },
    typeList: {
      type: Array, // 国家列表
      default: function () {
        return []
      }
    }
  },
  data() {
    return {

      rules: {
        name: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        objectValue: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        dataTypeId: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }
      },
      iconShow: false,
      column1: [
        {
        //   title: '基本信息',
          content: [
            {
              label: '数据名称',
              type: 'label_input',
              disabled: false,

              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'name'
            },
            {
              label: '数据类',
              type: 'label_select',
              disabled: false,

              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'dataTypeId',
              options: [
                {
                  label: 'int',
                  value: 1
                },
                {
                  label: 'string',
                  value: 2
                },
                {
                  label: 'float',
                  value: 3
                },
                {
                  label: 'logical',
                  value: 3
                }
              ]
            },
            {
              label: '数据值',
              type: 'label_input',
              genre: 'number',
              disabled: false,
              //   genre: 'textarea',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'objectValue'
            },
            {
              label: '纬度',
              type: 'label_input',
              genre: 'number',
              disabled: false,
              //   genre: 'textarea',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'wd'
            },
            {
              label: 'size',
              type: 'label_select',
              genre: 'number',
              disabled: false,
              //   genre: 'textarea',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'size',
              options: [
                {
                  label: '0°',
                  value: 1
                }, {
                  label: '90°',
                  value: 2
                }, {
                  label: '180°',
                  value: 3
                }, {
                  label: '270°',
                  value: 4
                }
              ]
            }

          ]
        }

      ]
    }
  },
  mounted() {
    this.column1[0].content[1].options = this.typeList
    // this.column1[0].content[0].options = this.column1[0].content[0].options.concat(this.treeData)
  },
  methods: {
    handleChange(v, w) {
      console.log(v, w)
    },
    handleClose() {
      this.$emit('update:formData', {})
      this.$emit('update:addShow', false)
    },
    saveFormdata() {
      if (this.editState === 0 && this.formData.id) {
        delete this.formData.id
      }
      this.$bus.saveBtnLoading = true
      this.$bus.saveBtnLoading = true
      this.$emit('save', this.formData)
    }
  }
}
</script>
<style lang="less">
.materialLibraryDataAddDialog {
  .el-dialog__body {
    // padding: 34px 34px 0 42px;
    // margin-top: 34px;
    .block {
      padding: 0 !important;
    }
    .blockLevel > :nth-child(2) {
    //   margin-top: 41px;
    }
  }
}
.white {
  .materialLibraryDataAddDialog {
    input {
      background: #fff !important;
    }
    .header {
      color: rgba(0, 0, 0, 0.8);
      left: -10px !important;
    }
    .el-input-group__append {
      background: transparent;
      // border-color: #15DCC6;
    }
  }
}
.dark {
  .materialLibraryDataAddDialog {
    .header {
      color: rgba(255, 255, 255, 0.8);
      left: -10px !important;
    }
    .el-input-group__append {
      background: transparent;
      border-color: rgba(0,0,0,0);
    }
    .el-input-group__append:active{
        border-color: #15DCC6;
    }
  }
}
</style>
