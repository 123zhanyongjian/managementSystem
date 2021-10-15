<template>
  <div class="role">
    <div class="contents">
      <div class="form">

        <el-button
          type="primary"
          class="btn"
          @click="add"
        > <img
          src="./img/add.png"
          width="16px"
          alt=""
        >{{ $t('添加用户') }}</el-button>
      </div>
      <div class="mainRight">
        <el-input
          v-model="searchForm.name"
          :placeholder="$t('搜索')"
          clearable
          class="input"
          @input="getData(1,10)"
        >
          <img
            slot="prefix"
            width="16px"
            :src="search"
          >
        </el-input>
      </div>
    </div>
    <!-- 列表 -->
    <my_table
      v-if="list"
      ref="comTable"
      :data-source="dataSource"
      :options="tableOptions"
      :page-vo="pageVo"
      :columns="tableColumns"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    />

    <!-- 视图 -->
    <el-row
      v-if="!list"
      class="view"
      :gutter="24"
    >
      <el-col
        v-for="so in 4"
        :key="so"
        :span="6"
        :xs="6"
        :sm="6"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-card class="box-card">
          <div>
            <span class="title">标题</span>
          </div>
          <div>
            <span class="time">2019-01-10 <span class="times">11:04:36</span></span>
          </div>
          <div class="mt15 ">
            <span class="status">Not compiled</span>
            <span class="method">
              <img
                :src="by"
                alt=""
              >
              <span>Compile</span>
            </span>
            <!-- <span></span> -->
            <div class="clear" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      v-if="!list"
      id="common-pagination"
      background
      :current-page.sync="pageVo.currentPage"
      :page-sizes="[15, 30, 50, 100]"
      :page-size="pageVo.pageSize"
      layout=" prev, pager, next"
      :total="pageVo.total"
      @handleCurrentChange="handleCurrentChange"
    />
    <Add
      v-if="addShow"
      :edit-state="editState"
      :form-data="formDatas"
      :add-show.sync="addShow"
      :check-array="checkArray"
      @save="save"
    />
    <Tree
      v-if="treeShow"
      :role-name="roleName"
      :check-array="checkArray"
      :tree-show.sync="treeShow"
      @save="saves"
    />
  </div>
