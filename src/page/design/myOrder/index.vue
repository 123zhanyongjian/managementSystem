<template>
  <div class="myOrder">
    <div class="contents">
      <div class="form">

        <el-button
          type="primary"
          class="btn"
          @click="add"
        > <img
          src="./img/add.png"

          alt=""
        >{{ $t('新建订单') }}</el-button>
        <!-- <el-button
          type="primary"
          class="btn btn_files"
          @click="tablesShow=true"
        ><img
          src="@/assets/img/add.png"

          alt=""
        >{{ $t('批量订单') }}</el-button> -->
      </div>
      <div class="mainRight">
        <el-input
          v-model="modeVal"
          clearable
          :placeholder="$t('搜索')"
          class="input "
          @input="getData(1,10,{typeName:modeVal})"
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
        :columns="tableColumns"
        @handleRowClick="handleRowClick"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <Add v-if="addShow" :form-data="formDatas" :edit-state="editState" :add-show.sync="addShow" @save="saves" />

    <Details v-if="detailsShow" :details-show.sync="detailsShow" />
    <ProcessPreview v-if="craftShow" :craft-show.sync="craftShow" />

  </div>
</template>
<script>
import * as _api from '@/api/design/myOrder'
import Add from './component/add.vue'
import ProcessPreview from './component/processPreview.vue'
import Details from './component/details.vue'
import { editImgs, more, delImgs, viewImgs, sbtImgs } from '@/page/workbench/userMaterial/icon'
import { mapGetters } from 'vuex'
export const search = localStorage.theme
  ? require('@/page/workbench/userMaterial/img/serachdark.png')
  : require('@/page/workbench/userMaterial/img/serachWhite.png')
