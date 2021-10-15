<template>
  <div class="loginLog">
    <div class="contents">
      <div class="form" />
      <div class="mainRight">
        <el-date-picker
          v-model="date"
          type="daterange"
          class="daterange"
          :start-placeholder="$t('登录时间起')"
          :end-placeholder="$t('登录时间止')"
          @change="handleCurrentChange(1)"
        />
        <el-input
          v-model="condition1"
          :placeholder="$t('搜索')"
          class="input iptFirst"
          @input="handleCurrentChange(1)"
        >
          <img
            slot="prefix"
            width="16px"
            :src="search"
          >
        </el-input>
      </div>
      <!-- 列表 -->
      <my_table
        ref="comTable"
        :data-source="dataSource"
        :options="tableOptions"
        :page-vo="pageVo"
        :columns="tableColumns"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
      <Add v-if="addShow" :edit-state="editState" :form-data="formDatas" :add-show.sync="addShow" :tree-data="dataSource" @save="save" />
    </div>
  </div>
</template>
<script>
import * as _api from '@/api/system/journal'
import Add from './component/add.vue'
import moment from 'moment'
export const search = localStorage.theme
  ? require('./img/serachdark.png')
  : require('./img/serachWhite.png')
export default {
  components: {
    Add
  },
  data() {
    return {
      search,
      name: '',
      value: '',
      value1: '',
      condition1: '',
      date: [],
      searchForm: {},
      formDatas: {},
      addShow: false,
      editState: 0,
      formData: [
        {
          type: 'label_input',
          placeholder: '请输入登录帐号',
          prop: 'brandCode',
          xl: 6,
          lg: 6,
          md: 6,
          sm: 6

        }, {
          type: 'label_input',
          placeholder: '请输入用户姓名',
          prop: 'brandCode',
          xl: 6,
          lg: 6,
          md: 6,
          sm: 6 },
        {
          type: 'label_date_picker',
          placeholder: '请输入用户姓名',
          prop: 'brandCode',
          xl: 10,
          lg: 10,
          dateType: 'datetimerange',
          md: 10,
          sm: 10 },

        {
          type: 'label_btn',
          btnName: '导出',
          icon: 'el-icon-download',
          handleClick: () => {
            this.formDatas = {}
            this.editState = 0
            this.addShow = true
          },
          xl: 2,
          lg: 2,
          md: 2,
          sm: 2
        }
      ],
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
          prop: 'userName',
          label: '登录账号'
        },
        {
          prop: 'nickName',
          label: '姓名'
        },
        {
          prop: 'component',
          label: '操作时间',
          render: (r, { row }) => {
            return <span>{moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          }
        },
        {
          prop: 'ip',
          label: '登录IP'
        },
        {
          prop: 'icon',
          label: '登录地址',
          render: (r, { row }) => {
            return <span >{ row.ipCountry + row.ipProvince + row.ipCity }</span>
          }
        }

      ],
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
      this.formDatas = Object.assign({}, row)
      this.editState = 0
      this.addShow = true
    },
    edit({ row }) {
      this.formDatas = Object.assign({}, row)
      this.addShow = true
      this.editState = 1
    },
    handleSizeChange(v) {
      this.pageVo.pageSize = v
      this.getData(this.pageVo.currentPage, v)
    },
    // 删除、
    dels({ row }) {
      this.$confirm(this.$tc('确定删除该条数据吗?'), this.$tc('提示'), {
        confirmButtonText: this.$tc('确认'),
        cancelButtonText: this.$tc('取消'),
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
        condition1: this.condition1,
        parentId: '0',
        'categoryOne': '系统',
        'categoryThree': '登录',
        'categoryTwo': '用户管理'
      }
      if (this.date && this.date.length) {
        obj.startTime = moment(this.date[0]).format('YYYY-MM-DD hh:mm:ss')
        obj.endTime = moment(this.date[1]).format('YYYY-MM-DD hh:mm:ss')
      }
      _api.page(obj)
        .then(res => {
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
<style lang="less" scoped>
.contents {
  overflow: hidden;
  margin-top: 0px;
.iptFirst{
    margin-left: 0 !important;
}
  .form {
    float: left;
    width: 70%;
  }
}
</style>

<style lang="less">
.loginLog{
     .input{
        display: inline-flex;
    }
     .daterange{
        margin:0  .75rem;
    }
        .mainRight{
            float: right;
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
    .form {
    text-align: left;
     .el-input,
    .el-input--prefix {
      width: 226px;
      vertical-align: middle;
      margin-left: 12px;
      height: 40px;
      img {
        padding: 12px 15px;
      }
    }
      .el-input--prefix .el-input__inner {
      padding-left: 50px;
      height: 40px;
      vertical-align: top;
    }
}}
.white{
   .loginLog{

     input {
background: #e6e6e9;
    }
 }
}
.dark{
   .loginLog{}
}
</style>
