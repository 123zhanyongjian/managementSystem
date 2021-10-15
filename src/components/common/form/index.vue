<template>
  <div id="my_form">
    <el-form
      ref="form"
      v-loading="loading"
      v-bind="$attrs"
      :label-position="options.labelPosition"
      :label-width="options.labelWidth"
      :model="formData"
      :rules="langRule"
      :disabled="disabled"
      size="mini"
      v-on="$listeners"
    >
      <div>
        <div
          id="style-6"
          :class="{'form-scroller':options.isScroller}"
          class="blockLevel"
          :style="{'height': options.isScroller ? options.scrollHeight : '', maxHeight: options.isScroller ? (options.scrollMaxHeight || 'calc(100vh - 295px)') : ''}"
        >
          <div v-for="(block,index) in columns" :key="index" class="block" :class="{'border': block.title}">
            <h3 v-if="block.title" class="header">{{ $t(`${block.title}`) }}  </h3>

            <div class="right-btn"><slot :name="block.controlBtn" /></div>
            <div><slot :name="block.controlBtns" /></div>
            <el-row v-if="block.content" :class="[`tab${block.id}`]" class=" animate__animated" :gutter="block.gutter||20">
              <template
                v-for="(item,key) in block.content"
              >
                <el-col
                  v-if="!item.hide"
                  :key="key"
                  :style="item.style?item.style:'margin-bottom:10px'"
                  :xl="item.xl || options.xl || 6"
                  :lg="item.lg || options.lg || 8"
                  :md="item.md || options.md || 8"
                  :sm="item.sm || options.sm || 12"
                >
                  <el-form-item
                    :ref="item.prop"
                    :label="item.label ? $t(`${item.label}`) : ''"
                    :prop="item.prop"
                    :rules="item.rules"
                    :required="item.required"
                    :class="item.class?item.class:''"
                    :style="{height: item.height || formItemHeight}"
                  >
                    <!-- input -->
                    <el-input
                      v-if="item.type == 'label_input'&&!item.hide"
                      v-model="formData[item.prop]"
                      clearable
                      :maxlength="item.maxlength"
                      :type="item.genre?item.genre:'text'"
                      :disabled="block.disabled || item.disabled"
                      :placeholder="item.placeholder ? $t(`${item.placeholder}`):$t('请输入')"
                      :readonly="item.readonly"
                      :show-word-limit="item.showWordLimit"
                      :rows="item.rows ? item.rows : 2"
                      :autosize="item.autosize ? item.autosize : false"
                      @keyup.enter.native="item.genre!=='textarea'?handleSave():''"
                      @input="item.handleInput?item.handleInput(formData[item.prop]):''"
                      @blur="item.blur ? handleBlur(item.prop): ''"
                      @clear="item.clear ? handleClear(item.prop):''"
                      @click.native="item.handleClick?item.handleClick(item.prop):''"
                    >
                      <template :slot="item.slot">{{ item.html }}</template>
                    </el-input>

                    <el-input
                      v-if="item.type == 'label_iptSelect'"
                      v-model="formData[item.prop]"
                      clearable
                      :disabled="item.disabled"
                      :maxlength="item.maxlength"
                      class="input-with-select"
                      :class="item.handleClick ? 'sz' : ''"
                      :type="item.genre ? item.genre : 'text'"
                      :placeholder="
                        item.placeholder
                          ? $t(`${item.placeholder}`)
                          : $t('请输入')
                      "
                      :suffix-icon="item.iconClass"
                      :readonly="item.readonly"
                      :show-word-limit="item.showWordLimit"
                      :rows="item.rows ? item.rows : 2"
                      @change="
                        item.handleChange ? item.handleChange($event) : ''
                      "
                      @blur="item.blur ? item.blur(item.prop) : ''"
                      @clear="item.clear ? item.clear(item.prop) : ''"
                      @click.native="
                        item.handleClick ? item.handleClick(item.prop) : ''
                      "
                    >
                      <template slot="prepend">
                        {{ item.selectValue }}
                      </template>
                    </el-input>
                    <el-input
                      v-if="item.type == 'label_input_select'"
                      v-model="formData[item.prop]"
                      clearable
                      :maxlength="item.maxlength"
                      :disabled="block.disabled || item.disabled"
                      :placeholder="item.placeholder ? $t(`${item.placeholder}`):$t('请输入')"
                      :readonly="item.readonly"
                      :show-word-limit="item.showWordLimit"
                      @blur="item.blur ? handleBlur(item.prop): ''"
                      @clear="item.clear ? handleClear(item.prop):''"
                    >
                      <el-select slot="prepend" v-model="formData[item.selectProp]" class="prependSel">
                        <el-option
                          v-for="(opt,oindex) in item.options"
                          :key="oindex"
                          :label="$t(`${opt[item['labelName'] || 'label'] || opt['subName']}`)"
                          :value="opt[item['labelVal'] || 'value'] || opt['subCode']"
                        />
                      </el-select>
                    </el-input>
                    <!-- input-clearable -->
                    <input-clearable
                      v-if="item.type === 'label_input_clearable'"
                      v-model="formData[item.prop]"
                      :readonly="item.readonly"
                      :prompt="item.prompt"
                      :disabled="block.disabled || item.disabled"
                      @clear="item.handleClear ? item.handleClear() : ''"
                      @click="(type)=>{item.handleClick && item.handleClick(type)}"
                    />
                    <!-- select -->
                    <el-select
                      v-if="item.type == 'label_select'&&!item.hide"
                      v-model="formData[item.prop]"
                      :disabled="block.disabled || item.disabled"
                      :multiple="item.multiple"
                      clearable
                      :filterable="item.filterable || true"
                      :placeholder="item.placeholder ? $t(`${item.placeholder}`) : $t('请选择')"
                      @change="(item.change ? handleChange(item.prop):'')||item.handleChange?item.handleChange($event):''"
                      @clear="item.clear ? handleClear(item.prop):''"
                    >
                      <el-option
                        v-for="(opt,oindex) in item.options"
                        :key="oindex"
                        :label="$t(`${opt[item['labelName'] || 'label'] || opt['subName']}`)"
                        :value="opt[item['labelVal'] || 'value'] || opt['subCode']"
                      />
                    </el-select>
                    <!-- cascader -->
                    <el-cascader
                      v-if="item.type == 'label_cascader'"
                      :ref="item.ref?item.ref:''"
                      v-model="formData[item.prop]"
                      :disabled="block.disabled || item.disabled"
                      :options="item.options"
                      clearable
                      :props="item.props"
                      @change="item.handleChange?item.handleChange($event):''"
                    >
                      <template slot-scope="{ node, data }">
                        <slot v-if="item.slot" :name="`form-${item.prop}`" :node="node" :data="data" />
                        <span v-else>{{ $t(data[item.props.label]) }}</span>
                      </template>
                    </el-cascader>
                    <el-time-picker
                      v-if="item.type=='label_time'"
                      v-model="formData[item.prop]"
                      :picker-options="item.timeInterval"
                      :placeholder="item.placeholder || $t('请选择')"
                      :disabled="block.disabled || item.disabled"/>
                    <!-- date-picker -->
                    <el-date-picker
                      v-if="item.type == 'label_date_picker'"
                      v-model="formData[item.prop]"
                      :type="item.dateType || 'date'"
                      clearable
                      :picker-options="item.pickerOptions"
                      :placeholder="item.placeholder ? $t(`${item.placeholder}`):$t('请选择')"
                      :disabled="block.disabled || item.disabled"
                      :range-separator="$t('至')"
                      :start-placeholder="$t('开始日期')"
                      :end-placeholder="$t('结束日期')"
                      :format="item.formatShow ? item.formatShow : (item.dateType === 'datetime' ||item.dateType === 'datetimerange') ? 'dd-MM-yyyy HH:mm:ss' : 'dd-MM-yyyy'"
                      :value-format="item.format || 'yyyy-MM-dd'"
                      :default-time="item.dateType==='daterange' && ['00:00:00', '23:59:59']"
                      @change="item.change ? handleChange(item.prop):''"
                    />
                    <!-- input_number -->
                    <el-input-number
                      v-if="item.type == 'label_input_number'"
                      v-model="formData[item.prop]"
                      :precision="item.precision"
                      :step="item.step"
                      :disabled="block.disabled || item.disabled"
                      :max="item.max"
                      :min="item.min || 0"
                      :controls="item.controls"
                      :controls-position="item.controlsPosition || 'right'"
                      :placeholder="item.placeholder ? $t(`${item.placeholder}`):$t('请输入')"
                      @blur="item.blur?handleBlur(item.prop): ''"
                    />
                    <!-- number -->
                    <el-input
                      v-if="item.type == 'label_number'"
                      v-model.number="formData[item.prop]"
                      type="number"
                      :disabled="block.disabled || item.disabled"
                      :placeholder="item.placeholder ? $t(`${item.placeholder}`):$t('请输入')"
                      @blur="item.blur?handleBlur(item.prop): ''"
                      @mousewheel.native.prevent
                    />
                    <!-- checkbox -->
                    <el-checkbox
                      v-if="item.type == 'label_checkbox'"
                      v-model="formData[item.prop]"
                      :true-label="item.trueLabel"
                      :false-label="item.falseLabel"
                      :disabled="block.disabled || item.disabled"
                      @change="item.change ? handleChange(item.prop):''"
                    >
                      <div>{{ item.text ? $t(`${item.text}`) : '' }}</div>
                    </el-checkbox>
                    <!-- checkbox_group -->
                    <el-checkbox-group
                      v-if="item.type === 'label_checkbox_group'"
                      v-model="formData[item.prop]"
                      :disabled="block.disabled || item.disabled"
                      @change="item.change ? handleChange(item.prop):''"
                    >
                      <el-checkbox
                        v-for="(opt,oindex) in item.options"
                        :key="oindex"
                        :label="opt[item['labelVal'] || 'value'] || opt['subCode']"
                      >
                        {{ $t(`${opt[item['labelName'] || 'label'] || opt['subName']}`) }}
                      </el-checkbox>
                    </el-checkbox-group>
                    <!-- switch -->
                    <el-switch
                      v-if="item.type === 'label_switch'"
                      v-model="formData[item.prop]"
                      :active-value="item.activeValue"
                      :inactive-value="item.inactiveValue"
                      :active-text="$t(item.activeText)"
                      :inactive-text="$t(item.inactiveText)"
                      :active-color="item.activeColor"
                      :inactive-color="item.inactiveColor"
                      :disabled="block.disabled || item.disabled"
                      @change="item.change?handleChange(item.prop):''"
                    />
                    <!-- 地区选择 -->
                    <!-- <select-area-tree v-if="item.type =='label_area'" v-model="formData[item.prop]" :country-code="item.pid" :party-organ-ids="item.partyOrganIds" :check-strictly="!item.checkStrictly" @changes="item.changeAreaTree?item.changeAreaTree($event):''" /> -->
                    <!-- radio_group -->
                    <el-radio-group
                      v-if="item.type === 'label_radio_group'"
                      v-model="formData[item.prop]"
                      :class="item.class"
                      :disabled="block.disabled || item.disabled"
                      @change="item.change ? handleChange(item.prop):''"
                    >
                      <el-radio
                        v-for="(opt,oindex) in item.options"
                        :key="oindex"
                        :label="opt[item['labelVal'] || 'value'] || opt['subCode']"
                      >
                        {{ $t(`${opt[item['labelName'] || 'label'] || opt['subName']}`) }}
                      </el-radio>
                    </el-radio-group>
                    <!-- solt -->
                    <!-- 底部需要文字提示 -->
                    <p v-if="item.tip" class="tipClass" :class="item.tipClass">{{ $t(item.tip) }}</p>
                    <template v-if="item.type === 'slot'">

                      <slot :name="'form-' + item.prop" />
                    </template>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
            <!-- 表格 -->
            <div v-if="block.tableColumn" :class="[`tabs${block.id}`]" class=" animate__animated">
              <template v-if="block.tableOption.topSlot">
                <slot :name="block.tableOption.topSlot" />
              </template>
              <el-button
                v-if="block.tableOption.addBtnVisible"
                size="mini"
                type="primary"
                class="con-margin-b con-margin-t"
                @click="block.tableOption.onAddTableLine()"
              >
                {{ $t('添加') }}
              </el-button>
              <el-table
                :data="formData[block.tableOption.tableKey]"
                :height="block.tableOption.tableHeight"
                :row-key="getRowKeys"
                border
                class="con-margin-b"
                style="width: 100%;"
                :max-height="block.tableOption.maxHeight || 'none'"
                :row-class-name="tableRowClassName"
              >  <!-- 多选框 -->
                <el-table-column
                  v-if="block.tableOption.mutiSelect"
                  type="selection"
                  reserve-selection
                  :width="block.tableOption.showSummary ? '50px' : ''"
                  fixed="left"
                />
                <template v-for="(tableItem,tableIndex) in block.tableColumn">

                  <!-- 不带分页序号列 -->
                  <el-table-column
                    v-if="tableItem.prop === 'ids'"
                    :key="tableItem.prop"
                    :prop="tableItem.prop"
                    :label="$t(`${tableItem.label || '序号'}`)"
                    :fixed="tableItem.fixed || 'left'"
                    type="index"
                    width="50"
                  />
                  <el-table-column
                    v-if="tableItem.prop !== 'ids' && !tableItem.hide"
                    :key="tableIndex"
                    :label="tableItem.label"
                    :width="tableItem.width"
                    :fixed="tableItem.fixed"
                  >
                    <template slot="header">
                      <span :class="tableItem.required ? 'table-required-label':''">{{ tableItem.label }}</span>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item
                        v-if="['label_input','label_input_number','label_input_clearable','label_select'].includes(tableItem.type)"
                        label=""
                        :prop="`${block.tableOption.tableKey}_${tableItem.prop}_${scope.row.formIndex}`"
                        :rules="tableItem.rules"
                        :required="tableItem.required"
                      >
                        <!-- input -->
                        <el-input
                          v-if="tableItem.type === 'label_input'"
                          :ref="`${tableItem.tableKey}_${tableItem.prop}_${scope.$index}`"
                          v-model="scope.row[tableItem.prop]"
                          :placeholder="tableItem.placeholder ? $t(`${tableItem.placeholder}`):$t('请输入')"
                          :clearable="tableItem.clearable || true"
                          :disabled="tableItem.disabled"
                          @blur="handleTableBlur(block.tableOption.tableKey, tableItem, scope.row[tableItem.prop], scope, tableItem.handleBlur)"
                          @clear="handleTableClear(block.tableOption.tableKey, tableItem, scope.row[tableItem.prop], scope, tableItem.handleClear)"
                        />
                        <!-- input_number -->
                        <el-input-number
                          v-else-if="tableItem.type === 'label_input_number'"
                          :ref="`${block.tableOption.tableKey}_${tableItem.prop}_${scope.row.formIndex}`"
                          v-model="scope.row[tableItem.prop]"
                          :precision="tableItem.precision"
                          :step="tableItem.step"
                          :disabled="tableItem.disabled"
                          :max="tableItem.max"
                          :min="tableItem.min || 0"
                          :controls="tableItem.controls"
                          :controls-position="tableItem.controlsPosition || 'right'"
                          :placeholder="tableItem.placeholder ? $t(`${tableItem.placeholder}`):$t('请输入')"
                          :clearable="tableItem.clearable || true"
                          @blur="handleTableBlur(block.tableOption.tableKey, tableItem, scope.row[tableItem.prop], scope, tableItem.handleBlur)"
                        />
                        <!-- input_clearable -->
                        <input-clearable
                          v-else-if="tableItem.type === 'label_input_clearable'"
                          :ref="`${block.tableOption.tableKey}_${tableItem.prop}_${scope.row.formIndex}`"
                          v-model="scope.row[tableItem.prop]"
                          :disabled="tableItem.disabled"
                          :placeholder="tableItem.placeholder ? $t(`${tableItem.placeholder}`):$t('请输入')"
                          @clear="handleTableClear(block.tableOption.tableKey, tableItem, scope.row[tableItem.prop], scope, tableItem.handleClear)"
                          @click="(type)=>{tableItem.handleClick && tableItem.handleClick(scope.row[tableItem.prop], scope, type)}"
                        />
                        <!-- select -->
                        <el-select
                          v-else-if="tableItem.type === 'label_select'"
                          :ref="`${block.tableOption.tableKey}_${tableItem.prop}_${scope.row.formIndex}`"
                          v-model="scope.row[tableItem.prop]"
                          :placeholder="tableItem.placeholder ? $t(`${tableItem.placeholder}`):$t('请输入')"
                          :clearable="tableItem.clearable || true"
                          :filterable="tableItem.filterable || true"
                          :disabled="tableItem.disabled"
                          @change="handleTableChange(block.tableOption.tableKey, tableItem, scope.row[tableItem.prop], scope, tableItem.handleChange.bind(tableItem))"
                        >
                          <el-option
                            v-for="(opt,oindex) in tableItem.options"
                            :key="oindex"
                            :label="$t(`${opt[tableItem['labelName'] || 'label'] || opt['subName']}`)"
                            :value="opt[tableItem['labelVal'] || 'value'] || opt['subCode']"
                          />
                        </el-select>
                      </el-form-item>
                      <template
                        v-else-if="tableItem.type==='controlBtn'"
                      >
                        <el-button
                          v-for="(btnItem, btnIndex) in tableItem.btnList"
                          :key="btnIndex"
                          :icon="btnItem.icon"
                          :title="$t(btnItem.btnName)"
                          :type="btnItem.type"
                          circle
                          plain
                          @click="handleTableBtnClick(block.tableOption.tableKey,btnItem,scope,btnItem.btnFun)"
                        />
                      </template>
                      <!-- 格式化列 -->
                      <template
                        v-else-if="
                          tableItem.formatter"
                      >
                        <span v-html="tableItem.formatter(scope.row, tableItem)" />
                      </template>
                      <!-- render自定义列 -->
                      <template v-else-if="tableItem.render">
                        <expand-dom
                          :column="tableItem"
                          :row="scope.row"
                          :render="tableItem.render"
                          :row-index="scope.$index"
                          :index="tableIndex"
                        />
                      </template>
                      <template v-else>
                        <span>{{ scope.row[tableItem.prop] }}</span>
                      </template>
                    </template>
                  </el-table-column>
                </template>
                <div slot="empty" class="empty-image">
                  <img src="@/assets/img/no_data.jpg" alt="" width="100px"> <br>
                  {{ $t('暂无数据') }}
                </div>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div style="height:38px;width:100%;opacity:0;margin-top:70px" />
      <div v-if="btnGroupVisible" class="operate">
        <span class="cancel cursor" size="small" @click="handleCancel">{{ $t('取消') }}</span>
        <el-button v-if="resetBtnVisible" type="primary" plain size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <el-button v-if="saveBtnVisible" class="confirm" type="primary" size="small" :loading="$bus.saveBtnLoading" @click="handleSave()">{{ $t('确认') }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
// import selectAreaTree from '@/components/common/selectAreaTree'
export default {
  name: 'MyForm',
  // 组件
  components: {
    // selectAreaTree,
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        rowIndex: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index,
          rowIndex: ctx.props.rowIndex,
          props: ctx.props
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    }
  },
  props: {
    // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className
    tableRowClassName: {
      type: Function,
      default: function() {
        return () => {}
      }
    },
    // 控制选项
    options: {
      type: Object,
      default: () => {
        return {
          // 是否滚动表单区域
          isScroller: false,
          // 滚动区域的高度
          scrollHeight: '',
          // 滚动区域最大的高度
          scrollMaxHeight: '',
          // label位置（默认上方对齐）
          labelPosition: 'top',
          // label宽度（默认100px）
          labelWidth: '100px',
          // 响应式布局
          xl: 6,
          lg: 8,
          md: 8,
          sm: 12
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    // form表单数据
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单校验规则
    rule: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单列
    column: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 禁用整个表单（默认不禁用）
    disabled: {
      type: Boolean,
      default: false
    },
    // 每一项高度
    formItemHeight: {
      type: String,
      default: ''
    },
    // 按钮栏
    // 是否显示（默认显示）
    btnGroupVisible: {
      type: Boolean,
      default: true
    },
    // 是否取消按钮（默认显示）
    cancelBtnVisible: {
      type: Boolean,
      default: true
    },
    // 是否保存按钮（默认隐藏）
    resetBtnVisible: {
      type: Boolean,
      default: false
    },
    // 是否保存按钮（默认显示）
    saveBtnVisible: {
      type: Boolean,
      default: true
    },
    // 保存loading状态
    saveBtnLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      langRule: {},
      columns: []
    }
  },
  created() {
    console.log(this.$bus.saveBtnLoading)
    this.getLangRule()
    this.columns = []
    for (let i = 0; i < this.column.length; i++) {
      let obj
      setTimeout(() => {
        obj = {
          ...this.column[i],
          id: new Date().getTime()
        }
        this.columns.push(obj)
      }, 5)
    }
    console.log(this.columns)
  },
  methods: {
    getRowKeys(row) {
      return row[this.options.rowKey || 'id'] || Math.random()
    },
    spread(v, index) {
      let a, b
      if (v.tableColumn) {
        a = document.querySelector(`.tabs${v.id}`)
      } else {
        a = document.querySelector(`.tab${v.id}`)
      }
      if (v.tableColumn && v.content) {
        b = document.querySelector(`.tab${v.id}`)
      }
      console.log(v)
      if (!v.isCollapse) {
        a.classList.remove('animate__fadeInDown')
        a.classList.add('animate__fadeOutUp')
        if (v.tableColumn && v.content) {
          b.classList.remove('animate__fadeInDown')
          b.classList.add('animate__fadeOutUp')
        }
        setTimeout(() => {
          a.classList.add('animations')
          if (v.tableColumn && v.content) {
            b.classList.add('animations')
          }
        }, 500)
        this.$set(this.columns[index], 'isCollapse', true)
        return
      }
      a.classList.add('animate__fadeInDown')
      if (v.tableColumn && v.content) {
        b.classList.add('animate__fadeInDown')
      }
      setTimeout(() => {
        a.classList.remove('animate__fadeInDown')
        if (v.tableColumn && v.content) {
          b.classList.remove('animate__fadeInDown')
        }
      }, 1000)
      a.classList.remove('animations')
      a.classList.remove('animate__fadeOutUp')
      if (v.tableColumn && v.content) {
        b.classList.remove('animations')
        b.classList.remove('animate__fadeOutUp')
      }
      this.$set(this.columns[index], 'isCollapse', false)
    },
    // 校验规则多语言处理
    getLangRule() {
      const ruleObj = {}
      if (this.rule) {
        Object.keys(this.rule).forEach((key) => {
          let obj
          if (this.rule[key] instanceof Array) {
            obj = this.rule[key].map(it => ({
              ...it,
              message: it.message ? this.$i18n.tc(it.message) : ''
            }))
          } else {
            obj = {
              ...this.rule[key],
              message: this.rule[key].message ? this.$i18n.tc(this.rule[key].message) : ''
            }
          }
          ruleObj[key] = obj
        })
        this.langRule = ruleObj
      }
    },
    // change事件
    handleChange(prop) {
      this.$emit('handleChange', prop, this.formData[prop])
    },
    // clear事件
    handleClear(prop) {
      this.$emit('handleClear', prop, this.formData[prop])
    },
    // blur事件
    handleBlur(prop) {
      this.$emit('handleBlur', prop, this.formData[prop])
    },
    // table change事件
    handleTableChange(tableKey, tableItem, value, scope, cb) {
      if (tableItem.required) {
        this.$set(this.formData, `${tableKey}_${tableItem.prop}_${scope.row.formIndex}`, value)
      }
      cb && cb(value, scope)
    },
    // table clear事件
    handleTableClear(tableKey, tableItem, value, scope, cb) {
      if (tableItem.required) {
        this.$set(this.formData, `${tableKey}_${tableItem.prop}_${scope.row.formIndex}`, value)
      }
      cb && cb(value, scope)
    },
    // table blur事件
    handleTableBlur(tableKey, tableItem, value, scope, cb) {
      if (tableItem.required) {
        this.$set(this.formData, `${tableKey}_${tableItem.prop}_${scope.row.formIndex}`, value)
      }
      cb && cb(value, scope)
    },
    // table btn click事件
    handleTableBtnClick(tableKey, btnItem, scope, cb) {
      if (btnItem.isDel) {
        for (const prop in scope.row) {
          if (scope.row.formIndex && scope.row[prop] && this.formData[`${tableKey}_${prop}_${scope.row.formIndex}`]) {
            this.formData[`${tableKey}_${prop}_${scope.row.formIndex}`] = ''
          }
        }
      }
      cb && cb(scope.row, scope.$index)
    },
    // 取消
    handleCancel() {
      this.$emit('handleCancel')
    },
    // 重置
    handleReset() {
      this.$refs.form.resetFields()
      this.$emit('handleReset')
    },
    // 保存
    handleSave() {
      this.$refs['form'].validate((valid, object) => {
        if (valid) {
          this.$emit('handleSave')
        } else {
          this.scrollView(object)
        }
      })
    },
    // 滚动到固定地方
    scrollView(object) {
      for (const i in object) {
        let dom = this.$refs[i]
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== '[object Object]') {
          dom = dom[0]
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({ // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: 'center',
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: 'smooth'
        })
        break // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    }
  }
}
</script>
<style lang="less" scoped>
.confirm{
    font-size: 16rem;
}
.blockLevel{
    padding-right: 32px;
}
.white{
#style-6{

    overflow-x: hidden;
}
#style-6::-webkit-scrollbar
{
	width: 12px;
    display: inline-block;
	background-color: #F6F8FA;
}
#style-6::-webkit-scrollbar-track
{
	// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F6F8FA;
    border-radius: 100px;
}
#style-6::-webkit-scrollbar-thumb
{
	background-color: #C2C2C2;
     border-radius: 100px;
	// background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent)
}}
.dark{
#style-6{

    overflow-x: hidden;
}
#style-6::-webkit-scrollbar
{
	width: 12px;
    display: inline-block;
	background-color: #353535;
}
#style-6::-webkit-scrollbar-track
{
	// -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #353535;
    border-radius: 100px;
    padding: 10px;
    position: absolute;
    left: 0;
}
#style-6::-webkit-scrollbar-thumb
{
	background-color:#565656;
    border-radius: 100px;
	// background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent)
}}
</style>
<style lang="less">
#my_form {
//   background: white;
  // padding: 20px;
  .el-cascader,
  .el-date-editor,
  .el-input-number,
  .el-select {
    width: 100%;
  }
  .el-input-number .el-input__inner {
    text-align: left;
  }
  .el-form-item__label {
    width: 100%;
    text-align: left;
  }
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0;
  }
  .el-form-item--mini.el-form-item {
    margin-bottom: 0;
  }
  .formUpload {
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .el-input {
      width: auto;
    }
    .operateBtn {
      margin-left: 10px;
    }
  }

  .imgReview {
    width: 100%;
  }
  .block {
    position: relative;
    transition:height ease  .5s;
    margin-bottom: 15px;
    &.border {
      padding: 30px 20px 10px;
      margin-bottom: 20px;
    //   border: 1px dashed #d2d6de;
    }
    .header {
    //   position: absolute;
        text-align: left;
    margin-left: -10px;
      top: -26px;
      left: 10px;
      z-index: 10;
      padding: 0 10px 5px;
    //   color: #333;
      font-size: 15px;
    //   background-color: #fff;
    }
  }
  .right-btn {
    position: absolute;
    top: 0;
    right: 20px;
  }
  .btns{
    margin-top: 20px;
  }
  .form-scroller {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 10px;
    padding-right: 5px;
    &::-webkit-scrollbar {
      width: 5px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #ddd;
    }
  }
  .el-table th {
    background-color: #eff3f8;
    border-bottom: 1px solid #ccc;
  }
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border-color: #e4e8f3;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-right: 0;
  }
  .prependSel{
    width: 100px;
  }
  .table-required-label {
    &::before{
          content: "*";
    color: #f56c6c;
    margin-right: 2px;
    }
  }
}
.spreads{
  text-align: center;
   color: #005dc0;

    cursor: pointer;
     position: absolute;
      top: -10px;
      left: 48%;
      z-index: 10;
      padding: 0 10px 5px;
      font-size: 15px;
      background-color: #fff;

}

.animations{
  display: none;
}
.transfer{
  transform: rotate(0deg);
   transition: ease .5s;
}
.transfers{
  transform: rotate(180deg);
  transition: ease .5s;
}

</style>