</template>
<script>
import * as _api from '@/api/system/role'
import Add from './component/add.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Tree from './component/trees.vue'
import { search, delImgs, editImgs, moreImg, setImg } from './icon'
export default {
  name: 'Role',
  components: { Add, Tree },
  data() {
    return {
      search,
      name: '',
      roleName: '',
      formDatas: {},
      addShow: false,
      treeShow: false,
      checkArray: [],
      searchForm: {},
      by: require('./img/by.png'),
      setting: require('./img/setting.png'),
      list: true,
      status: true,
      formData: [
        {
          type: 'label_input',
          placeholder: '请输入',
          prop: 'name',
          xl: 10,
          lg: 10,
          md: 10,
          sm: 10,
          slotType: 'prefix',
          slotText:
            '<i slot="prefix" class="el-input__icon el-icon-search"></i>'
        },
        {
          type: 'label_btn',
          btnName: '查询',
          icon: 'el-icon-search',
          handleClick: () => {
            this.getData(1, 10)
          },
          xl: 1,
          lg: 1,
          md: 1,
          sm: 1
        },
        {
          type: 'label_slot',
          slot: true,
          xl: 4,
          lg: 4,
          md: 4,
          sm: 4
        }
      ],
      // 表格分页
      pageVo: {
        total: 30,
        status: true,
        pageSize: 10,
        currentPage: 1
      },
      // 表格参数配置
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
      datas: {},
      // 表格展示的列
      tableColumns: [
        {
          prop: 'name',
          label: '角色名称',
          sortable: true
        },
        {
          prop: 'code',
          label: '角色编码'
        },
        {
          prop: 'remark',
          label: '角色描述'
        },
        {
          prop: 'createUserId',
          label: '创建人'
        },
        {
          prop: 'createTime',
          label: '创建日期',
          render: (r, { row }) => {
            return (
              <span>
                {row.createTime ? moment(row.createTime).format('YYYY-MM-DD hh:mm:ss') : ''}
              </span>
            )
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
                    <el-dropdown-item command='assign'>
                      <img width='14px' src={setImg} alt='' />
                      &nbsp;{this.$tc('权限设置')}
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
      ]
    }
  },

  computed: {
    ...mapGetters(['theme'])
  },
  mounted() {
    this.getData(1, 10)
    console.log(this.pageVo)
  },
  methods: {
    handleSizeChange(v) {
      this.pageVo.pageSize = v
      this.getData(this.pageVo.currentPage, v)
    },
    // 下拉触发
    dropdown(v, item) {
      if (v === 'edit') {
        // 编辑
        this.edit({ row: item })
        // 权限设置
        this.settingClick({ row: item }, 'eidt')
        return
      } else if (v === 'del') {
        this.$confirm(
          this.$tc(
            `<span style='color:${localStorage.theme ? '#fff' : '#000'}'>确定</span><span style='color:rgb(244,118,118)'>删除</span>${item.name}`
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
              this.getData(this.pageVo.currentPage, this.pageVo.pageSize)
            })
          })
          .catch(() => {})
        return
      }
      // 权限设置
      this.settingClick({ row: item })
    },
    // 保存
    save(obj) {
      if (this.editState === 0) {
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
    // 报存权限
    saves(resourceIds) {
      this.datas.resourceIds = resourceIds
      _api.update(this.datas).then((res) => {
        this.$message.success(res.message)
        this.getData()
        this.treeShow = false
      })
    },
    settingClick({ row: { id }}, type) {
      _api.query({ id }).then(({ data }) => {
        this.datas = data
        this.checkArray = data.resourceIds
        if (type) {
          return
        }
        this.roleName = data.name
        this.treeShow = true
      })
    },
    handleCurrentChange(v) {
      this.getData(v, this.pageVo.pageSize)
    },
    getData(pageNumber = this.pageVo.currentPage, pageSize = this.pageVo.pageSize) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        name: this.searchForm.name
      }
      _api.page(obj).then((res) => {
        this.dataSource = res.data
        this.pageVo.total = res.total
        this.datas = {}
        this.$refs.comTable.doLayout()
        //   this.tableOptions.loading = false
      })
    },
    add({ row }) {
      this.formDatas = Object.assign({}, row)
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
        cancelButtonText: this.$tc('取消')
      })
        .then(() => {
          _api.deletes({ id: row.id }).then((res) => {
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
    }
  }
}
</script>
<style scoped lang="less">
.btn{
   height:38px;vertical-align:top
}

.operation {
  img {
    vertical-align: middle;
    width: 14px;
  }
}
.contents {
  overflow: hidden;
  margin-top: 0px;
  .btns {
    float: right;
    margin-top: 6px;
    width: 28%;

    text-align: right;
  }
  .form {
    float: left;
    width: 70%;
  }
}
.mainRight{
    float: right;
}
.borders {
  border: none;
  color: #fff;
  background-color: rgb(48, 48, 48);
}
.borders1 {
  border: none;
  color: #000;
  background-color: rgb(231, 233, 235);
}
.view {
  height: calc(77.3vh);
}
</style>
<style lang="less" >
.role{
 .el-dialog__body {
    padding: 2.125rem 1.25rem 0 2.625rem;
}
}
</style>

<style lang="less">
.role {

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
    .input {
      height: 38px;
      vertical-align: top;
    }
    }
  .form {
    text-align: left;

    .el-button {
      font-size: 14px;
      img {
        margin-right: 17px;
      }
    }
  }
}
.white {
  .role {

      input {
        background: #e6e6e9;
      }

  }
}
.dark {
  .role {
  }
}
</style>
