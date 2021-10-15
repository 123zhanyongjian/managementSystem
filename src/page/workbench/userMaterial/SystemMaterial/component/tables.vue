<template>
  <div class="systemMaterialTables">
    <el-dialog
      :title="$t('选择系统物料')"
      :visible.sync="tablesShow"
      :close-on-click-modal="false"
      width="83.3%"
      top="10vh"
      :before-close="handleClose"
    >
      <div class="form">
        <el-input
          v-model="modeVal"
          clearable
          :placeholder="$t('搜索')"
          class="input "
          @input="getData(1,10,{searchWord:modeVal})"
        >
          <img
            slot="prefix"
            width="16px"
            :src="search"
          >
        </el-input>
      </div>
      <my_table
        ref="comTable"
        :data-source="dataSource"
        :options="tableOptions"
        :page-vo="pageVo"
        class="table"
        :columns="tableColumns"
        @handleCurrentChange="handleCurrentChange"
      />
      <!-- <el-button
        class="cursor"
        type="primary"
        @click="handleClose"
      >{{ $t('确认') }}</el-button> -->
    </el-dialog>
  </div>
</template>
<script>
import * as _api from '@/api/SystemMaterial/SystemMaterial'
export const search = localStorage.theme
  ? require('../../img/serachdark.png')
  : require('../../img/serachWhite.png')