export default {
  name: 'DataClass',
  components: { Add, Details, ProcessPreview },

  data() {
    return {
      detailsShow: false,
      craftShow: false,
      addShow: false,
      styleCode: '',
      modelCode: '',
      search,
      modeVal: '',
      idx: 0,
      name: '',
      typeVal: '',
      value1: '',
      searchForm: {},
      formDatas: {},
      modeList: [],
      typeList: [],
      tablesShow: false,
      // 表格分页
      pageVo: {
        total: 30,
        status: true,
        pageSize: 10,
        currentPage: 1
      },
      tableColumns: [
        {
          prop: 'typeName',
          label: '订单名称'

        },
        {
          prop: 'isOverlap',
          label: '订单号'

        },
        {
          prop: 'remark',
          label: '工艺',
          sortable: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          sortable: true

        },
        {
          prop: 'updateTime',
          label: '更新时间',
          sortable: true

        },
        {
          prop: 'isOverlap',
          label: '订单状态',
          headSelect: [ // 下拉菜单
            {
              label: '审核中',
              value: 1
            },
            {
              label: '未通过',
              value: 2
            },
            {
              label: '待提交',
              value: 3
            },
            {
              label: '已通过',
              value: 4
            },
            {
              label: '已完成',
              value: 5
            }
          ],
          handleCommand: (e) => { // 触发回调
            console.log(e)
          },
          render: (r, { row }) => {
            return <span class={
              row.isOverlap === 1
                ? 'stock'
                : row.isOverlap === 1
                  ? 'Reserved'
                  : row.isOverlap === 0
                    ? 'use'
                    : ''
            }>{row.isOverlap === 1 ? this.$tc('审核中') : row.isOverlap === 1 ? this.$tc('待提交') : row.isOverlap === 0 ? this.$tc('未通过') : ''}</span>
          }
        },
        {
          prop: 'isOverlap',
          label: '绑定任务',
          sortable: true
        },
        // {
        //   prop: 'capacity',
        //   label: '下单时间',
        //   render: (r, { row }) => {
        //     return <span>{row.isList === 1 ? this.$tc('是') : this.$tc('否')}</span>
        //   }
        // },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 160,
          fixed: 'right',
          render: (h, params) => {
            return (
              <div class='operation cursor'>
                <el-dropdown
                  onCommand={(event) => this.dropdown(event, params.row)}
                >
                  <span class='icons'>
                    <img
                      style=' vertical-align: middle;width: 14px;'
                      src={ more}
                    />{' '}
                  </span>
                  <el-dropdown-menu slot='dropdown'>
                    <el-dropdown-item command='see'>
                      <img width='14px' src={viewImgs} alt='' />
                      &nbsp;{this.$tc('查看')}
                    </el-dropdown-item>
                    <el-dropdown-item command='sbt'>
                      <img width='14px' src={sbtImgs} alt='' />
                      &nbsp;{this.$tc('提交')}
                    </el-dropdown-item>
                    <el-dropdown-item command='edit'>
                      <img width='14px' src={editImgs} alt='' />
                      &nbsp;{this.$tc('编辑')}
                    </el-dropdown-item>
                    <el-dropdown-item command='del'>
                      <img width='14px' src={delImgs} alt='' />
                      &nbsp;{this.$tc('删除')}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            )
          }
        }
      ],
      tableOptions: {
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        serial: false, // 是否支持序号
        mutiSelect: true, // 是否支持列表项选中功能
        height: 'calc(77.3vh)',
        border: false,
        padding: 'lists'
      },
      dataSource: [

      ],

      editState: 0,
      btnList: ['系统物料库'
        //    '类型管理', '型号管理'
      ]

    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getData(1, 10)
  },
  methods: {
    handleSizeChange(v) {
      this.pageVo.pageSize = v
      this.getData(this.pageVo.currentPage, v)
    },
    dropdown(event, item) {
      if (event === 'del') {
        this.$confirm(
          this.$tc(
            `确定<span style='color:rgb(244,118,118)'>删除</span>数据类${item.type}`
          ),
          this.$tc('提示'),
          {
            confirmButtonText: this.$tc('确认'),
            cancelButtonText: this.$tc('取消'),
            customClass: 'miniMessage',
            dangerouslyUseHTMLString: true,
            cancelButtonClass: 'conffirmMessageCancle'
          }
        )
          .then(() => {
            _api.deletes({ id: item.id }).then((res) => {
              this.$message.success(res.message)
              // 判断是否是本页最后一条
              if (this.dataSource.length === 1) {
                this.handleCurrentChange(this.pageVo.currentPage - 1)
                return
              }
              this.getData()
            })
          })
          .catch(() => {})
      } else if (event === 'see') {
        this.detailsShow = true
      } else if (event === 'sbt') {
        alert('提交')
      } else {
        this.editState = 1;
        this.formDatas = Object.assign({}, item);
        this.formDatas.isOverlap = String(this.formDatas.isOverlap)
        this.formDatas.isList = String(this.formDatas.isList)
        this.addShow = true;
      }
    },
    getData(pageNumber = 1, pageSize = 10, objs) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        userId: this.userInfo.id,
        parentId: '0',
        ...objs
      }
      _api.page(obj).then((res) => {
        this.dataSource = res.data
        this.pageVo.total = res.total
        console.log(res)
        //   this.tableOptions.loading = false
      })
    },
    // 切换
    changeCheck(index) {
      this.idx = index
    },
    // 保存
    save(obj) {
      if (this.editState === 0) {
        obj.createUserId = this.userInfo.id
        _api.add(obj).then((res) => {
          this.$message.success(res.message)
          this.getData()
          this.addShow = false
        })
        return
      }
      _api.update(obj).then((res) => {
        this.$message.success(res.message)
        this.getData()
        this.addShow = false
      })
    },
    add({ row }) {
      //   this.formDatas = Object.assign({}, row)
      this.editState = 0
      this.addShow = true
    },
    edit(row) {
      this.formDatas = Object.assign({}, row)
      this.addShow = true
      this.editState = 1
    },
    // 工艺预览
    handleRowClick(row, col) {
      console.log(col.label)

      if (col.label === '工艺') {
        this.craftShow = true
      }
    },
    // 薪增 更新
    saves(obj) {
      obj.createUserId = this.userInfo.id

      if (this.editState === 0) {
        obj.createName = this.userInfo.user.nickName
        _api.add(obj).then((res) => {
          this.$message.success(res.message)
          this.getData()
          this.addShow = false;

          this.formDatas = {}
        })
        return
      }
      obj.updateName = this.userInfo.user.nickName
      _api.update(obj).then((res) => {
        this.$message.success(res.message)
        this.getData()
        this.addShow = false;
        this.formDatas = {}
      })
    },
    // 分页查询
    handleCurrentChange(v) {
      this.pageVo.currentPage = v
      this.getData(v, this.pageVo.pageSize)
    }

  }
}
</script>
<style lang="less" scoped>
.contents {
  overflow: hidden;
  margin-top: 0px;
  .iptFirst {
    margin-left: 0 !important;
  }
  .form {
    float: left;
    // width: 70%;
  }
}
</style>

