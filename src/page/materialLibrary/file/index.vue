<template>
  <div
    class="materialLibraryFile"
    @click="cancale(),cancale1(),cancale2()"
  >
    <el-scrollbar>
      <div class="contents">
        <div class="btns">
          <upload
            btn-name="上传"
            :action="uploads.action"
            :parameter="uploads.parameter"
            @handleBefore="handleBefore"
            @handleSuccess="handleSuccess"
          />
          <el-button
            type="primary"
            class="btn_files"
            @click="processAddShow=true; processAddState=0; processformData={}"
          ><img
            :src="newFile"
            style="width:13px;margin-right:5px"
            alt=""
          >{{ $t('新建文件夹') }}</el-button>
          <el-button
            type="primary"
            class="btn_files"
            @click="downs()"
          ><img
            :src="down"
            style="width:13px;margin-right:5px"
            alt=""
          >{{ $t('下载') }}</el-button>

        </div>
        <div class="form">
          <el-input
            v-model="searchForm.name"
            clearable
            :placeholder="$t('搜索')"
            class="input first"
            @input="getData(
              1,
              999
            )"
          >
            <img
              slot="prefix"
              width="16px"
              :src="search"
            >
          </el-input>
        </div>
      </div>
      <!-- 面包屑 -->
      <el-breadcrumb
        v-if="!searchForm.name"
        class="breadcrumb "
        separator-class="el-icon-arrow-right"
      >
        <img
          v-show="breadcrumbList.length>1"
          :src="back"
          style=""
          class="cursor"
          alt=""
          @click="getDatas(breadcrumbList[breadcrumbList.length-2],breadcrumbList.length-2)"
        >
        <el-tooltip
          v-for="(item,index) in breadcrumbList"
          :key="index"
          class="item"
          :manual="index===0"
          effect="dark"
          :content="$t(item.name)"
          placement="top-end"
        >
          <el-breadcrumb-item

            class="cursor ellipsis"
            :class="index===0&&breadcrumbList.length>1?'firstBreadcrumb':''"
            @click.native="getDatas(item,index)"
          >
            {{ $t(item.name) }}
          </el-breadcrumb-item>
        </el-tooltip>

      </el-breadcrumb>
      <p
        v-if="searchForm.name"
        class="breadcrumb result "
      >{{ searchForm.name }}的搜索结果</p>
      <el-divider v-if="list" />
      <!-- 列表 -->
      <my_table
        v-if="list"
        ref="comTable"
        class="viewstable"
        :data-source="status?dataSource:dataSource1"
        :options="tableOptions"
        :page-vo="pageVo"
        :columns="status?tableColumns:tableColumns1"
        @handleRowDbClick="handleRowDbClick"
        @handleSelectionChange="handleSelectionChange"
      />

      <Add
        v-if="addShow"
        :edit-state="editState"
        :form-data="formDatas"
        :add-show.sync="addShow"
        @save="save"
      />
      <processAdd
        v-if="processAddShow"
        :edit-state="processAddState"
        :form-data="processformData"
        :process-add-show.sync="processAddShow"
        @save="processSave"
      />
      <fileTree
        v-if="treeShow"
        :id="moveId"
        ref="fileTree"
        :state="operState"
        :tree-show.sync="treeShow"
      />
      <views
        v-if="viewShow"
        :title="viewName"
        :src-url="diagramurl"
        :view-show.sync="viewShow"
      />
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Add from './component/add.vue'
import views from './component/view.vue'
import processAdd from './component/processAdd.vue'
import fileTree from './component/fileTree.vue'
import * as _api from '@/api/materialLibrary/file'
import upload from '@/components/common/upload'
import { getCookies } from '@/utils/auth'
import diagramSVG from '@/page/bpmnCanvas/utils/diagramSVG.svg'
import {
  viewImgs,
  editImgs,
  copyImgs,
  moveImgs,
  delImgs,
  jtIimgs,
  xjtIimgs,
  more,
  newFile,
  files1,
  down,
  back
} from './icon'
import moment from 'moment'
const file = localStorage.theme ? require('@/assets/img/file.png') : require('@/assets/img/files.png');
// const file1 = localStorage.theme ? require('@/assets/img/file1.png') : require('@/assets/img/file1s.png')
export const search = localStorage.theme
  ? require('./img/serachdark.png')
  : require('./img/serachWhite.png')