import { addImg } from '../../icon'
export default {
  props: {
    tablesShow: {
      type: Boolean,
      default: false
    },
    formDatas: {
      type: Object,
      default: () => {
        ''
      }
    }
  },
  data() {
    return {
      search,
      modeVal: '',
      // 表格分页
      pageVo: {
        total: 30,
        status: false,
        pageSize: 10,
        currentPage: 1
      },
      tableColumns: [
        {
          prop: 'ids',
          width: 135
        },
        {
          prop: 'img',
          label: '物料图片',
          render: (h, { row }) => {
            if (row.materielImg) {
              return <img class='headimg' src={`${process.env.NODE_ENV === 'development' ? '/api' : '/'}exp/file/file/info/download?objectName=${row.materielImg}`}/>
            }
          }
        },
        {
          prop: 'materielName',
          label: '名称'
        },
        {
          prop: 'modelName',
          label: '型号'
        },
        {
          prop: 'materielType',
          label: '类型'
        },
        {
          prop: 'capacity',
          label: '容量'
        },
        {
          prop: 'remark',
          label: '描述'
        },
        {
          prop: 'createUserName',
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
              <span onClick={() => this.add(params)} class='component' >
                <img
                  src={addImg}
                  width='14px'

                />
                {this.$tc('加入')}
              </span>
            )
          }
        }
      ],
      dataSource: [],
      tableOptions: {
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        serial: true, // 是否支持序号
        mutiSelect: false, // 是否支持列表项选中功能
        height: 'calc(59vh)',
        border: false,
        padding: 'lists',
        expand: true,
        expandContent: (r, { row }) => {
          return (
            <el-form label-position='top' inline class='demo-table-expand'>
              <el-row class=' animate__animated' gutter={20}>
                <el-col
                  style="item.style?item.style:'margin-bottom:10px'"
                  xl={8}
                  lg={8}
                  md={8}
                  sm={8}
                >
                  <el-form-item label={this.$tc('物料高度')}>
                    {' '}
                    <span>{row.height}</span>
                  </el-form-item>
                </el-col>
                <el-col
                  style="item.style?item.style:'margin-bottom:10px'"
                  xl={8}
                  lg={8}
                  md={8}
                  sm={8}
                >
                  <el-form-item label={this.$tc('物料夹取高度')}>
                    <span>{row.materielOffset}</span>
                  </el-form-item>
                </el-col>{' '}
                <el-col
                  style="item.style?item.style:'margin-bottom:10px'"
                  xl={8}
                  lg={8}
                  md={8}
                  sm={8}
                >
                  <el-form-item label={this.$tc('物料运送速度')}>
                    <span>
                      {row.speed === 0 ? '快' : row.speed === 1 ? '中' : '慢'}
                    </span>
                  </el-form-item>
                </el-col>
                <el-col
                  style="item.style?item.style:'margin-bottom:10px'"
                  xl={8}
                  lg={8}
                  md={8}
                  sm={8}
                >
                  <el-form-item label={this.$tc('是否可盖盖子')}>
                    <span>{row.isLid === 0 ? '否' : '是'}</span>
                  </el-form-item>
                </el-col>
                <el-col
                  style="item.style?item.style:'margin-bottom:10px'"
                  xl={8}
                  lg={8}
                  md={8}
                  sm={8}
                >
                  <el-form-item label={this.$tc('是否可封膜')}>
                    <span>{row.isSeal === 0 ? '否' : '是'}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          )
        }
      },
      List: [
        {
          label: '物料型号',
          value: 'modelName'
        },
        {
          label: '物料类型',
          value: 'materielType'
        },
        {
          label: '物料容量',
          value: 'capacity'
        },
        {
          label: '物料高度',
          value: 'height'
        },
        {
          label: '物料夹取高度',
          value: 'materielOffset'
        },
        {
          label: '物料运送速度',
          value: 'speed'
        },
        {
          label: '是否可盖盖子',
          value: 'isLid'
        },
        {
          label: '盖子夹取高度',
          value: 'lidOffset'
        },
        {
          label: '是否可封膜',
          value: 'isSeal'
        },
        {
          label: '添加人',
          value: 'createUserId'
        },
        {
          label: '添加时间',
          value: 'createTime'
        },
        {
          label: '描述',
          value: 'remark'
        }
      ]
    }
  },
  mounted() {
    this.getData(1, 9999)
  },
  methods: {
    add({ row }) {
      this.$emit('addSystem', row)
    },
    getData(pageNumber, pageSize, objs) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        parentId: '0',
        ...objs
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
    },
    handleClose() {
      this.$emit('close', false)
    //   this.$emit('update:tablesShow', false)
    }
  }
}
</script>
<style lang="less">
.systemMaterialTables {
    .el-form-item__content{
        line-height: 0;
    }
  .el-dialog__body {
    height: 652px;
    // overflow: scroll;
  }
  .el-dialog__body {
    padding: 38px 42px !important;
  }
  .table {
    margin-top: 24px;
    .el-table {
      thead tr {
        height: 42px !important;
      }
      th {
        height: auto;
      }
    }
  }
  .el-table__row {
    height: 50px !important;
  }

  .component {
    img {
      width: 14px !important;
    }
  }
  .el-form-item__content{
    font-size: 14px !important;
}
.el-table__body-wrapper,.is-scrolling-none{
    height: 520px !important;
}
}
.dark {
  .systemMaterialTables {
    .el-table th {
      background: rgba(255, 255, 255, 0.08);
       div{
          font-size: 14px;
      }
    }
    .lists .el-table td,
    .lists .el-table th.is-leaf {
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1px 0;
    }
    .el-table__body {
      border-spacing: 0;
    }

    .el-table__row {
      background: #242424 !important;
    }
    .el-row {
    width: 50%;
    margin-left: 109px !important;
    .el-form-item__label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      padding: 0;
    }
  }
    .component {
      img {
        width: 14px !important;
      }

        color: #15dcc6;

    }
  }
}

.white {
  .systemMaterialTables {
       .el-table,  .el-table__expanded-cell,  .el-table th{
           background: transparent;
       }
          .el-table th {
      background: rgba(0, 0, 0, 0.08);
      div{
          font-size: 14px;
      }
    }
    .lists .el-table td,
    .lists .el-table th.is-leaf {
      border: .5px solid rgba(0, 0, 0, 0.2);
      padding: 1px 0;
    }
    .el-table__body {
      border-spacing: 0;
    }

    .el-table__row {
      background: #fff !important;
    }
    .el-row {
    width: 50%;
    margin-left: 109px !important;
    .el-form-item__label {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      padding: 0;
    }
  }
    .component {
      img {
        width: 14px !important;
      }

        color: #00B8A4;

    }
  }
}
</style>
