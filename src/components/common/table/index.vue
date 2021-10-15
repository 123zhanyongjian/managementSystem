<template>
  <div
    class="table cursor"
    :class="options.padding"
  >
    <el-table
      ref="commonTable"
      v-loading="options.loading"
      :border="options.border"
      :data="dataList"
      :row-height="41"
      :min-height="150"
      :stripe="options.stripe"
      :height="tableHeight || null"
      :max-height="options.maxHeight || null"
      :show-summary="options.showSummary"
      :row-key="getRowKeys"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="options.expand"
        type="expand"
      >
        <template slot-scope="props">
          <expand-dom
            :row="props.row"
            :render="options.expandContent"
            :row-index="props.$index"
          />
        </template>
      </el-table-column>
      <!-- 多选框 -->
      <el-table-column
        v-if="options.mutiSelect"
        type="selection"
        reserve-selection
        :width="options.showSummary ? '50px' : ''"
        fixed="left"
      />
      <template v-for="(column, indexs) in columns">
        <!-- 带分页序号列 -->
        <el-table-column
          v-if="column.prop === 'ids' && options.serial && pageVo.status"
          :key="column.prop"
          :prop="column.prop"
          :label="$t(`${column.label || '序号'}`)"
          type="index"
          :index="(index)=>{return pageVo.pageSize*(pageVo.currentPage - 1) + (index+1)}"
          :width="column.width||'90'"
          :align="column.align || 'center'"
          :show-overflow-tooltip="column.prop !== 'controlBtn' ? true : false"
        />
        <!-- 不带分页序号列 -->
        <el-table-column
          v-else-if="column.prop === 'ids' && options.serial && !pageVo.status"
          :key="column.prop"
          :prop="column.prop"
          :label="$t(`${column.label || '序号'}`)"
          type="index"
          :index="(index)=>{return index+1}"
          :width="column.width||'90'"
          :align="column.align || 'center'"
          :show-overflow-tooltip="column.prop !== 'controlBtn' ? true : false"
        />
        <!-- 数据列 -->
        <el-table-column
          v-else
          :key="column.prop"
          :sortable="column.sortable"
          :sort-method="column.sortMethod?column.sortMethod:(v,r)=>{sortMethods(v,r,column.prop)}"
          :prop="column.prop"
          :label="$t(`${column.label}`)"
          :fixed="column.fixed"
          :render-header="column.renderHeader"
          :align="column.align || 'center'"
          :width="column.width"
          :min-width="100"
          :show-overflow-tooltip="column.prop === 'controlBtn' ? false : true"
          :class-name="column.prop === 'controlBtn' ? 'borderLeft' : ''"
        >
          <template v-slot:header>
            <span class="header-ellipsis">{{ $t(`${column.label}`) }}<span v-if="column.headSelect">
              <el-dropdown @command="column.handleCommand">
                <img
                  class="imgs"
                  :src="selectiMG"
                  alt=""
                >
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(ites,idex) in column.headSelect"
                    :key="idex"
                    :command="ites.value"
                  >{{ $t(ites.label) }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span></span>
          </template>
          <template slot-scope="scope">
            <!-- 是否是文件系统 -->
            <template v-if="column.file">
              <img
                width="32px"
                :src="scope.row.nodeType===1?column.fileSrc:column.fileSrc1"
                alt=""
              > <span style="margin-left:15px">{{ scope.row[column.prop] }}</span>
            </template>
            <!-- render自定义列 -->
            <template v-else-if="column.render">
              <expand-dom
                :column="column"
                :row="scope.row"
                :render="column.render"
                :row-index="scope.$index"
                :index="indexs"
              />
            </template>
            <!-- 格式化列 -->
            <template v-else-if="column.formatter">
              <span v-html="column.formatter(scope.row, column)" />
            </template>
            <!-- 表格行编辑表单 -->
            <template v-else-if="column.form">
              <el-input
                v-if="column.type==='label_input'"
                v-model="scope.row[column.prop]"
                clearable
                :placeholder="column.placeholder || $t('请输入')"
                :disabled="column.disabled"
                :suffix-icon="column.iconClass"
                :readonly="column.readonly"
                :maxlength="column.maxlength"
                :minlength="column.minlength"
                @click.native="column.handleClick?column.handleClick(scope,$event):''"
              />
              <!-- checkbox -->
              <el-checkbox
                v-if="column.type == 'label_checkbox'"
                v-model="scope.row[column.prop]"
                :true-label="true"
                :false-label="false"
                :disabled=" column.disabled"
                @change="column.handleChange ? handleChange(scope,$event):''"
              >
                <div>{{ column.text ? $t(`${column.text}`) : '' }}</div>
              </el-checkbox>
              <el-input-number
                v-if="column.type == 'label_input_number'"
                v-model="scope.row[column.prop]"
                clearable
                :precision="column.precision"
                :step="column.step"
                :disabled="column.disabled"
                :max="column.max"
                :min="column.min || 0"
                :controls-position="column.position || 'right'"
                :placeholder="column.placeholder || $t('请输入')"
                @blur="column.handleBlur?column.handleBlur(scope,$event):''"
              />
              <el-select
                v-if="column.type==='label_select'"
                v-model="scope.row[column.prop]"
                clearable
                :placeholder="column.placeholder || $t('请选择')"
                :disabled="column.disabled"
                @change="column.handleChange?column.handleChange(scope,$event):''"
              >
                <el-option
                  v-for="(opt,index) in column.options"
                  :key="index"
                  :label="$t(`${opt[column['labelName'] || 'label']}`)"
                  :value="opt[column['labelVal'] || 'value']"
                />
              </el-select>
              <el-switch
                v-if="column.type==='label_switch'"
                v-model="scope.row[column.prop]"
                :active-value="column.activeValue || 1"
                :inactive-value="column.inactiveValue || 0"
                :active-color="column.inactiveColor || '#13ce66'"
                :inactive-color="column.inactiveColor || '#ff4949'"
                :active-text="column.activeText"
                :inactive-text="column.inactiveText"
                @change="column.handleChange?column.handleChange(scope,$event):''"
              />
              <el-time-picker
                v-if="column.type==='label_time'"
                v-model="scope.row[column.prop]"
                arrow-control
                :picker-options="column.timeInterval"
                :placeholder="column.placeholder || $t('请选择')"
              />
              <el-date-picker
                v-if="column.type == 'label_date_picker'"
                v-model="scope.row[column.prop]"
                clearable
                :disabled="column.disabled"
                :type="column.dateType || 'datetime'"
                :format="column.formatShow ? column.formatShow : (column.dateType === 'datetime' ||column.dateType === 'datetimerange') ? 'dd-MM-yyyy HH:mm:ss' : 'dd-MM-yyyy'"
                :value-format="column.format || 'yyyy-MM-dd hh:mm:ss'"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                :placeholder="column.placeholder || $t('请选择')"
                :picker-options="column.pickerOptions"
                @change="column.handleChange?column.handleChange($event,scope):''"
              />
              <img
                v-if="column.type == 'label_img'"
                :src="scope.row[column.prop]"
                width="40"
                height="40"
                class="head_pic"
              >
            </template>
            <template v-else>
              <span>{{ scope.row[column.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </template>
      <div
        slot="empty"
        class="empty-image"
      >
        <img
          :src="noData"
          alt=""
        > <br>
        {{ $t('暂无数据') }}
      </div>
    </el-table>
    <div
      v-if="pageVo.status"
      style="height:38px"
      class="pageClass"
    >
      <el-pagination
        id="common-pagination"
        background
        :current-page.sync="pageVo.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageVo.pageSize"
        layout="total,sizes, prev, pager, next,jumper"
        :total="pageVo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
const noData = localStorage.theme
  ? require('@/assets/img/noData.png')
  : require('@/assets/img/noData1.png')
const selectiMG = localStorage.theme
  ? require('@/assets/img/select1.png')
  : require('@/assets/img/select.png')
export default {
  components: {
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
          rowIndex: ctx.props.rowIndex
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
      default: function () {
        return () => {}
      }
    },
    // 数据源
    dataSource: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 数据列表
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 设置option
    options: {
      type: Object,
      default() {
        return {
          // 固定高度
          height: '',
          // 计算高度偏差值
          cusHeight: 0,
          // 自适应高度
          autoHeight: false,
          // 最大高度
          maxHeight: '',
          // 是否为斑马纹 table
          stripe: false,
          // 是否要高亮当前行
          highlightCurrentRow: false
        }
      }
    },
    // 分页参数
    pageVo: {
      type: Object,
      default() {
        return {}
      }
    },
    // 合计方法
    // eslint-disable-next-line vue/require-default-prop
    summaryMethod: Function
  },
  // 数据
  data() {
    return {
      selectiMG,
      noData,
      tableHeight: 0,
      pageIndex: 1,
      multipleSelection: [], // 多行选中
      tabPage: false,
      theme: false,
      order: null,
      dataList: []
    }
  },
  computed: {},
  watch: {
    dataSource: {
      handler(val) {
        this.dataList = val;
        if (!this.tabPage) {
          this.clearSelection()
        } else {
          this.tabPage = false
        }
      }
    },
    'options.height'(v) {
      this.tableHeight = this.options.autoHeight ? null : this.options.height
    }
  },
  activated() {
    this.doLayout()
  },
  mounted() {
    // 初始赋值
    this.dataList = this.dataSource
    // 初始化清空缓存的数组
    if (sessionStorage.dataSortList) {
      sessionStorage.removeItem('dataSortList')
    }
    // 判断是否缓存有值 没有的话赋值(和排序有关)
    const s1 = setInterval(() => {
      sessionStorage.dataSortList = JSON.stringify(this.dataList)
      if (sessionStorage.dataSortList) {
        clearInterval(s1)
      }
    }, 200)

    // 获取表格高度
    this.tableHeight = this.options.autoHeight ? null : this.options.height
    console.log(this.options, this.tableHeight)
    this.theme = !!localStorage.theme
    console.log(this.theme, 111)

    onresize = () => {
      console.log(123)
      let t = 0
      const s = setInterval(() => {
        t++
        if (t > 0) {
          this.doLayout()
          clearInterval(s)
        }
      }, 100)
    }
  },
  destroyed() {
    onresize = ''
  },
  methods: {
    sortChange({ order, prop }) {
      this.order = order
      console.log(order)
      const dataClone = JSON.parse(sessionStorage.dataSortList)
      if (this.options.fileSort) {
        // 文件夹系统
        if (order === 'ascending') {
          // 升序排序
          this.dataList.sort((r, v) => {
            //   // 先判断是否是数字或字母/^[\x00-\xff]/ 为true则是字母或数字
            return r.nodeType - v.nodeType
          })
        } else if (order === 'descending') {
          this.dataList.sort((r, v) => {
            //   // 先判断是否是数字或字母/^[\x00-\xff]/ 为true则是字母或数字
            return v.nodeType - r.nodeType
          })
        }
        if (!order) {
          return dataClone
        }
        return
      }

      if (order === 'ascending') {
        this.dataList.sort((r, v) => {
          //   // 先判断是否是数字或字母/^[\x00-\xff]/ 为true则是字母或数字
          const a = /^[\x00-\xff]/.test(('' + r[prop]).substr(0, 1))
            ? isNaN(('' + r[prop]).substr(0, 1))
              ? ('' + r[prop]).substr(0, 1).toLocaleUpperCase().charCodeAt()
              : Number(('' + r[prop]).substr(0, 1))
            : ('' + r[prop]).substr(0, 1).charCodeAt()
          const b = /^[\x00-\xff]/.test(('' + v[prop]).substr(0, 1))
            ? isNaN(('' + v[prop]).substr(0, 1))
              ? ('' + v[prop]).substr(0, 1).toLocaleUpperCase().charCodeAt()
              : Number(('' + v[prop]).substr(0, 1))
            : ('' + v[prop]).substr(0, 1).charCodeAt()
          return a - b
        })
      } else if (order === 'descending') {
        this.dataList.sort((r, v) => {
          //   // 先判断是否是数字或字母/^[\x00-\xff]/ 为true则是字母或数字
          const a = /^[\x00-\xff]/.test(('' + r[prop]).substr(0, 1))
            ? isNaN(('' + r[prop]).substr(0, 1))
              ? ('' + r[prop]).substr(0, 1).toLocaleUpperCase().charCodeAt()
              : Number(('' + r[prop]).substr(0, 1))
            : ('' + r[prop]).substr(0, 1).charCodeAt()
          const b = /^[\x00-\xff]/.test(('' + v[prop]).substr(0, 1))
            ? isNaN(('' + v[prop]).substr(0, 1))
              ? ('' + v[prop]).substr(0, 1).toLocaleUpperCase().charCodeAt()
              : Number(('' + v[prop]).substr(0, 1))
            : ('' + v[prop]).substr(0, 1).charCodeAt()
          return b - a
        })
      } else {
        this.dataList = dataClone
      }
    },
    // 排序
    sortMethods(r, v, type) {},
    // 默认选中
    rowSelection(row) {
      this.$refs.commonTable.toggleRowSelection(row)
    },
    getRowKeys(row) {
      return row[this.options.rowKey || 'id'] || Math.random()
    },
    handleCurrentChange(val) {
      this.tabPage = true
      this.$emit('handleCurrentChange', val)
    },
    handleSizeChange(val) {
      this.tabPage = true
      this.$emit('handleSizeChange', val)
    },
    // 多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },
    // 单击tabel行获取数据
    handleRowClick(row, col) {
      this.multipleSelection = [...this.multipleSelection, row]
      this.$emit('handleRowClick', row, col)
    },
    // 双击tabel行获取数据
    handleRowDbClick(row) {
      this.$emit('handleRowDbClick', row)
    },
    // 对Table进行重新布局。当Table或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout() {
      this.$nextTick(() => {
        this.$refs.commonTable.doLayout()
        console.log('被打击')
      })
    },
    // 清除多选
    clearSelection() {
      this.$refs.commonTable.clearSelection()
    }
  }
}
</script>
<style lang="less" scoped>
.imgs {
  width: 14px;
  margin-left: 12px;
}
</style>
<style lang="less">
.pageClass {
  margin-top: 10px;
}
.el-table tbody tr:hover > td {
  background-color: transparent !important;
}
.el-table tbody tr:hover {
  border: 1px solid white;
}
.el-table__fixed tbody tr:hover > td {
  //左边固定
  background-color: transparent !important;
}
.el-table__fixed-right tbody tr:hover > td {
  //右边固定
  background-color: transparent !important;
}
.tableBtnSty {
  color: rgba(74, 144, 226, 1);
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  cursor: pointer;
  user-select: none;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.el-table .warning-row {
  //   background: rgb(156,205,205);
}

.el-table .success-row {
  //   background: rgb(255,255,225);
}
.el-pagination {
  text-align: right;
}
// .table {
//   .el-table th {
//     background-color: #eff3f8;
//     border-bottom: 1px solid #ccc;
//   }
//   .el-table--border td,
//   .el-table--border th,
//   .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
//     border-color: #e4e8f3;
//   }
//    /deep/ .el-divider {
//     margin: 0 9px 0 3px;
//   }
//   .borderLeft {
//     border-left: 1px solid #e4e8f3;
//   }
//   .el-table--scrollable-x .el-table__body-wrapper {
//     z-index: 2;
//   }
//   .el-table--mini th {
//     padding: 2px 0;
//   }
// }
.lists .el-table td,
.lists .el-table th.is-leaf {
  border: none;
}
.lists .el-table__body {
  border-collapse: separate;
  border-spacing: 0 8px;
  table-layout: auto !important;
}
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row > td {
  background-color: transparent;
}
.empty-image > img {
  width: 248px;
}
// #242424
</style>