// import { exports } from '@/utils/exports'
export default {
  components: {
    Add,
    processAdd,
    fileTree,
    views,
    upload
  },
  data() {
    return {
      back,
      uploads: {
        action: `${process.env.NODE_ENV === 'development' ? '/api' : '/'}exp/file/file/tree/upload`, // 接口地址
        parameter: {
          parentId: ''
        }
      },
      down,
      newFile,
      xjtIimgs,
      viewName: '',
      delImgs,
      moveImgs,
      copyImgs,
      viewImgs,
      editImgs,
      formDatas: {},
      moveId: '',
      viewShow: false,
      treeShow: false,
      processformData: {},
      editState: 0,
      processAddState: 0,
      operState: 0,
      search,
      addShow: false,
      processAddShow: false,
      searchForm: {},
      src: require('./img/1.png'),
      src1: require('./img/2.png'),
      src2: require('./img/3.png'),
      src3: require('./img/4.png'),
      del: require('./img/del.png'),
      technology: require('./img/views.png'),
      jtIimgs,
      list: true,
      status: true,
      breadcrumbList: [{ name: '我的' }],
      // 表格分页
      pageVo: {
        total: 30,
        status: false,
        pageSize: 10,
        currentPage: 1
      },
      recents: [],
      // 表格参数配置
      tableOptions: {
        stripe: false, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: false, // 是否支持当前行高亮显示
        serial: false, // 是否支持序号
        mutiSelect: true, // 是否支持列表项选中功能
        height: 'calc(70vh)',
        border: false,
        padding: 'lists'
      },
      // 表格展示的列
      tableColumns: [
        {
          prop: 'name',
          label: '文件名',
          file: true,
          align: 'left',
          sortable: true,
          fileSrc: file,
          fileSrc1: files1
        },
        {
          prop: 'nodeSize',
          label: '大小',
          render: (r, { row }) => {
            if (row.nodeType === 1) {
              return ''
            }
            return (
              <span>
                {row.nodeSize > 1024 ? `${(row.nodeSize / 1024).toFixed(2)}KB` : `${(row.nodeSize * 1)}B`}
              </span>
            )
          }
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          render: (r, { row }) => {
            return (
              <span>
                {moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')}
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
                      src={more}
                    />{' '}
                  </span>
                  <el-dropdown-menu slot='dropdown'>
                    <el-dropdown-item command='down' >
                      <img width='14px' src={editImgs} alt='' />
                      &nbsp;{this.$tc('下载')}
                    </el-dropdown-item>
                    <el-dropdown-item command='copy'>
                      <img width='14px' src={copyImgs} alt='' />
                      &nbsp;{this.$tc('复制到')}
                    </el-dropdown-item>
                    <el-dropdown-item command='rename'>
                      <img width='14px' src={editImgs} alt='' />
                      &nbsp;{this.$tc('重命名')}
                    </el-dropdown-item>
                    <el-dropdown-item command='move'>
                      <img width='14px' src={moveImgs} alt='' />
                      &nbsp;{this.$tc('移动到')}
                    </el-dropdown-item>
                    <el-dropdown-item command='del'>
                      <img width='14px' src={delImgs} alt='' />
                      &nbsp; {this.$tc('删除')}
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
          claimNo: '工艺',
          orderCode: 'a平台1.0版本',
          visible: false,
          id: 1
        },
        {
          claimNo: '工艺',
          orderCode: 'a平台1.0版本',
          visible: false,
          id: 2
        }
      ],
      // 表格数据
      dataSource: [

      ],
      selectList: [],
      diagramurl: diagramSVG,
      checkTreeId: ''
    }
  },

  computed: {
    ...mapGetters(['theme', 'userInfo']),
    srcs() {
      let srcs
      if (this.list && this.theme) {
        srcs = this.src1
      }
      if (!this.list && this.theme) {
        srcs = this.src
      }
      if (!this.list && !this.theme) {
        srcs = this.src3
      }
      if (this.list && !this.theme) {
        srcs = this.src2
      }
      return srcs
    },
    dataSourceFiles() {
      return this.dataSource.filter((item) => item.nodeType === 1)
    },
    dataSourceFile() {
      return this.dataSource.filter((item) => item.nodeType !== 1)
    }
  },
  watch: {
    status() {
      this.$refs.comTable.doLayout()
    }
  },
  mounted() {
    this.getData(1, 99999)
    this.$store.commit('LAYOUT_HEAD_TITLE', false)
  },
  methods: {
    // 获取下载资源
    downs(val) {
      console.log(val)
      if (!this.selectList.length && !val) {
        this.$message.error(this.$tc('请先勾选需要下载的内容'))
        return
      }
      _api.getDownloads({ ids: val ? [val.id] : this.selectList.map(i => i.id) }) // 判断是批量下载还是单个下载
        .then(res => {
          this.downFile(res.data.map(item => ({ objectName: item.objectName, name: item.name })))
        })
    },
    handleSelectionChange(v) {
      this.selectList = v
    },
    // 下载文件
    downFile(arr) {
      for (const i of arr) {
        open(process.env.NODE_ENV === 'development' ? '/api' : '/' + 'exp/file/file/info/download?objectName=' + i.objectName + '&Authorization=' + encodeURI(getCookies('TOKEN_6PL_E3')))
      }

    //   _api.download({ objectName: arr[0].objectName })
    //     .then(res => {
    //     //   exports(res.data, arr[0].name)
    //       open(process.env.VUE_APP_BASE_API + '/exp/file/file/info/download?objectName=' + arr[0].objectName, '_self')
    //       arr.shift()
    //       // 递归加载
    //       if (arr.length) {
    //         this.downFile(arr)
    //       }
    //     }, () => {
    //       arr.shift()
    //       if (arr.length) {
    //         this.downFile(arr)
    //       }
    //     })
    },
    handleSuccess({ response }) {
      this.$message.success(response.message)
      this.getData(1, 99999, this.breadcrumbList[this.breadcrumbList.length - 1].id)
    },
    // 文件上传前
    handleBefore(file) {
      this.uploads.parameter.parentId = this.breadcrumbList[this.breadcrumbList.length - 1].id || this.userInfo.id
    },
    // 编辑跳转画布
    editCavas(v) {
      console.log(v)
    },

    // 复制
    copys(item) {
      this.operState = 2
      this.moveId = item.id
      this.treeShow = true
      item.visible = false
    },

    getData(pageNumber, pageSize, parentId, v) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        parentId,
        ...this.searchForm
      }
      _api.page(obj).then((res) => {
        // 进入文件夹
        if (v && !this.searchForm.name) {
          this.breadcrumbList.push({ name: v.name, id: v.id })
        } else if (v) {
          // 如果搜索有值，面包屑直接取后台返回的
          this.searchForm.name = ''
          this.breadcrumbList = v.nodePathObjects.map(item => ({ ...item, id: item.nodePath }))
          this.breadcrumbList.push({ name: v.name, id: v.id })
        }
        this.dataSource = res.data
          .map((item) => {
            item.visible = false
            if (item.status === 0) {
              item.statusName = this.$tc('未编辑')
            } else if (item.status === 1) {
              item.statusName = this.$tc('已编辑')
            } else {
              item.statusName = this.$tc('已执行')
            }
            return item
          })
          .sort((a, b) => b.nodeType - a.nodeType)
        this.pageVo.total = res.total
        //   this.tableOptions.loading = false
      })
    },

    // 下拉触发
    dropdown(v, item) {
      item.visible = false
      switch (v) {
      case 'del':
        this.$confirm(
          this.$tc(
            `<span style='color:${localStorage.theme ? '#fff' : '#000'}'>确定</span><span style='color:rgb(244,118,118)'>删除</span><span style='color:${localStorage.theme ? '#fff' : '#000'}'>${item.nodeType === 1 ? '文件夹' : '文件'}</span>${item.name}`
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
            const id = this.breadcrumbList[this.breadcrumbList.length - 1].id
            _api.deletes({ id: item.id }).then((res) => {
              this.$message.success(res.message)
              // 判断是否是本页最后一条
              if (this.dataSource.length === 1) {
                this.handleCurrentChange(this.pageVo.currentPage - 1)
                return
              }
              this.getData(1, 99999, id)
            })
          })
          .catch(() => {})
        break
      case 'rename': // 重命名
        this.processAddState = 1
        this.processformData = { name: item.name, id: item.id }
        this.processAddShow = true
        break
      case 'move':
        this.moveId = item.id;
        this.operState = 1
        this.treeShow = true
        break
      case 'copy':
        this.copys(item)
        break
      case 'down':
        this.downs(item) // 下载
        break
      default :this.viewProcessChange(item)
      }

    //   // 移动
    },
    // 工艺集保存
    processSave(v) {
      // 当前路径下的id  this.breadcrumbList[this.breadcrumbList.length - 1].id
      const id = this.checkTreeId
        ? this.checkTreeId
        : this.breadcrumbList[this.breadcrumbList.length - 1].id
      if (this.processAddState === 0) {
        _api.add({ ...v, parentId: id }).then((res) => {
          this.$message.success(res.message)
          this.processAddShow = false
          this.processformData = {}
          this.processAddState = 0
          this.checkTreeId = ''
          this.getData(1, 999, id)
          // 判断是否是树形结构新增 如果是刷新树形结构
          if (this.treeShow) {
            this.$refs.fileTree.getData(1, 999)
          }
        })
        return
      }
      _api.update({ name: v.name, id: v.id }).then((res) => {
        this.$message.success(res.message)
        this.processAddShow = false
        this.processformData = {}
        this.processAddState = 0
        this.getData(1, 99999, id)
      })
    },
    refreshSelectedTag() {},
    closeOthersTags() {},
    closeAllTags() {},
    // cancale cancale1 cancale2 取消右击
    cancale(v) {
      if (!v || this.dataSourceFiles.every((item) => item.visible)) {
        this.dataSourceFiles.forEach((item) => {
          item.visible = false
        })
        return
      }
      for (const i of this.dataSourceFiles) {
        if (i.id !== v.id) {
          i.visible = false
          console.log(i)
        }
      }
    },
    cancale1(v) {
      if (!v || this.dataSourceFile.every((item) => item.visible)) {
        this.dataSourceFile.forEach((item) => {
          item.visible = false
        })
        return
      }
      for (const i of this.dataSourceFile) {
        if (i.id !== v.id) {
          i.visible = false
          console.log(i)
        }
      }
    },
    cancale2(v) {
      if (!v || this.recents.every((item) => item.visible)) {
        this.recents.forEach((item) => {
          item.visible = false
        })
        return
      }
      for (const i of this.recents) {
        if (i.id !== v.id) {
          i.visible = false
          console.log(i)
        }
      }
    },
    // 视图有点击
    goFile(e, item) {
      this.cancale(item)
      item.visible = true
      console.log(e, item)
    },
    save(v, id = this.breadcrumbList[this.breadcrumbList.length - 1].id) {
      // 当前路径下的id  this.breadcrumbList[this.breadcrumbList.length - 1].id
      if (this.editState === 0) {
        _api.add({ ...v, parentId: id }).then((res) => {
          this.$message.success(res.message)
          this.addShow = false
          this.formDatas = {}
          this.editState = 0
          this.getData(1, 999, id)
          this.$confirm(
            this.$tc('保存成功，是否进入工艺编辑器？'),
            this.$tc('提示'),
            {
              confirmButtonText: this.$tc('确认'),
              cancelButtonText: this.$tc('取消'),
              cancelButtonClass: 'conffirmMessageCancle',
              customClass: 'miniMessage'
            }
          )
            .then(() => {
              // 确认操作
            })
            .catch(() => {})
        })
        return
      }
      //
      _api
        .update({
          id: v.id,
          name: v.name,
          remark: v.remark,
          configInfo: v.configInfo
        })
        .then((res) => {
          this.$message.success(res.message)
          this.addShow = false
          this.formDatas = {}
          this.editState = 0
          this.getData(1, 99999, id)
        })
    },
    // 返回
    getDatas(item, index) {
      this.breadcrumbList = this.breadcrumbList.slice(0, index + 1)
      this.getData(1, 99999, item.id)
    },
    // 双击行
    handleRowDbClick(v) {
      if (v.nodeType === 1) {
        this.getData(1, 99999, v.id, v)
      }
    }

  }
}
</script>
<style scoped lang="less">
.result{
        display: inline-block;
    height: 2.5rem;
    font-size: 1.75rem;
    font-family: GalanoGrotesqueDEMO-Bold, GalanoGrotesqueDEMO;
    font-weight: bold;
    width: 100%;
    line-height: 2.375rem;
    text-align: left;
}
.btn_files{
    margin-left: 10px;
}
.changeimg{
    width:72px;padding-left: 10px;
}
.contentImg{
    img{
        width: 45%;
        height: 96px;
        transform: scale(.9);
    }
}
.contents {
  overflow: hidden;
  width: 99%;
  margin-top: 0px;
  .btns {
    float: left;
    img{
        width:13px !important;margin-right:5px !important
    }
  }
  .form {
    float: right;
    img{
        padding: 0.75rem 0.9375rem;
    }
    .con-margin-b {
      padding-right: 0 !important;
    }
  }
}
.operation {
  img {
    vertical-align: middle;
    width: 14px;
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
.heightWiew:hover {
    box-shadow: 0px 0px 13px 0px rgba(8, 192, 169, 0.4);
  //  height:calc(77.3vh)
}
.breadcrumb {
  margin: 20px 0 8px 0;
    position: relative;
  >img{
      position: absolute;
      left: 0;
      width: 24px;
      bottom: 10px;
  }
.firstBreadcrumb{
    margin-left: 36px;
}
  .el-breadcrumb__item {
    display: inline-block;
    // width: 79px;
    height: 40px;
    font-size: 28px;
    font-family: GalanoGrotesqueDEMO-Bold, GalanoGrotesqueDEMO;
    font-weight: bold;
    color: #ffffff;
    // line-height: 38px;
  }
}
.title {
  // width: 54px;
  height: 14px;
  font-size: 16px;
  font-family: PingFangSCSemibold-, PingFangSCSemibold;
  font-weight: normal;
  text-align: left;
  color: #ffffff;
  line-height: 14px;
  margin: 0 0 18px 0;
  font-size: 16px;
}
.titleview {
  line-height: 51px;
  position: relative;
  height:51px;
  text-align: left;

  img {
    width: 16px;
    vertical-align: middle;

    margin: 12px 12px 23px 21px;
  }
  span {
    margin: 12px 12px 23px 0px;
    font-size:14px;    position: absolute;
    top: -15px;
  }
}
.viewstable {
  margin-top: 10px;
  width: 99%;
}
.box-card {
  position: relative;
  text-align: center;
  background: #242424 !important;
}
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  left: 50%;
  top: 149px;
  transform: translate(-30%, -50%);
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    width: 180px;
    cursor: pointer;
    text-align: left;
  }
  li:hover {
    background: #eee;
  }
}
</style>
<style lang="less">
.materialLibraryFile {
    .el-button{
        padding: 11px 1.25rem !important;
    }
    .el-divider--horizontal{
        margin: 12px 0 -7px 0;
    }

    ::-webkit-scrollbar{
        // width: 0 !important;
    }
.form .el-input--prefix .el-input__inner{
        padding-left: 3.125rem;
    //    background: #e6e6e9;
    }
  .serach {
    input {
      //   background: #e6e6e9;
      width: 228px;
    }

  }
  .el-card {
    overflow: inherit;
  }
  .contents{
      button{
          font-size: 14px;
      }
      button:hover{
             font-size: 14px;
      }
  }
}
.white {
       .result{
        color: #606266;
    }
 .form .el-input--prefix .el-input__inner{
        // padding-left: 3.125rem;
       background: #e6e6e9;
    }
}
.white {
  .materialLibraryFile {
        .el-button--primary,.el-button--primary:hover{
          font-size: 14px;
      }
  .normal {
    width: 98px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    background: rgb(229, 247, 245);
    border-radius: 13px;
    color: #00b8a4;
    font-size: 12px;
    display: inline-block;
  }
  .disable {
    width: 98px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    background: rgb(255, 239, 241);
    border-radius: 13px;
    color: #f03c3c;
    font-size: 12px;
    display: inline-block;
  }
}}
.dark {
  .materialLibraryFile {
         .result{
        color: #fff;
    }
        .el-button--primary,.el-button--primary:hover{
          font-size: 14px;
      }
    .normal {
      width: 98px;
      text-align: center;
      height: 26px;
      line-height: 26px;
      background: rgb(45, 61, 59);
      border-radius: 13px;
      color: #15dcc6;
      font-size: 12px;
      display: inline-block;
    }
    .disable {
      width: 98px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      background: rgb(63, 51, 53);
      border-radius: 13px;
      color: #ff647b;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
