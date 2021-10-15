<template>
  <div class="table">
    <pl-table
      ref="commonTable"
      v-loading="options.loading"
      :data="dataSource"
      :row-key="getRowKeys"
      :stripe="options.stripe"
      :height="tableHeight"
      :use-virtual="true"
      :pagination-show="pageVo.status"
      :row-height="41"
      :min-height="150"
      :highlight-current-row="options.highlightCurrentRow"
      :show-summary="options.showSummary"
      :summary-method="summaryMethod || null"
      :total="pageVo.total"
      :page-size="pageVo.pageSize"
      :current-page="pageVo.currentPage"
      :page-sizes="pageVo.pageSizes ? pageVo.pageSizes : pageSizes"
      @handlePageSize="handlePageSize"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @header-dragend="headerDragend"
    >
      <div slot="empty" class="empty-image">
        <img src="@/assets/img/no_data.jpg" alt="" width="100px"> <br>
        {{ $t('暂无数据') }}
      </div>
      <pl-table-column v-if="options.mutiSelect" :reserve-selection="true" type="selection" :width="options.showSummary ? '50px' : ''" />
      <template v-for="(column, indexs) in columns">
        <pl-table-column
          v-if="options.serial && column.prop === 'ids'"
          :key="column.prop + '-' + indexs"
          :prop="column.prop"
          :label="$t(`${column.label}`)"
          :fixed="column.fixed"
          type="index"
          :index="(index)=>{return pageVo.pageSize * (pageVo.currentPage - 1) + (index+1)}"
          width="50"
          :show-overflow-tooltip="true"
        />
        <pl-table-column
          v-if="column.prop !== 'ids' && !column.children"
          :key="column.prop + '-' + indexs"
          :prop="column.prop"
          :show-overflow-tooltip="true"
          :label="$t(`${column.label}`)"
          :fixed="column.fixed"
          :width="column.width||(columns.length>9?160:'auto')"
          :sortable="!column.sortable && column.prop !== 'controlBtn' "
          :min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template v-if="column.formatter && (!column.form && !scope.row.editColumnForm)">
                <span v-html="column.formatter(scope.row, column)" />
              </template>
              <template v-else-if="column.form || scope.row.editColumnForm">
                <!-- 表单新增 -->
                <el-input
                  v-if="column.type==='label_input'"
                  v-model="scope.row[column.prop]"
                  :placeholder="$t(`${column.placeholder || '请输入'}`)"
                  :disabled="column.disabled"
                  :suffix-icon="column.iconClass"
                  :readonly="column.readonly"
                  :maxlength="column.maxlength"
                  :minlength="column.minlength"
                  @click.native="column.handleClick?column.handleClick(scope.row, column, scope.$index):''"
                />
                <el-select
                  v-if="column.type==='label_select'"
                  v-model="scope.row[column.prop]"
                  :disabled="column.disabled"
                  :placeholder="$t(`${column.placeholder || '请选择'}`)"
                  @change="column.handleChange?column.handleChange($event, scope.row):''"
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
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-text="column.active"
                  :inactive-text="column.inactive"
                  @change="column.switchChange?column.switchChange($event,scope):''"
                />
                <el-date-picker
                  v-if="column.type == 'label_date_picker'"
                  v-model="scope.row[column.prop]"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t(`${column.placeholder || '请选择'}`)"
                />
                <el-input-number
                  v-if="column.type == 'label_number'"
                  v-model="scope.row[column.prop]"
                  :precision="column.precision"
                  :step="column.step"
                  :disabled="column.disabled"
                  :max="column.max"
                  :min="column.min || 0"
                  controls-position="right"
                  :placeholder="$t(`${column.placeholder || '请输入'}`)"
                  @blur="column.blur?column.blur(column.prop):''"
                />
                <img v-if="column.type == 'label_img'" :src="scope.row[column.prop]" width="40" height="40" class="head_pic">
                <span v-if="!column.type">
                  {{ scope.row[column.prop] }}
                </span>
              </template>
              <template v-else-if="column.open">
                <a
                  v-if="column.openDrawer==='table_open'"
                  href="javascript:;"
                  style="text-decoration: none;color:#0085d0;"
                  @click="column.open(scope.row,column)"
                >
                  {{ scope.row[column.prop] }}
                </a>
              </template>
              <template v-else>
                {{ scope.row[column.prop] }}
              </template>
            </template>
            <template v-else>
              <expand-dom :column="column" :row="scope.row" :render="column.render" :index="indexs" />
            </template>
          </template>
        </pl-table-column>
        <!-- 多级表头 -->
        <table-column
          v-if="column.children && column.children.length"
          :key="column.label + indexs"
          :coloumn-header="column"
        />
      </template>
    </pl-table>
  </div>
