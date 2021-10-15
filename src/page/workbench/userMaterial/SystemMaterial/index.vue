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
      @handleSizeChange="handleSizeChange"
    />
    <Add
      v-if="dialogVisible"
      ref="addDialog"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <!-- 样品材料添加 -->
    <Adds v-if="AddsShow" :edit-state="3" :form-data="formData" :user-id="userInfo.id" :add-show.sync="AddsShow" @initialObj="(v)=>initialObj=v" @changeFromData="changeFromData" @save="save" />

    <Details v-if="detailsShow" :form-datas="formDatas" :details-show.sync="detailsShow" />
    <Tables v-if="tablesShow" :tables-show="tablesShow" @close="close" @addSystem="addSystem" />
  </div>
</template>
<script>
import Add from './component/add.vue'
import Adds from '@/page//materialLibrary/sampleMaterial/component/add.vue'
import Details from './component/details.vue'
import Tables from './component/tables.vue'
import { mapGetters } from 'vuex'
import * as _api from '@/api/userMaterial/SystemMaterial'
import * as _api1 from '@/api/materialLibrary/sampleMaterial'
const img = require('../img/aba.jpg')
import {
  viewImgs,
  editImgs,
  copyImgs,
  delImgs,
  more
} from '../icon'
export default {
  components: {
    Add,
    Details,
    Tables,
    Adds
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tablesShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      initialObj: '',
      AddsShow: false,
      detailsShow: false,
      addShow: true,
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
          width: 80
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
          prop: 'capacitys',
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
          width: 106,
          fixed: 'right',
          render: (h, params) => {
            return (
              <div class='operation cursor'>
                <span
                  onClick={() => this.lookDetails(params.row)}
                  class='icons fisrts'
                >
                  <img
                    style=' vertical-align: middle;width: 14px;'
                    src={viewImgs}
                  />{' '}
                </span>
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
                    <el-dropdown-item command='duplication' style={{ 'display': params.row.nodeType === 1 ? 'none' : '' }}>
                      <img width='14px' src={copyImgs} alt='' />
                      &nbsp;{this.$tc('副本')}
                    </el-dropdown-item>
                    <el-dropdown-item command='del'>
                      <img width='14px' src={delImgs} alt='' />
                      &nbsp;{this.$tc('删除')}
                    </el-dropdown-item>
                    <el-dropdown-item command='add' style={{ 'display': params.row.nodeType === 1 ? 'none' : '' }}>
                      <img width='14px' src={editImgs} alt='' />
                      &nbsp;{this.$tc('添加物料')}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            )
          }
        }
      ],
      formDatas: {},
      formData: {},
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
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getData(1, 10)
    // this.$store.commit('ROUTER_LEFT', '系统物料库')
  },
  methods: {
    handleSizeChange(v) {
      this.pageVo.pageSize = v
      this.getData(this.pageVo.currentPage, v)
    },
    // 关闭弹窗
    close(v) {
      this.$parent.tablesShow = v
    },
    addSystem(row) {
      const ros = Object.assign({}, row)
      delete ros.id
      delete ros.createUserId
      this.$parent.editState = 0
      this.$emit('saves', ros)
    },
    dropdown(event, item) {
      if (event === 'del') {
        this.$confirm(
          this.$tc(
            `确定<span style='color:rgb(244,118,118)'>删除</span>物料${item.materielName}`
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
            _api.deletes([item.id]).then((res) => {
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
      } else if (event === 'duplication') {
        _api.duplication({ id: item.id, createUserId: this.userInfo.id })
          .then(res => {
            this.$message.success(res.message)
            this.getData(this.pageVo.currentPage, this.pageVo.pageSize)
          })
      } else if (event === 'add') {
        // 添加样品材料（和样品材料那的编辑一模一样）
        this.AddsShow = true;

        this.formData = Object.assign({}, item)
        this.formData.isSeal = String(this.formData.isSeal)
        this.formData.isLid = String(this.formData.isLid)
        this.formData.speed = String(this.formData.speed)
        this.formData.isHaveLid = this.formData.isHaveLid ? String(this.formData.isHaveLid) : ''
        const [m, n] = this.formData.capacity ? this.formData.capacity.split(',') : []
        this.$set(this.formData, 'm', m)
        this.$set(this.formData, 'n', n)
      } else {
        this.$emit('edit', item)
      }
    },
    // 薪增样品材料
    save(obj) {
      obj.createUserId = this.userInfo.id

      obj.createName = this.userInfo.user.nickName
      _api1.add(obj).then((res) => {
        this.$message.success(res.message)
        this.AddsShow = false;
        this.formData = {}
      }, () => {
        this.formData = this.initialObj
      })
      return
    },
    changeFromData(v) {
      this.formData = v
    },
    // 查看详情
    lookDetails({ id }) {
      _api.query({ id })
        .then(res => {
          this.detailsShow = true
          res.data.isDeleted = res.data.isDeleted === 1 ? '是' : '否'
          res.data.speed = res.data.speed === 1 ? '中' : res.data.speed === 0 ? '快' : '慢'
          res.data.isLid = res.data.isLid === 1 ? '是' : '否'
          res.data.isSeal = res.data.isSeal === 1 ? '是' : '否'
          res.data.isHaveLid = res.data.isHaveLid === 1 ? '是' : '否'
          res.data.capacitys = res.data.capacity ? `[${res.data.capacity}]` : ''
          this.formDatas = res.data
        })
    },
    getData(pageNumber = this.pageVo.currentPage, pageSize = this.pageVo.pageSize, objs = { searchWord: this.$parent.modeVal }) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        userId: this.userInfo.id,
        parentId: '0',
        ...objs
      }
      _api.page(obj).then((res) => {
        this.dataSource = res.data.map(item => ({ ...item, capacitys: item.capacity ? `[${item.capacity}]` : '' }))
        this.pageVo.total = res.total
        //   this.tableOptions.loading = false
      })
    },
    handleCurrentChange(v) {
      this.pageVo.currentPage = v
      this.getData(v, this.pageVo.pageSize)
    }
    // // 保存
    // save(obj) {
    //   if (this.$refs.addDialog.editState === 0) {
    //     _api.add(obj).then((res) => {
    //       this.$message.success(res.message)
    //       this.getData()
    //       this.addShow = false
    //     })
    //     return
    //   }
    //   _api.update(obj).then((res) => {
    //     this.$message.success(res.message)
    //     this.getData()
    //     this.addShow = false
    //   })
    // }
  }
}
</script>
<style lang="less" scoped>
.fisrts{
font-size:14px;color: #15DCC6;margin-right:13px
}

</style>
