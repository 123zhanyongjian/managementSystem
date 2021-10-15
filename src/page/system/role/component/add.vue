<template>
  <div class="roleAdd">
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
        label-width="100px"
        @handleSave="saveFormdata"
        @handleCancel="handleClose"
        @handleChange="handleChange"
      />
      <!-- <el-tree
        ref="tree"
        class="treeClass"
        :data="data"
        show-checkbox
        node-key="id"
        :props="{label:'name'}"
        :default-expanded-keys="checkArray"
        :default-checked-keys="checkArray"
      /> -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->

    </el-dialog>
  </div>
</template>
<script>
import * as _api from '@/api/system/resource'
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
    checkArray: {
      type: Array,
      default: () => []
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
      data: [],
      currentNodeKey: [],
      rules: {

        name: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, code: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, remark: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }

      },
      iconShow: false,
      column1: [
        {

          content: [
            {
              label: '角色名称',
              type: 'label_input',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'name'
            },
            {
              label: '角色编码',
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
              label: '角色描述',
              type: 'label_input',
              disabled: false,
              genre: 'textarea',
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'remark'
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
    this.getData(1, 100)
  },
  methods: {
    getData(pageNumber, pageSize) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        parentId: '0'
      }
      _api.tree(obj).then((res) => {
        this.data = res.data
        res.data
          .map((ite) => ite.id)
          .map((item, index) => {
            for (const i in this.checkArray) {
              if (this.checkArray[i] === item) {
                this.checkArray.splice(i, 1)
              }
            }
          })
        //   this.tableOptions.loading = false
      })
    },
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
      this.$bus.saveBtnLoading = true
      this.$emit('save', this.formData)
    }
  }
}
</script>
<style lang="less">
.white{
.roleAdd{

        input{
            background: #fff !important;
        }
    }
}
</style>