</template>
<script>
import { PlTable, PlTableColumn } from 'pl-table'
import tableColumn from './tableColumn'
export default {
  components: {
    PlTable,
    PlTableColumn,
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    },
    tableColumn
  },
  props: {
    // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className
    tableRowClassName: {
      type: Function,
      default: function() {
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
    summaryMethod: {
      type: Function,
      default() {
        return ''
      }
    },
    // 页面/组件类型
    tableType: {
      type: String,
      default() {
        return 'page-table'
      }
    }
  },
  data () {
    return {
      pageSizes: [15, 30, 50, 100],
      tableHeight: 450,
      pageIndex: 1,
      multipleSelection: [], // 多行选中
      tabPage: false
    }
  },
  watch: {
    dataSource: {
      handler(val) {
        this.doLayout()
        if (!this.tabPage) {
          this.clearSelection()
        } else {
          this.tabPage = false
        }
      }
    }
  },
  activated() {
    this.doLayout()
  },
  mounted() {
    console.log(this.columns.length)
    // 获取表格高度
    this.setTableHeight()
  },
  methods: {
    headerDragend() {
      this.doLayout()
    },
    // 设置表格高度
    setTableHeight() {
      this.$nextTick(() => {
        if (!this.options.autoHeight && this.tableType === 'page-table' && !this.options.height) {
          this.tableHeight = this.$Utils.setTableHeight(this.options.cusHeight)
        } else if (!this.options.autoHeight && this.tableType === 'dialog-table' && !this.options.height) {
          this.tableHeight = 450
        } else {
          this.tableHeight = this.options.height || null
        }
      })
    },
    // 默认选中
    rowSelection(row) {
      this.$refs.commonTable.toggleRowSelection(row)
    },
    getRowKeys() {
      return this.options.rowKey || undefined
    },
    // 分页
    handlePageSize ({ page, size }) {
      if (this.pageVo.currentPage !== page) {
        this.tabPage = true
        this.$emit('handleCurrentChange', page)
      }
      if (this.pageVo.pageSize !== size) {
        this.tabPage = true
        this.$emit('handleSizeChange', size)
      }
    },
    // 多行选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },
    // 单击tabel获取数据
    handleRowClick(row, col) {
      this.multipleSelection = [...this.multipleSelection, row]
      this.$emit('handleRowClick', row, col)
    },
    // 双击tabel获取数据
    handleRowDbClick(row) {
      this.$emit('handleRowDbClick', row)
    },
    // 对Table进行重新布局。当Table或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout() {
      this.$nextTick(() => {
        this.$refs.commonTable.doLayout()
      })
    },
    // 清除多选
    clearSelection() {
      this.$refs.commonTable.clearSelection()
    }
  }
}
</script>
<style lang="scss">
.myPagination {
  margin-top: 5px;
  text-align: right;
}
.el-table th {
  background-color: #eff3f8;
}
.table {
  .el-table__fixed-body-wrapper {
    width: 100%;
  }
  .el-table__empty-block {
    height: 146px;
  }
  .empty-image {
    position: absolute;
    line-height: 40px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .el-table--mini th {
    padding: 2px 0;
  }
  .el-input-number--mini {
    width: 100px;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    z-index: 2;
  }
}
</style>
