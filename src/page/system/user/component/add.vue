<template>
  <div class="userAdd">
    <el-dialog
      :title="editState===1?$t('编辑'):editState===0?$t('新增'):$t('重置密码')"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="39.58%"
      top="7vh"
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
import * as _api from '@/api/system/role'
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
        return {
          roleIds: []
        }
      }
    },
    checkArray: {
      type: Array,
      default: () => []
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
      checkList: [],
      data: [],
      roleIds: [],
      rules: {

        password: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }

      },
      rules1: {
        roleIds: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        nickName: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, userName: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, phoneNumber: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, status: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        password: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }

      },
      iconShow: false,
      column: [

        {
          content: [
            {
              label: '用户登录密码',
              type: 'label_input',
              disabled: false,
              genre: 'password',
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'password'
            }]
        }

      ],
      column1: [
        {

          content: [
            {
              label: '姓名',
              type: 'label_input',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'nickName'
            },
            {
              label: '用户名',
              type: 'label_input',
              options: [],
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'userName'
            },
            {
              label: '密码',
              type: 'label_input',
              options: [],
              disabled: false,
              genre: 'password',
              hide: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'password'
            },
            { label: '角色分配',
              type: 'label_select',
              hide: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'roleIds',
              options: []
            },
            // {
            //   label: '职位',
            //   type: 'label_input',
            //   options: [],
            //   disabled: false,
            //   xl:12,
            //   lg:12,
            //   md:12,
            //   sm:12,
            //   prop: 'code'
            // },
            {
              label: '状态',
              type: 'label_radio_group',
              class: 'group',
              options: [
                {
                  label: '正常',
                  value: 2
                },
                {
                  label: '禁用',
                  value: 4
                }
              ],
              disabled: false,
              xl: 24,
              lg: 24,
              md: 24,
              sm: 24,
              prop: 'status',
              tipClass: 'tipClassGroup',
              tip: '正常状态的员工帐户允许登录系统，禁用状态的员工帐户不能登录系统'
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
    this.getData(1, 1000)
    this.checkList = this.checkArray
    if (this.editState === 1) {
      delete this.rules.password
      this.column1[0].content.forEach(item => {
        if (item.prop === 'password') {
          item.hide = true
        }
        if (item.prop === 'userName') {
          item.disabled = true
        }
      })
    }
  },
  methods: {
    handleChange(v, w) {
      console.log(v, w)
    },
    getData(pageNumber, pageSize) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize
      }
      _api.page(obj)
        .then(res => {
          this.column1[0].content.forEach(item => {
            if (item.prop === 'roleIds') {
              item.options = res.data.map(ite => ({ value: ite.id, label: ite.name }))
            }
          })
        //   this.tableOptions.loading = false
        })
    },
    change(v) {
      // 单选
      this.checkList = [v[v.length - 1]]
      this.formData.roleIds = this.checkList
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
.userAdd{
    .el-dialog__body{
     overflow: hidden;
    }

    .group{
        .el-radio__label{
            margin-right: 66px;
        }
    }
.el-form-item__content{
    text-align: left;
}
.tipClassGroup{
    opacity: .4;
    margin-top: 13px;

}
}
.dark{
    .userAdd{
  .tipClassGroup{
    color: #fff;

}}
}
.white{
    .userAdd{
         input{
          background: #fff !important;
      }
    }
}
</style>
