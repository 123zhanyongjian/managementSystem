<template>
  <!-- 列表 -->
  <div>
    <my_table
      ref="comTable"
      :data-source="dataSource"
      :options="tableOptions"
      :page-vo="pageVo"
      :columns="tableColumns"
      @handleCurrentChange="handleCurrentChange"
    />
    <Add
      v-if="addShow"
      :edit-state="editState"
      :form-data="formDatas"
      :add-show.sync="addShow"
      :tree-data="dataSource"
      @save="save"
    />
  </div>
</template>
<script>
import Add from './component/add.vue'
import * as _api from '@/api/SystemMaterial/modelManagement'
// import moment from 'moment'
import {

  editImgs,

  delImgs,
  more

} from '../icon'
export default {
  components: {
    Add
  },
  props: {
    modelCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addShow: false,
      status: true,
      // 表格分页
      pageVo: {
        total: 30,
        status: true,
        pageSize: 10,
        currentPage: 1
      },
      tableColumns: [
        {
          prop: 'ids',
          width: 135
        },
        {
          prop: 'modelCode',
          label: '型号'
        },
        {
          prop: 'modelDescription',
          label: '描述'
        },
        {
          prop: 'createUserId',
          label: '添加人'
        },
        {
          prop: 'createTime',
          label: '添加日期'
        },
        {
          prop: 'controlBtn',
          label: '操作',
          render: (h, params) => {
            return (
              <div class='operation cursor'>
                <el-dropdown
                  onCommand={(event) => this.dropdown(event, params.row)}
                >
                  <span class='icons' style='font-size:14px;color: #15DCC6;'>
                    <img
                      style=' vertical-align: middle;width: 14px;'
                      src={more}
                    />{' '}
                  </span>
                  <el-dropdown-menu slot='dropdown'>
                    <el-dropdown-item command='edit' style={{ 'display': params.row.nodeType === 1 ? 'none' : '' }}>
                      <img width='14px' src={editImgs} alt='' />
                      &nbsp;{this.$tc('编辑')}
                    </el-dropdown-item>
                    <el-dropdown-item command='del'>
                      <img width='14px' src={delImgs} alt='' />
                      &nbsp; {this.$tc('删除')}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            )
          }
        }
      ],
      // 表格参数配置
      tableOptions: {
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: false, // 是否支持列表项选中功能
        height: 'calc(77.3vh)',
        border: false,
        padding: 'lists'
      },
      dataSource1: [
        {
          claimNo: '123',
          orderCode: '42111'
        },
        {
          claimNo: '555',
          orderCode: '42111'
        }
      ],
      // 表格数据
      dataSource: [
        {
          claimNo: '123',
          orderCode: '42111'
        }
        // {
        //   claimNo: '555',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '123',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '555',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }, {
        //   claimNo: '4534',
        //   orderCode: '42111'
        // }
      ]
    }
  },
  watch: {
    modelCode(v) {
      this.getData(this.pageVo.currentPage, 10, v)
    }
  },
  mounted() {
    this.getData(1, 10);
  },
  methods: {
    getData(pageNumber, pageSize, modelCode) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        parentId: '0',
        modelCode
      }
      _api.page(obj).then((res) => {
        this.dataSource = res.data
        this.pageVo.total = res.total
        //   this.tableOptions.loading = false
      })
    },
    handleCurrentChange(v) {
      this.pageVo.currentPage = v
      this.getData(v, this.pageVo.pageSize)
    }
  }
}
</script>
