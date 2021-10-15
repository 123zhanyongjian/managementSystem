<template>
  <div id="common-condition-form" class="con-margin-b" :style="{'padding-right': showCollapse ? '60px' : '10px'}">
    <div class="condition-form" :style="{'max-height': isCollapse ? maxHeight + 'px' : 'none'}">
      <el-form
        ref="form"
        :label-width="labelWidth"
        :model="form"
        :show-message="false"
        size="mini"
        label-position="top"
        @keyup.enter.native="handleEnter"
        @submit.native.prevent
      >
        <el-row :gutter="20">
          <el-col
            v-for="(item,index) in formData"
            :key="`searchForm${index}`"
            :xl="formProperty.xl || item.xl || 4"
            :lg="formProperty.lg || item.lg || 4"
            :md="formProperty.md || item.md || 6"
            :sm="formProperty.sm || item.sm || 6"
            :offset="item.offset || 0"
          >
            <el-form-item
              :label="$t(item.label)"
              :prop="item.prop"
              :required="item.required"
              :style="{'height':`${(item.collapseRows/2 || item.rowSpan || 1) *56}px`}"
            >
              <!-- label_input  复合型input -->
              <el-input
                v-if="item.type === 'label_input'"
                v-model="form[item.prop]"
                :type="item.inputType"
                :class="item.class"
                :disabled="item.disabled"
                :rows="item.collapseRows || 2"
                :placeholder="$t(item.placeholder) || $t('请输入')"
                clearable
                @input="item.handleInput?item.handleInput():''"
                @keyup.enter.native="item.handleKeyup?item.handleKeyup():''"
              >
                <template v-if="item.slotType" :slot="item.slotType">
                  {{ item.Text?item.slotText:'' }}
                  <div v-if="!item.Text" v-html="item.slotText" />
                </template>
                <el-select
                  v-if="item.options"
                  :slot="item.slotType"
                  v-model="item.selectd"
                  :placeholder="item.placeholder || $t('请选择')"
                  :style="`width: ${item.width ? item.width : '100px'}`"
                  @change="item.handleChange ? item.handleChange(item.selectd) : ''"
                >
                  <el-option
                    v-for="o in item.options"
                    :key="o[item.labelVal] || o.value || o.subCode"
                    :value="o[item.labelVal] || o.value || o.subCode"
                    :label="$t(o[item.labelName] || o.label || o.subName)"
                  />
                </el-select>
              </el-input>
              <!-- label_input_number -->
              <el-input-number
                v-if="item.type === 'label_input_number'"
                v-model="form[item.prop]"
                :precision="item.precision"
                :step="item.step"
                :disabled="item.disabled"
                :max="item.max"
                :min="item.min || 0"
                :controls="item.controls"
                :controls-position="item.controlsPosition || 'right'"
                :placeholder="item.placeholder || $t('请输入')"
                @blur="item.handleBlur ? item.handleBlur(item): ''"
              />
              <el-button v-if="item.type==='label_btn'" type="primary" :icon="item.icon" @click="item.handleClick(item)">{{ $t(item.btnName) }}</el-button>
              <!-- label_input_clearable  用于公共组件输入框 -->
              <input-clearable
                v-if="item.type === 'label_input_clearable'"
                v-model="form[item.prop]"
                :disabled="item.disabled"
                @clear="item.handleClear ? item.handleClear() : ''"
                @click="item.handleClick ? item.handleClick(item) : ''"
              />
              <!-- label_select -->
              <el-select
                v-if="item.type === 'label_select'"
                v-model="form[item.prop]"
                :disabled="item.disabled"
                :multiple="item.multiple"
                :placeholder="item.placeholder ? $t(item.placeholder) : $t('请选择')"
                clearable
                @change="item.handleChange ? item.handleChange(form[item.prop]) : ''"
              >
                <el-option
                  v-for="o in item.options"
                  :key="o[item.labelVal] || o.value || o.subCode"
                  :value="o[item.labelVal] || o.value || o.subCode"
                  :label="$t(o[item.labelName] || o.label || o.subName)"
                />
              </el-select>
              <!-- label_date_picker -->
              <el-date-picker
                v-if="item.type === 'label_date_picker'"
                v-model="form[item.prop]"
                :type="item.dateType || 'datetime'"
                :disabled="item.disabled"
                range-separator="~"
                :start-placeholder="$t(item.startPlaceholder || '开始日期')"
                :end-placeholder="$t(item.endPlaceholder || '结束日期')"
                :picker-options="item.pickerOptions"
                :unlink-panels="item.unlinkPanels || true"
                :format="item.formatShow ? item.formatShow : (item.dateType === 'datetime' ||item.dateType === 'datetimerange') ? 'dd-MM-yyyy HH:mm:ss' : 'yyyy-MM-dd'"
                :value-format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
                clearable
              />
              <!-- label_checkbox -->
              <el-checkbox
                v-if="item.type == 'label_checkbox'"
                v-model="form[item.prop]"
                :true-label="item.trueLabel"
                :false-label="item.falseLabel"
                :disabled="item.disabled"
                @change="item.handleChange?item.handleChange():''"
              />
              <span
                v-if="item.type == 'label_checkbox' && item.text"
                style="margin-left:10px"
              >{{ $t(item.text) }}</span>
              <!--
                label_radios 单选按钮组
                label_radio_input 输入框按钮组
                label_radio_date_picker 日期按钮组
                label_radio_input_clearable 弹窗组件按钮组
              -->
              <template
                v-if="item.type === 'label_radios' ||
                  item.type === 'label_radio_date_picker' ||
                  item.type === 'label_radio_input' ||
                  item.type === 'label_radio_input_clearable'"
              >
                <div
                  slot="label"
                  :style="{'margin-top': item.type === 'label_radios' ? '28px' : ''}"
                >
                  <el-radio-group
                    v-model="item.selectType"
                    @change="item.handleChange ? item.handleChange(item) : ''"
                  >
                    <el-radio
                      v-for="o in item.options"
                      :key="o[item.labelVal] || o.value"
                      :label="$t(o[item.labelVal] || o.value)"
                    >
                      {{ $t(o[item.labelName] || o.label) }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <!-- label_radio_date_picker -->
                <el-date-picker
                  v-if="item.type === 'label_radio_date_picker'"
                  v-model="form[item.prop]"
                  :type="item.dateType || 'datetime'"
                  :disabled="item.disabled"
                  range-separator="~"
                  :start-placeholder="$t(item.startPlaceholder || '开始日期')"
                  :end-placeholder="$t(item.endPlaceholder || '结束日期')"
                  :picker-options="item.pickerOptions"
                  :unlink-panels="item.unlinkPanels || true"
                  :format="item.formatShow ? item.formatShow : (item.dateType === 'datetime' ||item.dateType === 'datetimerange') ? 'dd-MM-yyyy HH:mm:ss' : 'dd-MM-yyyy'"
                  :value-format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
                  clearable
                />
                <!-- label_radio_input_clearable 用于公共组件输入框-->
                <input-clearable
                  v-if="item.type === 'label_radio_input_clearable'"
                  v-model="form[item.prop]"
                  :disabled="item.disabled"
                  @clear="item.handleClear ? item.handleClear() : ''"
                  @click="item.handleClick ? item.handleClick() : ''"
                />
                <!-- label_radio_input 复合型input-->
                <el-input
                  v-if="item.type === 'label_radio_input'"
                  v-model="form[item.prop]"
                  :type="item.inputType"
                  :disabled="item.disabled"
                  :rows="item.collapseRows || 2"
                  :placeholder="item.placeholder || $t('请输入')"
                  clearable
                >
                  <template v-if="item.slotType" :slot="item.slotType">
                    {{ item.slotText }}
                  </template>
                  <el-select
                    v-if="item.options"
                    :slot="item.slotType"
                    v-model="item.selectd"
                    :placeholder="item.placeholder || $t('请选择')"
                    :style="`width: ${item.width ? item.width : '100px'}`"
                    @change="item.handleChange ? item.handleChange(item.selectd) : ''"
                  >
                    <el-option
                      v-for="o in item.options"
                      :key="o[item.labelVal] || o.value|| o.subCode"
                      :value="o[item.labelVal] || o.value|| o.subCode"
                      :label="$t(o[item.labelName] || o.label|| o.subName)"
                    />
                  </el-select>
                </el-input>
              </template>
              <!-- 插槽 -->
              <template v-if="item.slot">
                <slot :name="item.type" />
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    formData: {
      type: Array,
      default: function () {
        return []
      }
    },
    formProperty: {
      type: Object,
      default: function () {
        return {}
      }
    },
    labelWidth: {
      type: String,
      default: function () {
        return '100px'
      }
    }
  },
  data() {
    return {
      form: {},
      isCollapse: true,
      showCollapse: false,
      maxHeight: 40
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.form = val
      }
    },
    form: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.getFormHeight()
  },
  methods: {
    // 展开/收起事件
    handleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$emit('handleCollapse', this.isCollapse)
      // 触发页面表格计算高度
      this.$nextTick(() => {
        const _table = this.$parent.$children.find(it => it.$refs['commonTable'])
        if (_table && _table.options) {
          // 获取表格高度
          _table.$data.tableHeight = _table.options.height || this.$Utils.setTableHeight(_table.options.cusHeight)
        }
      })
    },
    getFormHeight() {
      this.$nextTick(() => {
        const formHeight = this.$refs.form.$el.offsetHeight
        if (formHeight > this.maxHeight) {
          this.showCollapse = true
        }
      })
    },
    handleEnter() {
      this.$emit('handleEnter')
    }
  }
}
</script>
<style lang="less" scoped>
#common-condition-form {
  position: relative;
  padding: 5px 0 10px 10px;
//   background-color: #fff;
  .spread {
    position: absolute;
    top: 10px;
    right: 15px;
    color: #005dc0;
    font-size: 14px;
    cursor: pointer;
  }
  .condition-form {
    overflow: hidden;
     /deep/ .el-form-item {
      margin-bottom: 3px;
    }
     /deep/ .el-textarea__inner {
      resize: none!important;
    }
     /deep/ .el-input-number .el-input__inner {
      text-align: left;
    }
  }
}
</style>
