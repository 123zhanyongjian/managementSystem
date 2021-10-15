<template>
  <div class="systemMaterialAddDialog">
    <el-dialog
      :title="editState===1?$t('编辑'):editState===0?$t('新增'):$t('查看')"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="39.58%"
      top="5vh"
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
        :save-btn-loading="$bus.saveBtnLoading"
        @handleSave="saveFormdata"

        @handleChange="handleChange"
        @handleCancel="handleClose"
      >
        <div slot="form-image">
          <upload
            btn-name="上传"
            :action="uploads.action"
            :slot-flag="false"
            accept=".jpg,.jpeg,.png"
            :parameter="uploads.parameter"
            :disabled="uplpadFlag"
            @handleBefore="handleBefore"
            @handleSuccess="handleSuccess"
          >
            <div
              slot="trigger"
              class="uploadimg"
            >
              <div v-if="uplpadFlag">
                <img

                  :src="materielImg"
                  alt=""
                >
                <img class="close" src="@/page/workbench/userMaterial/img/close.png" @click.stop="uplpadFlag=false;formData.materielImg=''">
              </div>
              <div
                v-else

                class="empty"
              >
                <img
                  src="@/page/workbench/userMaterial/img/upload.png"
                  alt=""
                >
                <p>{{ $t('上传图片') }}</p>
              </div>
            </div>
          </upload>
        </div>
      </my_form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->

    </el-dialog>
    <icon :icon-show.sync="iconShow" />
  </div>
