<template>
  <div>
    <div class="resource">
      <div class="form">

        <el-button
          type="primary"
          class="btn"
          @click="add"
        > <img
          src="./img/add.png"
          width="16px"
          alt=""
        >{{ $t('添加') }}</el-button>
      </div>
      <!-- 列表 -->
      <my_table
        ref="comTable"
        :data-source="dataSource"
        :options="tableOptions"
        :page-vo="pageVo"
        :columns="tableColumns"
      />
      <Add v-if="addShow" :edit-state="editState" :form-data="formDatas" :add-show.sync="addShow" :tree-data="dataSource" @save="save" />
    </div>
  </div>
</template>
<script>
import * as _api from '@/api/system/resource'
import { iconList } from '@/utils/lefticon'
import Add from './component/add.vue'
import { editImgs, czmmImgs, moreImg } from '../user/icon'
export default {
  components: {
    Add
  },
  data() {
    return {
      searchForm: {},
      formDatas: {},
      addShow: false,
      editState: 0,
      formData: [
        {
          type: 'label_btn',
          btnName: '添加',
          icon: 'el-icon-plus',
          handleClick: () => {
            this.formDatas = {}
            this.editState = 0
            this.addShow = true
          },
          xl: 1,
          lg: 1,
          md: 1,
          sm: 1
        }
      ],
      status: true,
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
          label: '序号'
        },
        {
          prop: 'name',
          label: '菜单名称'
        },
        {
          prop: 'component',
          label: '组件名称'
        }, {
          prop: 'type',
          label: '组件类型',
          render: (r, { row }) => {
            return <span >{row.type === 1 ? '页面' : row.type === 2 ? '按钮' : '目录'}</span>
          }
        },
        {
          prop: 'icon',
          label: '图标',
          render: (r, { row }) => {
            const flag = iconList.filter(ite => ite.label === row.icon)[0]
            return <img width='24px' src={flag ? flag.value : ''}/>
          }
        },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 110,
          fixed: 'right',
          render: (h, params) => {
            return (
              <div class='operation cursor'>
                <el-dropdown
                  onCommand={(event) => this.dropdown(event, params.row)}
                >
                  <span class='icons' style='font-size:14px;color: #15DCC6;'>
                    <img
                      style=' vertical-align: middle;width: 14px;'
                      src={ moreImg}
                    />{' '}
                  </span>
                  <el-dropdown-menu slot='dropdown'>
                    <el-dropdown-item command='edit'>
                      <img width='14px' src={editImgs} alt='' />
                      &nbsp;{this.$tc('编辑')}
                    </el-dropdown-item>
                    <el-dropdown-item command='del'>
                      <img width='14px' src={czmmImgs} alt='' />
                      &nbsp;{this.$tc('删除')}
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
        mutiSelect: true, // 是否支持列表项选中功能
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
  mounted() {
    this.getData(1, 10)
  },
  methods: {
    // 下拉触发
    dropdown(v, item) {
      if (v === 'edit') {
        // 编辑
        this.edit({ row: item })
        return
      } else if (v === 'del') {
        this.dels({ row: item })
        return
      }
      // 权限设置
      this.settingClick({ row: item })
    },
    // 保存
    save(obj) {
      if (this.editState === 0) {
        _api.add(obj)
          .then(res => {
            this.$message.success(res.message)
            this.getData()
            this.addShow = false
          })
        return
      }
      _api.update(obj)
        .then(res => {
          this.$message.success(res.message)
          this.getData()
          this.addShow = false
        })
    },
    add({ row }) {
      this.formDatas = {}
      this.editState = 0
      this.addShow = true
    },
    edit({ row }) {
      this.formDatas = Object.assign({}, row)
      this.addShow = true
      this.editState = 1
    },
    // 删除、
    dels({ row }) {
      this.$confirm(this.$tc('确定删除该条数据吗?'), this.$tc('提示'), {
        confirmButtonText: this.$tc('确认'),
        cancelButtonText: this.$tc('取消'),
        cancelButtonClass: 'conffirmMessageCancle',
        customClass: 'miniMessage'
      })
        .then(() => {
          _api.deletes({ id: row.id })
            .then(res => {
              this.$message.success(res.message)
              // 判断是否是本页最后一条
              if (this.dataSource.length === 1) {
                this.handleCurrentChange(this.pageVo.currentPage - 1)
                return
              }
              this.getData()
            })
        })
        .catch(() => {

        })
    },
    getData(pageNumber = this.pageVo.currentPage, pageSize = this.pageVo.pageSize) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        parentId: '0'
      }
      _api.tree(obj)
        .then(res => {
          this.dataSource = res.data
        //   this.tableOptions.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
 .form {
    float: left;
    width: 70%;
    text-align: left;
  }
  .btn{
      height: 2.375rem;
      font-size: 14px;
  }
</style>
