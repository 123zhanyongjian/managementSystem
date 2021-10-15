<template>
  <div class="dataClass">
    <div class="contents">
      <div class="form">

        <el-button
          type="primary"
          class="btn"
          @click="add"
        > <img
          src="./img/add.png"

          alt=""
        >{{ $t('添加') }}</el-button>
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
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <Add v-if="addShow" :form-data="formDatas" :edit-state="editState" :add-show.sync="addShow" @initialObj="(v)=>initialObj=v" @save="saves" />
  </div>
</template>
<script>
import * as _api from '@/api/dataClass'
import Add from './component/add.vue'
import { editImgs, more, delImgs } from '@/page/workbench/userMaterial/icon'
import { mapGetters } from 'vuex'
export const search = localStorage.theme
  ? require('@/page/workbench/userMaterial/img/serachdark.png')
  : require('@/page/workbench/userMaterial/img/serachWhite.png')
export default {
  name: 'DataClass',
  components: { Add },
  data() {
    return {
      addShow: false,
      styleCode: '',
      modelCode: '',
      search,
      initialObj: '',
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
          label: '数据类型名称',
          sortable: true
        },
        {
          prop: 'remark',
          label: '描述'
        },
        {
          prop: 'isOverlap',
          label: '是否可堆叠',
          render: (r, { row }) => {
            return <span>{row.isOverlap === 1 ? this.$tc('是') : this.$tc('否')}</span>
          }
        },
        {
          prop: 'capacity',
          label: '是否允许列表',
          render: (r, { row }) => {
            return <span>{row.isList === 1 ? this.$tc('是') : this.$tc('否')}</span>
          }
        },
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
        mutiSelect: false, // 是否支持列表项选中功能
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
            `确定<span style='color:rgb(244,118,118)'>删除</span>数据类${item.typeName}`
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
      } else {
        this.editState = 1;
        this.formDatas = Object.assign({}, item);
        this.formDatas.isOverlap = String(this.formDatas.isOverlap)
        this.formDatas.isList = String(this.formDatas.isList)
        this.addShow = true;
      }
    },
    getData(pageNumber = this.pageVo.currentPage, pageSize = this.pageVo.pageSize, objs = { typeName: this.modeVal }) {
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
        }, () => {
          this.formDatas = this.initialObj
        })
        return
      }
      obj.updateName = this.userInfo.user.nickName
      _api.update(obj).then((res) => {
        this.$message.success(res.message)
        this.getData()
        this.addShow = false;
        this.formDatas = {}
      }, () => {
        this.formDatas = this.initialObj
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
.dataClass {
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
  .dataClass {
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
}
.dark {
  .dataClass {
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
}
</style>
