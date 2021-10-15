<template>
  <div class="orderApproval">
    <div class="contents">
      <div class="form">

        <el-button
          type="primary"
          class="btn"
          @click="add"
        >{{ $t('待审批') }}</el-button>
        <el-button
          type="primary"
          class="btn"
          @click="add"
        >{{ $t('已部署') }}</el-button>

      </div>
      <div class="mainRight">
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="选择日期"
        />
        <el-date-picker
          v-model="value1"
          class="marginSelect"
          type="date"
          placeholder="选择日期"
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
      <Add
        v-if="addShow"
        :edit-state="editState"
        :form-data="formDatas"
        :add-show.sync="addShow"
        :tree-data="dataSource"
        @save="save"
      />
    </div>
  </div>
</template>
<script>
import * as _api from '@/api/system/journal'
export const search = localStorage.theme
  ? require('./img/serachdark.png')
  : require('./img/serachWhite.png')
import Add from './component/add.vue'
import moment from 'moment'
import {
  more,
  tz,
  zt,
  cs,
  tg
} from '../exceptionInformation/icon'
export default {
  components: {
    Add
  },
  data() {
    return {
      search,
      value: '',
      condition1: '',
      date: [],
      arr: [],
      arr1: [],
      value1: '',
      label: '',
      label1: '',
      searchForm: {},
      formDatas: {},
      addShow: false,
      editState: 0,
      formData: [
        {
          type: 'label_input',
          placeholder: '请输入登录帐号',
          prop: 'userName',
          xl: 6,
          lg: 6,
          md: 6,
          sm: 6
        },
        {
          type: 'label_input',
          placeholder: '请输入用户姓名',
          prop: 'nickName',
          xl: 6,
          lg: 6,
          md: 6,
          sm: 6
        },
        {
          type: 'label_date_picker',
          prop: 'createTime',
          xl: 10,
          lg: 10,
          dateType: 'datetimerange',
          md: 10,
          sm: 10
        },

        {
          type: 'label_btn',
          btnName: '导出',
          icon: 'el-icon-download',
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
        status: true,
        pageSize: 10,
        currentPage: 1
      },
      tableColumns: [
        {
          prop: 'userName',
          label: '订单名称',
          sortable: true
        },
        {
          prop: 'nickName',
          label: '工艺',
          sortable: true
        }, {
          prop: 'nickName',
          label: '用户'
        }, {
          prop: 'nickName',
          label: '提交时间'
        }, {
          prop: 'nickName',
          label: '预约时间'
        }, {
          prop: 'nickName',
          label: '工艺',
          form: true,
          type: 'label_checkbox'
        }, {
          prop: 'nickName',
          label: '物料',
          form: true,
          type: 'label_checkbox'
        }, {
          prop: 'nickName',
          label: '数据',
          form: true,
          type: 'label_checkbox'
        },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 106,
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
                      src={more}
                    />{' '}
                  </span>
                  <el-dropdown-menu slot='dropdown'>
                    <el-dropdown-item command='edit' style={{ 'display': params.row.nodeType === 1 ? 'none' : '' }}>
                      <img width='14px' src={tz} alt='' />
                      &nbsp;{this.$tc('跳转到设备管理')}
                    </el-dropdown-item>
                    <el-dropdown-item command='duplication' style={{ 'display': params.row.nodeType === 1 ? 'none' : '' }}>
                      <img width='14px' src={cs} alt='' />
                      &nbsp;{this.$tc('重试步骤')}
                    </el-dropdown-item>
                    <el-dropdown-item command='del'>
                      <img width='14px' src={tg} alt='' />
                      &nbsp;{this.$tc('跳过步骤')}
                    </el-dropdown-item>
                    <el-dropdown-item command='del'>
                      <img width='14px' src={zt} alt='' />
                      &nbsp;{this.$tc('暂停任务')}
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

      ]
    }
  },
  mounted() {
    this.getData(1, 10)
    this.getSelectData()
  },
  methods: {
    getSelectData(parentId = 10) {
      const obj = {
        parentId,
        'isContainParent': 0,
        'isDeptLimit': 1
      }
      _api.tree(obj)
        .then(res => {
          if (parentId === 10) {
            this.arr = res.data
          } else {
            this.arr1 = res.data
          }
        })
    },
    // 下拉筛选
    handleChange(v) {
      // 每次选择清空后一项
      this.arr1 = []
      this.value1 = ''
      this.getSelectData(v)
      // 查询列表
      if (!v) {
        this.label = ''
        this.getData(1, this.pageVo.pageSize)
        return
      }

      this.label = this.arr.find(item => item.id === v).name
      this.getData(1, this.pageVo.pageSize, this.condition1, this.arr.find(item => item.id === v).name)
    },
    handleChange1(v) {
      if (!v) {
        this.label1 = ''
        this.getData(1, this.pageVo.pageSize, this.condition1, this.arr.find(item => item.id === this.value).name)

        return
      }
      this.label1 = this.arr1.find(item => item.id === v).name
      this.getData(1, this.pageVo.pageSize, this.condition1, this.arr.find(item => item.id === this.value).name, this.arr1.find(item => item.id === v).name)
    },
    handleSizeChange(v) {
      this.pageVo.pageSize = v
      this.getData(this.pageVo.currentPage, v)
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
        cancelButtonText: this.$tc('取消'),
        customClass: 'miniMessage'
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
    },
    // 获取列表数据
    getData(pageNumber = this.pageVo.currentPage, pageSize = this.pageVo.pageSize, condition1 = this.condition1, categoryTwo = this.label, categoryThree = this.label1) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        parentId: '0',
        condition1,
        categoryTwo,
        categoryThree
      }
      if (this.date && this.date.length) {
        obj.startTime = moment(this.date[0]).format('YYYY-MM-DD hh:mm:ss')
        obj.endTime = moment(this.date[1]).format('YYYY-MM-DD hh:mm:ss')
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
<style lang="less" scoped>
.contents {
  overflow: hidden;
  margin-top: 0px;
.iptFirst{
    margin-left: 0 !important;
}
  .form {
    float: left;
    // width: 70%;
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
</style>

<style lang="less">
.orderApproval{
    .marginSelect{
        margin: 0 12px;
    }
    .input,.el-input{
        display: inline-flex;
    }
    .daterange{
        margin-left: .75rem;
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
        .el-button > span{
            margin-top: 0;
        }
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
   .orderApproval{

     input {
background: #e6e6e9;
    }
 }
}
.dark{
   .orderApproval{}
}
</style>