</template>
<script>
import upload from '@/components/common/upload'
import icon from './icon.vue'
export default {
  name: 'Add',
  components: { icon, upload },
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
    var that = this
    // 校验
    const validator = (v, r, callback) => {
      const reg = /^\d+\,\d+$/
      if (!reg.test(r) && r) {
        return callback(new Error(this.$t('请正确输入规定格式，例如1,2')))
      }
      callback()
    }
    return {
      uplpadFlag: false,

      uploads: {
        action: `${process.env.NODE_ENV === 'development' ? '/api' : '/'}exp/file/file/info/upload`, // 接口地址
        parameter: {
          parentId: ''
        }
      },
      rules: {
        materielName: { required: true,
          trigger: 'blur', message: '不可为空' },
        materielType: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, height: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, materielOffset: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, speed: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, isLid: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, isSeal: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, remark: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, capacity: {
          trigger: 'blur',
          validator
        }
      },
      iconShow: false,
      column1: [
        {
          title: '基本信息',
          content: [
            {
              label: '名称',
              type: 'label_input',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'materielName'

            },
            {
              label: '物料类型',
              type: 'label_input',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'materielType'

            },
            {
              label: '容量(行)',
              type: 'label_input',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'm',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '')
              }
            },
            {
              label: '容量(列)',
              type: 'label_input',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'n',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '')
              }
            },
            {
              label: '物料型号',
              type: 'label_input',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'modelName'

            },
            {
              label: '物料高度',
              type: 'label_input',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'height',
              slot: 'append',
              html: 'mm',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '');
              }

            },
            // {
            //   label: '物料容量',
            //   type: 'label_input',
            //   disabled: false,
            //   xl: 12,
            //   lg: 12,
            //   md: 12,
            //   sm: 12,
            //   prop: 'capacity'
            // },

            {
              label: '物料图片',
              type: 'slot',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'image',
              html: 'mm',
              handleInput: function (value) {
                that.formData[this.prop] = value.replace(/[^\d]/g, '')
              }
            }
          ]
        }, {
          title: '其他属性',
          content: [
            {
              label: '物料夹取高度',
              type: 'label_input',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'materielOffset',
              slot: 'append',
              html: 'mm',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '')
              }
            },
            {
              label: '物料运送速度',
              type: 'label_select',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              options: [
                {
                  label: '快',
                  value: '0'
                }, {
                  label: '中',
                  value: '1'
                }, {
                  label: '慢',
                  value: '2'
                }
              ],
              prop: 'speed'
            },
            {
              label: '是否可盖盖子',
              type: 'label_select',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              change: true,
              prop: 'isLid',
              options: [
                {
                  label: '是',
                  value: '1'
                }, {
                  label: '否',
                  value: '0'
                }
              ]
            },
            {
              label: '是否可封膜',
              type: 'label_select',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'isSeal',
              options: [
                {
                  label: '是',
                  value: '1'
                }, {
                  label: '否',
                  value: '0'
                }
              ]
            },
            {
              label: '是否有盖子',
              type: 'label_select',
              disabled: false,
              hide: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'isHaveLid',
              options: [
                {
                  label: '是',
                  value: '1'
                }, {
                  label: '否',
                  value: '0'
                }
              ]
            },
            {
              label: '盖子夹取高度',
              type: 'label_input',
              disabled: false,
              hide: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'lidOffset',
              slot: 'append',
              html: 'mm',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '')
              }
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
              prop: 'remark'
            }

          ]
        }

      ]
    }
  },
  mounted() {
    this.handleChange('isLid', this.formData.isLid)
    //  如果存在图片显示
    if (this.formData.materielImg) {
      this.uplpadFlag = true;
      this.materielImg = `${process.env.NODE_ENV === 'development' ? '/api' : '/'}exp/file/file/info/download?objectName=${this.formData.materielImg}`
    }
    // this.column1[0].content[0].options = this.column1[0].content[0].options.concat(this.treeData)
  },
  methods: {
    handleChange(v, w) {
      if (v === 'isLid') {
        this.column1[1].content.forEach(item => {
          if (item.prop === 'lidOffset' || item.prop === 'isHaveLid') {
            if (w === '1') {
              item.hide = false
            } else {
              item.hide = true
            }
          }
        })
      }
    },
    handleClose() {
      this.$emit('update:formData', {})
      this.$emit('update:addShow', false)
    },
    saveFormdata() {
      this.$emit('initialObj', Object.assign({}, this.formData))
      if (this.editState === 0 && this.formData.id) {
        delete this.formData.id
      }
      // 转数字
      this.formData.isSeal = Number(this.formData.isSeal)
      this.formData.isLid = Number(this.formData.isLid)
      this.formData.speed = Number(this.formData.speed)
      this.formData.isHaveLid = Number(this.formData.isHaveLid)
      this.formData.capacity = `${this.formData.m || ''},${this.formData.n || ''}`
      this.$bus.saveBtnLoading = true
      this.$emit('save', this.formData)
    },
    handleSuccess({ response }) {
      if (response.success) {
        this.formData.materielImg = response.data.objectName // 获取下载资源
        // 获取资源
        this.uplpadFlag = true
        // 显示图片
        this.materielImg = `${process.env.NODE_ENV === 'development' ? '/api' : '/'}exp/file/file/info/download?objectName=${response.data.objectName}`
      }
    },
    handleBefore(v) {
      console.log(v)
    }
  }
}
</script>
<style lang="less" scoped>
.dark{
    .uploadimg{
        background: #4C4C4C !important;
        // border:1px solid rgba(255, 255, 255, .2)
    }
}
.uploadimg {
  width: 140px;
  height: 86px;
  background: #a7a7ab;
  border-radius: 6px;
  position: relative;

  img {
    width: 100%;
    height: 86px;
  }
  .empty {

    > img {
        margin-top: 18px;
      height: 30px;
      width: 30px;
    }
    p {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .close{
      width: 16px;
      height: 16px;
      position: absolute;
      right: 0;

  }
}
</style>
<style lang="less">
.systemMaterialAddDialog{
     .el-form-item__content {
    text-align: left;
  }
    .blockLevel{
    overflow: scroll;
    height: 640px;
    }
  .el-dialog__body{
      padding: 34px 20px 0 42px;
    //   margin-top: 34px;
      .block{
          padding: 0 !important;

      }
      .blockLevel >:nth-child(2){
          margin-top: 41px;
      }

  }
}
.white{
   .systemMaterialAddDialog{
        input {
      background: #fff !important;
    }
 .header{
     color: rgba(0, 0, 0, .8);
     left: -10px !important;
 }
  .el-input-group__append{
    background: transparent;
    border-color: rgba(0, 0, 0, 0);;
 }
}
}
.dark{
   .systemMaterialAddDialog{
 .header{
     color: rgba(255, 255, 255, .8);
     left: -10px !important;

 }
 .el-input-group__append{
    background: #242424;
    border-color: rgba(0, 0, 0, 0);
 }
}
}
</style>
