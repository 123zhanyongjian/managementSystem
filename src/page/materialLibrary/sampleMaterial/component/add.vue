<template>
  <div class="sampleMaterialAddDialog">
    <el-dialog
      :title="editState===1?$t('编辑'):editState===0?$t('新增'):$t('添加物料')"
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

  </div>
</template>
<script>
import upload from '@/components/common/upload'
import * as _api from '@/api/materialLibrary/sampleMaterial'
import { list, listMateriel } from '@/api/userMaterial/SystemMaterial'
import * as _api1 from '@/api/SystemMaterial/SystemMaterial'
export default {
  name: 'Add',
  components: { upload },
  props: {
    addShow: {
      type: Boolean,
      default: true
    },
    userId: {
      type: [String, Number],
      default: ''
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
    type: {
      type: [Number, String],
      default: 0 // 0 样品材料 1 我的物料类 2 系统物料类
    },
    regioncountryList: {
      type: Array, // 国家列表
      default: function () {
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
      uploads: {
        action: `${process.env.NODE_ENV === 'development' ? '/api' : '/'}exp/file/file/info/upload`, // 接口地址
        parameter: {
          parentId: ''
        }
      },

      uplpadFlag: false,
      rules: {
        status: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        materielClass: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },

        materielType: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        height: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        materielOffset: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        speed: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        isLid: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        isSeal: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        remark: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        materielName: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }, ids: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        capacity: {
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
              label: '物料名称',
              type: 'label_input',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'materielName'
            },
            {
              label: '物料类',
              type: 'label_select',
              disabled: false,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              labelVal: 'id',
              labelName: 'materielName',
              options: [],
              change: true,
              prop: 'ids'
            },
            {
              label: '物料类型',
              type: 'label_input',
              disabled: true,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'materielType'
            },
            {
              label: '物料型号',
              type: 'label_input',
              disabled: true,

              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'modelName'
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
              label: '容量(行)',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '');
              },
              type: 'label_input',
              disabled: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'm'
            },
            {
              label: '容量(列)',
              type: 'label_input',
              disabled: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'n',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '');
              }
            },

            {
              label: '物料高度',
              type: 'label_input',
              disabled: true,
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
            {
              label: '状态',
              type: 'label_select',
              disabled: false,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'status',
              options: [
                {
                  label: '入库',
                  value: '1'
                },
                {
                  label: '在途',
                  value: '2'
                },
                {
                  label: '使用中',
                  value: '3'
                }
              ],
              handleChange: (v) => {
                if (v === '1') {
                  this.column1[0].content.forEach(item => {
                    if (item.prop === 'locations' || item.prop === 'posture') {
                      item.hide = false
                    }
                  })
                } else {
                  this.column1[0].content.forEach(item => {
                    if (item.prop === 'locations' || item.prop === 'posture') {
                      item.hide = true
                    }
                  })
                }
              }
            },
            {
              label: '物料位置',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '');
              },
              type: 'label_select',
              disabled: false,
              hide: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              options: [

              ],
              prop: 'locations',
              handleChange: function(value) {
                // 将选中的值传出去
                that.formData.location = this.options.find(item => item.value === value).label
              }
            }, {
              label: '姿态',
              handleChange: function(value) {
                console.log(value)
              },
              type: 'label_input',
              disabled: false,
              hide: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'posture'
            },
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
                that.formData[this.prop] = value.replace(/[^\d.]/g, '')
              }
            }
          ]
        },
        {
          title: '其他属性',
          content: [
            {
              label: '物料夹取高度',
              type: 'label_input',
              disabled: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'materielOffset',
              slot: 'append',
              html: 'mm',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '');
              }
            },
            {
              label: '物料运送速度',
              type: 'label_select',
              disabled: true,
              genre: 'number',
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              options: [
                {
                  label: '快',
                  value: '0'
                },
                {
                  label: '中',
                  value: '1'
                },
                {
                  label: '慢',
                  value: '2'
                }
              ],
              prop: 'speed'
            },
            {
              label: '是否可盖盖子',
              type: 'label_select',
              disabled: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'isLid',
              change: true,
              options: [
                {
                  label: '是',
                  value: '1'
                },
                {
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
                },
                {
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
              disabled: true,
              hide: true,
              xl: 12,
              lg: 12,
              md: 12,
              sm: 12,
              prop: 'lidOffset',
              slot: 'append',
              html: 'mm',
              handleInput: function(value) {
                that.formData[this.prop] = value.replace(/[^\d.]/g, '');
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
    console.log(this.formData)
    this.handleChange('isLid', this.formData.isLid)
    //  如果存在图片显示
    if (this.formData.materielImg) {
      this.uplpadFlag = true;
      this.materielImg = `${process.env.NODE_ENV === 'development' ? '/api' : '/'}exp/file/file/info/download?objectName=${this.formData.materielImg}`
    }
    this.getList()
    this.getLocation()
  },
  methods: {
    // 通过我的物料类 系统物料类返回的值进行操作，主要把物料名称置空转为物料类
    transformation() {
      if (this.editState !== 0 && this.editState !== 1) {
        this.formData.materielName = '';
      }
    },
    getLocation() {
      // 获取位置接口
      _api.location({ userId: this.userId })
        .then(res => {
          this.column1[0].content.forEach(item => {
            if (item.prop === 'locations') {
              item.options = res.data.map(item => ({ label: item.positionName, value: item.positionId }))
            }
          })
          // 判断状态
          if (this.editState !== 0) {
            if (this.formData.status === '1') {
              this.column1[0].content.forEach(item => {
                if (item.prop === 'locations' || item.prop === 'posture') {
                  item.hide = false;
                  console.log(item)
                  if (item.prop === 'locations' && this.formData.location) {
                    this.formData.locations = item.options.find(ite => ite.label === this.formData.location).value
                  }
                }
              })
            } else {
              this.column1[0].content.forEach(item => {
                if (item.prop === 'locations' || item.prop === 'posture') {
                  item.hide = true
                }
              })
            }
          }
        })
    },
    // 这一块分为工作台我的物料类或系统物料类还是样品材料自己打开时不同的执行内容
    getList() {
      if (this.editState === 1 || this.editState === 0) {
        // 样品材料自己
        listMateriel({ userId: this.userId })
          .then(res => {
            this.column1[0].content[1].options = res.data.map(v => ({ ...v, id: v.materielName }));
          })
        if (this.editState === 0) {
          this.$set(this.formData, 'ids', null)
        }
      } else {
        // 我的 系统 添加样品材料
        if (this.type === 2) {
          _api1.list({ userId: this.userId })
            .then(res => {
              this.column1[0].content[1].options = res.data;
              if (this.formData.materielName) {
                const { id } = this.column1[0].content[1].options.find(v => v.materielName === this.formData.materielName)
                // this.formData.ids = id;
                this.$set(this.formData, 'ids', id)
                this.transformation()
                //  是否可盖盖判断

                this.column1[1].content.forEach(item => {
                  if (item.prop === 'lidOffset' || item.prop === 'isHaveLid') {
                    if (this.formData.isLid === '1') {
                      item.hide = false
                    } else {
                      item.hide = true
                    }
                  }
                })
              }
            })
          return
        }
        list({ userId: this.userId })
          .then(res => {
            this.column1[0].content[1].options = res.data;
            if (this.formData.materielName) {
              const { id } = this.column1[0].content[1].options.find(v => v.materielName === this.formData.materielName)
              // this.formData.ids = id;
              this.$set(this.formData, 'ids', id)
              this.transformation()
              //  是否可盖盖判断
              this.column1[1].content.forEach(item => {
                if (item.prop === 'lidOffset' || item.prop === 'isHaveLid') {
                  if (this.formData.isLid === '1') {
                    item.hide = false
                  } else {
                    item.hide = true
                  }
                }
              })
            }
          })
      }
    },
    handleChange(v, w) {
      if (v === 'ids') {
        // 每次选择清空原来的数据
        this.materielImg = ''
        this.uplpadFlag = false
        if (!w) {
          Object.keys(this.formData).forEach(item => {
            this.formData[item] = ''
          })
          return
        }

        // 把后台返回的数据进行处理，否则下拉框无法识别
        const obj = Object.assign({}, this.column1[0].content[1].options.find(v => v.id === w))
        obj.isSeal = String(obj.isSeal)
        obj.isLid = String(obj.isLid)
        obj.speed = String(obj.speed)
        obj.isHaveLid = obj.isHaveLid ? String(obj.isHaveLid) : ''
        // 物料类字段需要修改
        obj.materielClass = obj.materielName;
        const [m, n] = obj.capacity ? obj.capacity.split(',') : []
        this.$set(obj, 'm', m)
        this.$set(obj, 'n', n)
        //  如果存在图片显示
        if (obj.materielImg) {
          this.uplpadFlag = true;
          this.materielImg = `${process.env.NODE_ENV === 'development' ? '/api' : '/'}exp/file/file/info/download?objectName=${obj.materielImg}`
        }
        this.$set(obj, 'ids', obj.id)
        delete obj.id
        delete obj.materielName
        // 下拉不需改变的对象属性
        const { status, materielName, id, remark, posture, locations } = this.formData

        this.$emit('changeFromData', { ...obj, status, materielName, id, remark, posture, locations })

        this.column1[1].content.forEach(item => {
          if (item.prop === 'lidOffset' || item.prop === 'isHaveLid') {
            if (obj.isLid === '1') {
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
    },
    saveFormdata() {
      this.$emit('initialObj', Object.assign({}, this.formData))
      if (this.editState === 0) {
        delete this.formData.id
      }
      // 转数字
      this.formData.isSeal = Number(this.formData.isSeal)
      this.formData.isLid = Number(this.formData.isLid)
      this.formData.speed = Number(this.formData.speed)
      this.formData.isHaveLid = Number(this.formData.isHaveLid)
      this.formData.capacity = `${this.formData.m || ''},${this.formData.n || ''}`
      this.$bus.saveBtnLoading = true
      console.log(this.$bus.saveBtnLoading)
      //   this.$set(thi,'.$bus.saveBtnLoading','true')
      this.$emit('save', this.formData)
    }

  }
}
</script>
<style lang="less">
.sampleMaterialAddDialog {
        .el-form-item__content {
    text-align: left;
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
    .blockLevel{
    overflow: scroll;
    height: 640px;
    }
  .el-dialog__body {
    padding: 34px 20px 0 42px;
    // margin-top: 34px;
    .block {
      padding: 0 !important;
    }
    .blockLevel > :nth-child(2) {
      margin-top: 41px;
    }
  }
}
.white {
  .sampleMaterialAddDialog {
    input {
      background: #fff !important;
    }
    .header {
      color: rgba(0, 0, 0, 0.8);
      left: -10px !important;
    }
    .el-input-group__append {
      background: transparent;
      border-color: rgba(0, 0, 0, 0);
    }
  }
}
.dark {
  .sampleMaterialAddDialog {
        .uploadimg{
        background: #4C4C4C !important;
        // border:1px solid rgba(255, 255, 255, .2)
    }
    .header {
      color: rgba(255, 255, 255, 0.8);
      left: -10px !important;
    }
    .el-input-group__append {
      background: #242424;
      border-color: rgba(0, 0, 0, 0);
    }

  }
}
</style>
