<template>
  <div class="dataClassAdd">
    <el-dialog
      :title="editState===1?$t('编辑'):editState===0?$t('新建订单'):$t('查看')"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="60.58%"
      :before-close="handleClose"
    >
      <my_form
        :form-data="formData"
        :column="column1"
        :rule="rules"
        :save-btn-visible="true"
        :close-hide="true"
        :is-scroller="true"
        :cancel-btn-visible="false"
        :save-btn-loading="$bus.saveBtnLoading"
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
      default: 0 // 0 新增 1 编辑 2 查看
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
        type: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, typeName: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, isList: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, isOverlap: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }
      },
      iconShow: false,
      column1: [
        {

          content: [
            {
              label: '任务名称',
              type: 'label_input',
              disabled: false,

              xl: 6,
              lg: 6,
              md: 6,
              sm: 6,
              prop: 'typeName'
            },

            // {
            //   label: '是否可堆叠',
            //   type: 'label_select',
            //   disabled: false,
            //   xl: 6,
            //   lg: 6,
            //   md: 6,
            //   sm: 6,
            //   prop: 'isOverlap',
            //   options: [
            //     {
            //       label: '是',
            //       value: '1'
            //     },
            //     {
            //       label: '否',
            //       value: '0'
            //     }
            //   ]
            // },
            {
              label: '预约时间',
              type: 'label_time',
              disabled: false,
              xl: 6,
              lg: 6,
              md: 6,
              sm: 6,
              timeInterval: {
                selectableRange: '13:30:00-15:30:50'
              },
              prop: 'isList'
            },
            {
              label: '选择工艺',
              type: 'label_select',
              disabled: false,
              xl: 6,
              lg: 6,
              md: 6,
              sm: 6,
              options: [
                {
                  label: '是',
                  value: '1'
                },
                {
                  label: '否',
                  value: '0'
                }
              ],
              prop: 'isList'
            },
            {
              label: '备注',
              type: 'label_input',
              options: [],
              disabled: false,
              xl: 6,
              lg: 6,
              md: 6,
              sm: 6,
              prop: 'remark'
            }
          ]
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
      this.$emit('update:addShow', false)
    },
    saveFormdata() {
      this.formData.parentId = Array.isArray(this.formData.parentId) ? this.formData.parentId[this.formData.parentId.length - 1] : this.formData.parentId
      if (this.editState === 0 && this.formData.id) {
        delete this.formData.id
      }
      this.formData.isOverlap = Number(this.formData.isOverlap)
      this.formData.isList = Number(this.formData.isList)
      this.$bus.saveBtnLoading = true
      this.$bus.saveBtnLoading = true
      this.$emit('save', this.formData)
    }
  }
}
</script>
<style lang="less">

     .el-dialog__body {
    padding: 30px 50px 0 50px !important;
}
.white{
.dataClassAdd{

        .el-input__inner{
            background: #fff;
        }
    }
}
</style>