<style lang="less">
.myOrder {
    .mainRight{
    .el-input,
    .el-input--prefix {
      width: 226px;
      height: 38px;
      img {
        padding: 12px 15px;
      }
    }
      .el-input--prefix .el-input__inner {
      padding-left: 50px;
      height: 38px;
      vertical-align: top;
    }
    }
    .btn{
         font-size: 14px !important;
       ;height:38px;vertical-align:top;
        img{
            margin-right: 10px;
            width: 14px;

        }
    }
     .btn:hover{
         font-size: 14px;
     }
    .mainRight{
        float: right;

    }
    .el-button{
        font-size: 16px;
        padding:13px 15px 15px;
    }
  .form {
    text-align: left;
    .el-input,
    .el-input--prefix {
      width: 226px;
      vertical-align: middle;
    //   margin-left: 12px;
      height: 38px;
      img {
        padding: 12px 15px;
      }
    }
    .el-input--prefix .el-input__inner {
      padding-left: 50px;
      height: 38px;
      vertical-align: top;
    }
    .first{
            // margin-left: 10px;
        }
  }
}

.white {
  .myOrder {
    .btn_files {
      border: 1px solid #00b8a4;
    }
    input {
      background: #e6e6e9;
    }
    .unCheck{
        background: rgba(0, 0, 0, .06);
    }
  }
        .stock{
min-width: 98px;
height: 26px;
background: rgba(0, 184, 164, 0.1);
color: #999999;
line-height: 26px;
border-radius: 13px;
display: inline-block;
// opacity: 0.1;
  }
  .Reserved{
   min-width: 98px;
height: 26px;
background:rgba(0, 184, 164, 0.1);
color: #F4810E;
line-height: 26px;
border-radius: 13px;
display: inline-block;
  }
  .use{
      min-width: 98px;
height: 26px;
background:rgba(0, 184, 164, 0.1);
color: #FF647B;
line-height: 26px;
border-radius: 13px;
display: inline-block;
  }
}
.dark {
  .myOrder {
       .btn_files {
      border: 1px solid #15DCC6;
;
    }
     .unCheck{
        background: rgba(255, 255, 255, 0.06);
        border: none;
        color: rgba(255, 255, 255, .8);
    }
  }

        .stock{
min-width: 98px;
height: 26px;
background: #444444;
color: #999999;
line-height: 26px;
border-radius: 13px;
display: inline-block;
// opacity: 0.1;
  }
  .Reserved{
   min-width: 98px;
height: 26px;
background:#444444;
color: #F4810E;
line-height: 26px;
border-radius: 13px;
display: inline-block;
  }
  .use{
      min-width: 98px;
height: 26px;
background:#3F3335;
color: #FF5D75;
line-height: 26px;
border-radius: 13px;
display: inline-block;
  }
}
</style>
