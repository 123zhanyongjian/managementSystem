<template>
  <div class="mechanism">
    <el-dialog
      :title="editState===1?$t('编辑'):editState===0?$t('新增'):$t('查看')"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="39.58%"
      top="5vh"
      :before-close="handleClose"
    >
      <div class="content">
        <my_form
          ref="myForm"
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
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->

    </el-dialog>
    <icon :icon-show.sync="iconShow" />
  </div>
</template>
<script>
import icon from './icon.vue'
import { getProvince, getCity, getArea } from '@/utils/Administrative'
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
        return {
          type: 0
        }
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
      provinceCode: '',
      rules: {
        nameEnus: {
          required: true, message: '不可为空', trigger: 'blur'
        }, parentId: {
          required: true, message: '不可为空', trigger: 'blur'
        }, name: {
          required: true, message: '不可为空', trigger: 'blur'
        }, type: {
          required: true, message: '不可为空', trigger: 'blur'
        }, value: {
          required: true, message: '不可为空', trigger: 'blur'
        }, sort: {
          required: true, message: '不可为空', trigger: 'blur'
        }
      },
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
              label: '机构编码',
              type: 'label_input',
              options: [],
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'code'
            },
            {
              label: '机构名称',
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
              label: '机构层级',
              type: 'label_input',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'dept'
            },
            {
              label: '主要业务',
              type: 'label_input',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'majorBusiness'
            },
            {
              label: '负责人',
              type: 'label_input',
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'owner'
            },
            {
              label: '手机号码',
              type: 'label_input',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'phoneNumber'
            },
            {
              label: '邮箱',
              type: 'label_input',
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'email'
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
            // {
            //   label: '地址',
            //   type: 'label_cascader',
            //   disabled: false,

            //   xl: 12,
            //   lg: 12,
            //   md: 12,
            //   sm: 12,
            //   prop: 'administrative',
            //   ref: 'administratives',
            //   props: {
            //     checkStrictly: true,
            //     label: 'name',
            //     value: 'code',
            //     lazy: true,
            //     lazyLoad: (v, r) => this.getAdministrative(v, r)
            //   },
            //   options: [
            //   ],
            //   handleChange: (val) => {
            //     // 获取选中的label值
            //     const administratives = this.$refs.myForm.$refs.administratives[0].getCheckedNodes()[0].pathLabels
            //     this.formData.provinceCode = administratives[0]
            //     this.formData.cityCode = administratives[1]
            //     this.formData.districtCode = administratives[2]
            //   }
            // },
            // {
            //   label: '详细地址',
            //   type: 'label_input',
            //   disabled: false,
            //   genre: 'textarea',
            //   xl: 24,
            //   lg: 24,
            //   md: 24,
            //   sm: 24,
            //   prop: 'address',
            //   options: [],
            //   change: true
            // },
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
  watch: {
    'formData.type'(v) {
      if (v !== 1) {
        this.column1[0].content[3].disabled = true
        this.$set(this.formData, 'component', '')
        return
      }
      this.column1[0].content[3].disabled = false
    }
  },
  mounted() {
    // 获取省份信息
    this.column1[0].content[0].options = this.column1[0].content[0].options.concat(this.treeData)
    this.column1[0].content[8].options = getProvince()
    if (this.editState === 1) {
      this.$set(this.formData, 'administrative', this.formData.provinceCode + '/' + this.formData.cityCode + '/' + this.formData.districtCode)
    }
  },
  methods: {
    // 加载地址
    getAdministrative(v, resolve) {
      if (v.level === 1) {
        setTimeout(() => {
          this.provinceCode = v.value
          resolve(getCity(v.value))
        }, 500);
      }
      if (v.level === 2) {
        setTimeout(() => {
          getArea(this.provinceCode, v.value).then(re => {
            const arr = re.map(it => ({ ...it, leaf: v.level >= 2 }))
            resolve(arr)
          })
        }, 500);
      }
      if (v.level === 3) {
        resolve([])
      }
    },
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
<style lang="less" >
.mechanism{
     .blockLevel{
    // overflow: scroll;
    height: 540px;
    }
 .el-dialog__body {
    padding: 2.125rem 1.25rem 0 2.625rem;

}
}
</style>
