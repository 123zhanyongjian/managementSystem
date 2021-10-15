<template>
  <div class="dataClass">
    <div class="margin-top">
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
        :columns="tableColumns"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <Add v-if="addShow" :edit-state="editState" :form-data="formDatas" :user-id="userInfo.id" :add-show.sync="addShow" @initialObj="(v)=>initialObj=v" @save="save" @changeFromData="changeFromData" />
    <Details v-if="detailsShow" :form-datas="formDatas" :details-show.sync="detailsShow" />
  </div>
</template>
<script>
import * as _api from '@/api/materialLibrary/sampleMaterial'
import Details from './component/details.vue'
import Add from './component/add.vue'
import { mapGetters } from 'vuex'
export const search = localStorage.theme
  ? require('@/page/workbench/userMaterial/img/serachdark.png')
  : require('@/page/workbench/userMaterial/img/serachWhite.png')
export const out = localStorage.theme
  ? require('./img/out1.png')
  : require('./img/out.png')
export const move = localStorage.theme
  ? require('./img/move1.png')
  : require('./img/move.png')
import { editImgs, more, delImgs, viewImgs } from '@/page/workbench/userMaterial/icon'
export default {
  name: 'DataClass',
  components: { Add, Details },
  data() {
    return {
      addShow: false,
      detailsShow: false,
      styleCode: '',
      modelCode: '',
      search,
      modeVal: '',
      initialObj: '',
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
          label: '名称',
          sortable: true
        },
        {
          prop: 'taskName',
          label: '任务',
          sortable: true
        },
        {
          prop: 'materielClass',
          label: '物料类',
          sortable: true
        },
        {
          prop: 'status',
          label: '状态',
          sortable: true,
          render: (r, { row }) => {
            return <span class={
              row.status === '1'
                ? 'stock'
                : row.status === '2'
                  ? 'Reserved'
                  : row.status === '3'
                    ? 'use'
                    : ''
            }>{row.status === '1' ? this.$tc('待命') : row.status === '2' ? this.$tc('在途') : row.status === '3' ? this.$tc('执行') : ''}</span>
          }
        }, {
          prop: 'location',
          label: '位置',
          sortable: true
        },

        {
          prop: 'updateTime',
          label: '更新时间'
        },
        {
          prop: 'controlBtn',
          label: '操作',
          width: 160,
          fixed: 'right',
          render: (h, params) => {
            return (
              <div class='operation cursor'>
                <span
                  onClick={() => this.lookDetails(params.row)}
                  class='icons'
                  style='font-size:14px;color: #15DCC6;margin-right:13px'
                >
                  <img
                    style=' vertical-align: middle;width: 14px;'
                    src={viewImgs}
                  />{' '}
                </span>
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
                    <el-dropdown-item command='out'>
                      <img width='14px' src={out} alt='' />
                      &nbsp;{this.$tc('出库')}
                    </el-dropdown-item> <el-dropdown-item command='move'>
                      <img width='14px' src={move} alt='' />
                      &nbsp;{this.$tc('转移')}
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
        serial: true, // 是否支持序号
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
    // 查看
    lookDetails({ id }) {
      this.formDatas = {}
      _api.query({ id })
        .then(res => {
          this.detailsShow = true
          res.data.isDeleted = res.data.isDeleted === 1 ? '是' : '否'
          res.data.speed = res.data.speed === 1 ? '中' : res.data.speed === 0 ? '快' : '慢'
          res.data.isLid = res.data.isLid === 1 ? '是' : '否'
          res.data.isSeal = res.data.isSeal === 1 ? '是' : '否'
          res.data.isHaveLid = res.data.isHaveLid === 1 ? '是' : '否'
          res.data.capacitys = res.data.capacity ? `[${res.data.capacity}]` : ''
          res.data.status = res.data.status === '1' ? this.$tc('待命') : res.data.status === '2' ? this.$tc('在途') : res.data.status === '3' ? this.$tc('执行') : ''
          this.formDatas = res.data
          console.log(this.formDatas)
        })
    },
    changeFromData(v) {
      this.formDatas = v
    },
    getData(pageNumber = this.pageVo.currentPage, pageSize = this.pageVo.pageSize, objs = { searchWord: this.modeVal }) {
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
        }, () => {
          this.formDatas = this.initialObj
        })
        return
      }
      _api.update(obj).then((res) => {
        this.$message.success(res.message)
        this.getData()
        this.addShow = false
      }, () => {
        this.formDatas = this.initialObj
      })
    },
    add({ row }) {
      //   this.formDatas = Object.assign({}, row)
      this.editState = 0
      this.formDatas = {}
      this.addShow = true
    },
    edit(row) {
      this.formDatas = Object.assign({ }, row)
      this.addShow = true;
      console.log(this.formDatas)
      this.editState = 1
    },
    handleSizeChange(v) {
      this.pageVo.pageSize = v
      this.getData(this.pageVo.currentPage, v)
    },
    // 薪增 更新
    saves(obj) {
      obj.createUserId = this.userInfo.id
      if (this.editState === 0) {
        obj.createName = this.userInfo.user.nickName
        _api.add(obj).then((res) => {
          this.$message.success(res.message)
          this.$refs.systemMaterials.getData()
          this.addShow = false;
          this.tablesShow = false
          this.formDatas = {}
        }, () => {
          this.formDatas = this.initialObj
        })
        return
      }
      obj.updateName = this.userInfo.user.nickName
      _api.update(obj).then((res) => {
        this.$message.success(res.message)
        this.$refs.systemMaterials.getData()
        this.addShow = false
        this.formDatas = {}
      }, () => {
        this.formDatas = this.initialObj
      })
    },
    // 分页查询
    handleCurrentChange(v) {
      this.pageVo.currentPage = v
      this.getData(v, this.pageVo.pageSize)
    },
    dropdown(event, item) {
      if (event === 'del') {
        if (item.taskName) {
          this.$message.error(this.$tc('该物料属于正在运行的任务，不可删除！'))
          return
        }
        this.$confirm(
          this.$tc(
            `确定<span style='color:rgb(244,118,118)'>删除</span>样品材料${item.modelName}`
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
              this.getData()
            })
          })
          .catch(() => {})
      } else {
        if (item.taskName) {
          this.$confirm(
            this.$tc(
              `该物料属于正在运行的任务，不可编辑！`
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
              return
            })
            .catch(() => { return })
          return
        }
        _api.query({ id: item.id })
          .then(res => {
            this.editState = 1;
            res.data.locations = ''
            this.formDatas = res.data;
            this.addShow = true;
            this.formDatas.isSeal = String(this.formDatas.isSeal)
            this.formDatas.isLid = String(this.formDatas.isLid)
            this.formDatas.speed = String(this.formDatas.speed)
            // 把物料类存为ids
            this.$set(this.formDatas, 'ids', this.formDatas.materielClass)
            this.formDatas.isHaveLid = this.formDatas.isHaveLid ? String(this.formDatas.isHaveLid) : ''
            const [m, n] = this.formDatas.capacity ? this.formDatas.capacity.split(',') : []
            this.$set(this.formDatas, 'm', m)
            this.$set(this.formDatas, 'n', n)
          })
      }
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
         .headimg{
    height: 34px;
    width: 58px;
    border-radius: 3px;
}
    .form {
    float: left;
    // width: 70%;
  }
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
            margin-right: 17px;
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
      .stock{
min-width: 98px;
height: 26px;
background: rgba(0,140,242,.1);
color: #008CF2;
line-height: 26px;
border-radius: 13px;
display: inline-block;
// opacity: 0.1;
  }
  .Reserved{
   min-width: 98px;
height: 26px;
background: rgba(244,129,14,.1);
color: #F4810E;
line-height: 26px;
border-radius: 13px;
display: inline-block;
  }
  .use{
      min-width: 98px;
height: 26px;
background: rgba(0,184,164, 0.1);
color: #00B8A4;
line-height: 26px;
border-radius: 13px;
display: inline-block;
  }
  }

}
.dark {
  .dataClass {
       .btn_files {
      border: 1px solid #237c72;
;
    }
     .unCheck{
        background: rgba(255, 255, 255, 0.06);
        border: none;
        color: rgba(255, 255, 255, .8);
    }
      .stock{
min-width: 98px;
height: 26px;
background: rgba(53,170,255,.1);
color: #35AAFF;
line-height: 26px;
border-radius: 13px;
display: inline-block;
// opacity: 0.1;
  }
  .Reserved{
   min-width: 98px;
height: 26px;
background: rgba(245,183,0,.1);
color: #F5B700;
line-height: 26px;
border-radius: 13px;
display: inline-block;
  }
  .use{
      min-width: 98px;
height: 26px;
background: rgba(21,220,198, 0.1);
color: #15DCC6;
line-height: 26px;
border-radius: 13px;
display: inline-block;
  }
  }
}
</style>
