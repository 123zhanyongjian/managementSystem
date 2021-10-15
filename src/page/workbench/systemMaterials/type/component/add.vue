<template>
  <div>
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
    <icon :icon-show.sync="iconShow" />
  </div>
</template>
<script>
import icon from './icon.vue'
export default {
  name: 'Add',
  components: { icon },
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
      rules: {},
      iconShow: false,

      column1: [
        {

          content: [
            {
              label: '所属上级',
              type: 'label_cascader',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'parentId',
              props: {
                checkStrictly: true,
                label: 'name',
                value: 'id'
              },
              options: [
                {
                  name: '顶部',
                  id: '0'
                }
              ]
            },
            {
              label: '菜单名称',
              type: 'label_input',
              options: [],
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'name'
            },
            {
              label: '组件路径',
              type: 'label_input',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'component'
            },
            {
              label: '类型',
              type: 'label_select',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              options: [
                {
                  label: '页面',
                  value: 1
                }, {
                  label: '按钮',
                  value: 2
                }, {
                  label: '目录',
                  value: 3
                }
              ],
              prop: 'type'
            },
            {
              label: '权限标识',
              type: 'label_input',
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'value'
            },
            {
              label: '显示排序',
              type: 'label_input_number',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'sort'
            },
            {
              label: '图标',
              type: 'label_input',
              disabled: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'icon',
              handleClick: () => {
                this.iconShow = true
              }
            }
            // {
            //   label: '国家',
            //   type: 'label_select',
            //   disabled: false,
            //   xl: 12,
            //   lg: 12,
            //   md: 12,
            //   sm: 12,
            //   prop: 'countryCode',
            //   options: [],
            //   change: true
            // },
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
    this.column1[0].content[0].options = this.column1[0].content[0].options.concat(this.treeData)
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
      this.$bus.saveBtnLoading = true
      this.$emit('save', this.formData)
    }
  }
}
</script>
