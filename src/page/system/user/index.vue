<template>
  <div class="user">
    <div class="contents">
      <div class="form">

        <el-button v-hasPermiss="'add'" type="primary" class="btn addbtn" @click="add({roleIds:[]})"> <img src="./img/add.png" width="16px" alt="">{{ $t('添加用户') }}</el-button>
      </div>
      <div class="mainRight">
        <el-input
          v-model="searchForm.nickName"
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
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <Add
      v-if="addShow"
      :edit-state="editState"
      :form-data="formDatas"
      :add-show.sync="addShow"
      @save="save"
    />
    <Jurisdiction
      v-if="treeShow"
      :user-name="userName"
      :check-array="checkArray"
      :tree-show.sync="treeShow"
      @save="saves"
    />
  </div>
</template>
<script>
import * as _api from '@/api/system/user'
import Add from './component/add.vue'
import { mapGetters } from 'vuex'
import Jurisdiction from './component/jurisdiction.vue'
import { search, editImgs, userImg, czmmImgs, moreImg } from './icon'
export default {
  name: 'Role',
  components: { Add, Jurisdiction },
  data() {
    return {
      search,
      name: '',
      formDatas: {},
      addShow: false,
      userName: '',
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
          prop: 'brandCode',
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
          prop: 'nickName',
          label: '姓名',
          sortable: true

        },
        {
          prop: 'userName',
          label: '登录账号',
          sortable: true

        },
        // {
        //   prop: 'phoneNumber',
        //   label: '手机号'
        // },
        // {
        //   prop: 'createUserId',
        //   label: '职位'
        // },
        {
          prop: 'roleName',
          label: '角色'
        },
        {
          prop: 'status',
          label: '状态',
          sortable: true,
          render: (h, { row }) => {
            return (
              <span class={row.status === 2 ? 'normal' : 'disable'}>
                {row.status === 2 ? this.$t('正常') : this.$t('禁用')}
              </span>
            )
          }
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 120,
          fixed: 'right',
          render: (h, params) => {
            const directives = [
              {
                name: 'hasPermiss',
                value: 'edit'
              }
            ]
            return (

              <div class='operation cursor'>
                <el-dropdown
                  onCommand={(event) => this.dropdown(event, params.row)}
                >
                  <span class='icons' style='font-size:14px;color: #15DCC6'>
                    <img
                      style=' vertical-align: middle;width: 14px;'
                      src={ moreImg}
                    />{' '}
                  </span>
                  <el-dropdown-menu slot='dropdown'>
                    <el-dropdown-item command='edit' {...{ directives }}>
                      <img width='14px' src={editImgs} alt='' />
                      &nbsp;{this.$tc('编辑')}
                    </el-dropdown-item>
                    <el-dropdown-item command='assign'>
                      <img width='14px' src={userImg} alt='' />
                      &nbsp;{params.row.status === 2 ? this.$tc('禁用') : this.$tc('启用')}
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
    // 保存
    save(obj) {
      const objs = {
        ...obj
      }
      objs.roleIds = [objs.roleIds]
      if (this.editState === 0) {
        _api.add(objs).then((res) => {
          this.$message.success(res.message)
          this.getData()
          this.addShow = false
        })
        return
      }
      if (this.editState === 1) {
        _api.update(objs).then((res) => {
          this.$message.success(res.message)
          this.getData()
          this.addShow = false
        })
        return
      }
      _api.reset({ id: obj.id, password: obj.password }).then((res) => {
        this.$message.success(res.message)
        this.getData()
        this.addShow = false
      })
    },
    //
    saves(roleIds) {
      this.datas.roleIds = roleIds
      _api.update(this.datas).then((res) => {
        this.$message.success(res.message)
        this.getData()
        this.treeShow = false
      })
    },
    settingClick({ row: { id }}) {
      _api.query({ id }).then(({ data }) => {
        this.datas = data
        this.checkArray = data.roleIds
        this.userName = data.nickName
        this.treeShow = true
      })
    },
    // 下拉触发
    dropdown(v, item) {
      item.visible = false
      if (v === 'edit') {
        // 编辑
        this.edit({ row: item }, 1)
        return
      }
      // 重命名
      if (v === 'assign') {
        this.stateChange(item)
        return
      }
      // 重置密码
      //   this.edit({ row: item }, 2)
      // 删除
      this.$confirm(
        this.$tc(
          `<span class="tip">${this.$tc('确定')}<span style='color:#FF5D75'>${ this.$tc('删除') }</span>${this.$tc('账号')}<span style='color:#15DCC6'>${item.userName}</span></span>`
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
    },
    handleCurrentChange(v) {
      this.pageVo.currentPage = v
      this.getData(v, this.pageVo.pageSize)
    },
    getData(pageNumber = this.pageVo.currentPage, pageSize = this.pageVo.pageSize) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        condition1: this.searchForm.nickName
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
    edit({ row }, stateus) {
      row.roleIds = row.roleId
      this.formDatas = Object.assign({}, row)
      this.addShow = true
      this.editState = stateus
    },
    // 状态修改
    stateChange(row) {
      let status
      if (row.status === 2) {
        status = 4
      } else {
        status = 2
      }
      this.$confirm(
        this.$tc(
          `<span class='tip'>${this.$tc('确定')}<span style='color:${localStorage.theme ? '#15DCC6' : '#00B8A4'}'>${status === 2 ? this.$tc('启用') : this.$tc('禁用')}</span>${this.$tc('账号')}<span style='color:${localStorage.theme ? '#15DCC6' : '#00B8A4'}'>${row.userName}</span></span>`
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
          _api.status({ id: row.id, status }).then((res) => {
            this.$message.success(res.message)

            this.getData(this.pageVo.currentPage, this.pageVo.pageSize)
          })
        })
        .catch(() => {})
    },
    // 删除、
    dels({ row }) {
      this.$confirm(this.$tc('确定删除该条数据吗?'), this.$tc('提示'), {
        confirmButtonText: this.$tc('确认'),
        cancelButtonText: this.$tc('取消'),
        customClass: 'miniMessage'
      })
        .then(() => {
          _api.deletes({ id: row.id }).then((res) => {
            this.$message.success(res.message)
            // 判断是否是本页最后一条
            console.log(this.dataSource)
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
.addbtn{
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
.user{
 .el-dialog__body {
    padding: 2.125rem 1.25rem 0 2.625rem;
}
}
</style>
<style lang="less">
.user {
    .mainRight{
        float: right;
 .el-input,
    .el-input--prefix {
      width: 226px;
      height: 38px;
       img{
        padding: 12px 15px;

    }
    }
    .el-input--prefix .el-input__inner{
        padding-left: 50px;
        height: 38px;
        vertical-align:top
    }
    .input{
        height: 38px;
        vertical-align:top
   }
    }
  .form {
      text-align: left;

   .el-button{
       font-size: 14px;
       img{
           margin-right:17px
       }
   }
  }
}
.white {
    .el-message-box__message{
        .tip{
            color: #000;
        }
    }

  .user {

    //    .form {

      input{
          background: #E6E6E9;
      }
    //    }

  }
  .normal{
      width: 98px;
height: 26px;
line-height: 26px;
background: rgb(229, 247, 245);
border-radius: 13px;
color: #00B8A4;
font-size: 12px;
display: inline-block;

  }
  .disable{
         width: 98px;
height: 26px;
line-height: 26px;
background: rgb(255, 239, 241);
border-radius: 13px;
color: #F03C3C;
font-size: 12px;
display: inline-block;
  }
}
.dark {
.el-message-box__message{
        .tip{
            color: #fff;
        }
    }
  .user {

        .normal{
      width: 98px;
height: 26px;
line-height: 26px;
background: rgb(45, 61, 59);
border-radius: 13px;
color: #15DCC6;
font-size: 12px;
display: inline-block;

  }
  .disable{
         width: 98px;
height: 26px;
line-height: 26px;
background: rgb(63, 51, 53);
border-radius: 13px;
color: #FF647B;
font-size: 12px;
display: inline-block;
  }
  }
}
</style>
