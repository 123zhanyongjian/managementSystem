<template>
  <div>
    <el-dialog
      :title="editState===1?$t('编辑'):editState===0?$t('新增'):$t('重置密码')"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="39.58%"
      :before-close="handleClose"
    >
      <my_form
        :form-data="formData"
        :column="editState!==2?column1:column"
        :rule="editState!==2?rules1:rules"
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

        name: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        configInfo: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }

      },
      rules1: {

        name: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        configInfo: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }

      },
      iconShow: false,
      column: [

        {
          content: [
            {
              label: '工艺名称',
              type: 'label_input',
              disabled: false,
              genre: 'password',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'password'
            }]
        }

      ],
      column1: [
        {

          content: [
            {
              label: '工艺名称',
              type: 'label_input',
              disabled: false,

              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'name',
              tip: '请输入2-16位中英文或者数字，不区分大小写'
            },
            {
              label: '平台配置',
              type: 'label_select',
              disabled: false,

              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              options: [
                { label: '测试',
                  value: '测试' },
                { label: '3测试',
                  value: '3测试' }
              ],
              prop: 'configInfo'
            },
            {
              label: '描述',
              type: 'label_input',
              disabled: false,
              genre: 'textarea',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'remark',
              options: [],
              change: true
            }
            // {
            //   label: '省市区',
            //   type: 'label_select',
            //   disabled: false,
            //   placeholder: '选择',
            //   prop: 'ssq',
            //   pid: '',
            //   xl: 12,
            //   lg: 12,
            //   md: 12,
            //   sm: 12,
            //   partyOrganIds: [],
            //   checkStrictly: true,
            //   changeAreaTree: (r) => {
            //     this.$set(this.formData, 'cityNameEn', r.citysEn)
            //     this.$set(this.formData, 'districtNameEn', r.areasEn)
            //     this.$set(this.formData, 'provinceNameEn', r.provincesEn)
            //     this.$set(this.formData, 'cityNameZh', r.citys)
            //     this.$set(this.formData, 'districtNameZh', r.areas)
            //     this.$set(this.formData, 'provinceNameZh', r.provinces)
            //     this.$set(this.formData, 'provinceCode', r.value[0])
            //     this.$set(this.formData, 'cityCode', r.value[1])
            //     this.$set(this.formData, 'districtCode', r.value[2])
            //   }
            // },
            // {
            //   label: '备注',
            //   type: 'label_input',
            //   disabled: false,
            //   xl: 12,
            //   lg: 12,
            //   md: 12,
            //   sm: 12,
            //   prop: 'remark'
            // }
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
      if (this.editState === 0 && this.formData.id) {
        delete this.formData.id
      }
      this.formData.nodeType = 0
      this.$bus.saveBtnLoading = true
      this.$emit('save', this.formData)
    }
  }
}
</script>
