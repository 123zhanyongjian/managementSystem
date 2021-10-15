<template>

  <div
    class="technology"
    @click="cancale(),cancale1(),cancale2()"
  >
    <el-scrollbar>
      <div class="contents">
        <div class="btns">
          <el-button
            type="primary"
            @click="addShow=true;editState=0;formDatas={}"
          >
            <img
              class="addImg"
              src="./img/add.png"
              style=""
              alt=""
            >
            {{ $t('工艺') }}
          </el-button>
          <el-button
            type="primary"
            class="btn_files"
            @click="processAddShow=true; processAddState=0; processformData={}"
          ><img
            :src="addimg"
            style=""
            alt=""
          >{{ $t('工艺集') }}</el-button>

        </div>
        <div class="mainRight">
          <el-input
            v-model="searchForm.name"
            clearable
            :placeholder="$t('搜索')"
            class="input"
            @input=" getData(
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
          <img
            slot="label_slot"
            class="changeimg changeimg1"
            :src="srcs"
            alt=""
          >
          <img
            slot="label_slot"
            class="changeimg posta"
            :src="srcs"
            alt=""
            @click="changList"
          >
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
      <!-- 最近 -->
      <p
        v-if="breadcrumbList.length===1&&list"
        class="title"
      > {{ $t('最近') }}</p>
      <el-row
        v-if="breadcrumbList.length===1&&list"
        :gutter="20"
      >
        <el-col
          v-for="(item,index) in recents"
          :key="index"
          :span="4"
        >
          <div class="grid-content bg-purple" />
          <div
            class="content cursor view heightWiew"
            style="position:relative"
            @contextmenu.prevent="goFile($event,item)"
            @click="cancale2(item)"
          >
            <div class="contentImg">
              <div class="kb" />
              <embed
                :src="item.nodeImageData ? item.nodeImageData : diagramurl"
                style=" transform: scale(.9);"
                type="image/svg+xml"
                class="cursor"
                pluginspage="http://www.adobe.com/svg/viewer/install/"
              >
            </div>
            <div class="titleview titleViewli">
              <img :src="technology"><span class="ellipsis viewGy titlese">{{ item.name }}</span>
            </div>
            <ul
              v-show="item.visible"
              class="contextmenu"
            >
              <li @click="viewProcessChange(item)"> <img
                width="14px"
                :src="viewImgs"
                alt=""
              >&nbsp;{{ $t('查看') }}</li>
              <li @click="editCavas(item)"><img
                width="14px"
                :src="editImgs"
                alt=""
              >&nbsp;{{ $t('编辑') }}</li>
              <li @click="editFile(item)"><img
                width="14px"
                :src="editImgs"
                alt=""
              >&nbsp;{{ $t('更改信息') }}</li>
              <li @click="copys(item)"><img
                width="14px"
                :src="copyImgs"
                alt=""
              >&nbsp;{{ $t('复制到') }}</li>
              <li @click="dropdown('move',item)"><img
                width="14px"
                :src="moveImgs"
                alt=""
              >&nbsp;{{ $t('移动到') }}</li>
              <li @click="dropdown('del',item,true)"><img
                width="14px"
                :src="delImgs"
                alt=""
              >&nbsp;{{ $t('删除') }}</li>
            </ul>
          </div>

        </el-col>
      </el-row>
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
      />

      <!-- 视图 -->
      <el-row
        v-if="!list"
        class="view"
        :gutter="24"
      >
        <p
          class="title cursor titicon"
          @click="jtIimgshow"
        > {{ $t('工艺集') }}<img
          style="margin-left:11px"
          class="ktIshows"
          :class="ktIshow?'ktIshowTrue':''"
          width="12px"
          :src="xjtIimgs"
        ></p>
        <div v-if="ktIshow">
          <el-col
            v-for="(item,index) in dataSourceFiles"
            :key="index"
            :span="4"
            :xs="4"
            :sm="4"
            :md="4"
            :lg="4"
            :xl="4"
            class="files"
          >
            <el-card
              class="box-card cursor"
              @contextmenu.prevent.native="goFile($event,item)"
            >
              <img
                src="./img/files.png"
                width="100px"
                alt=""
                @dblclick="handleRowDbClick(item)"
              >
              <p class="ellipsis">{{ item.name }}</p>
              <ul
                v-show="item.visible"
                class="contextmenu"
              >
                <li @click="dropdown('rename',item)"><img
                  width="14px"
                  :src="editImgs"
                  alt=""
                >&nbsp; {{ $t('重命名') }}</li>
                <li @click="dropdown('move',item)"><img
                  width="14px"
                  :src="moveImgs"
                  alt=""
                >&nbsp; {{ $t('移动到') }}</li>
                <li @click="dropdown('del',item)"><img
                  width="14px"
                  :src="delImgs"
                  alt=""
                >&nbsp; {{ $t('删除') }}</li>
              </ul>
            </el-card>

          </el-col>
        </div>
      </el-row>

      <p
        v-if="!list"
        class="title cursor titicon"
        @click="viewListShow=!viewListShow"
      > {{ $t('工艺') }}<img
        style="margin-left:11px"
        width="12px"
        class="ktIshows gyimg"
        :class="viewListShow?'ktIshowTrue':''"
        :src="xjtIimgs"
      ></p>
      <el-row
        v-if="!list&&viewListShow"
        :gutter="20"
      >
        <el-col
          v-for="(item,index) in dataSourceFile"
          :key="index"
          :span="4"
        >
          <div class="grid-content bg-purple" />
          <div
            class="content view heightWiew"
            style="position:relative"
            @contextmenu.prevent="goFile($event,item)"
            @click="cancale(item)"
          >
            <div class="contentImg">
              <div class="kb" />
              <embed
                :src="item.nodeImageData ? item.nodeImageData : diagramurl"
                style=" transform: scale(.9);"
                type="image/svg+xml"
                class="cursor"
                pluginspage="http://www.adobe.com/svg/viewer/install/"
              >
            </div>
            <div class="titleview titleViewli">
              <img
                width="100%"
                :src="technology"
              ><span class="ellipsis viewGy">{{ item.name }}</span>
            </div>
            <ul
              v-show="item.visible"
              class="contextmenu"
            >
              <li @click="viewProcessChange(item)"> <img
                width="14px"
                :src="viewImgs"
                alt=""
              >&nbsp;{{ $t('查看') }}</li>
              <li @click="editCavas(item)"><img
                width="14px"
                :src="editImgs"
                alt=""
              >&nbsp;{{ $t('编辑') }}</li>
              <!-- <li @click="dropdown('rename',item)"><img
              width="14px"
              :src="editImgs"
              alt=""
            >&nbsp;{{ $t('重命名') }}</li> -->
              <li @click="copys(item)"><img
                width="14px"
                :src="copyImgs"
                alt=""
              >&nbsp;{{ $t('复制到') }}</li>
              <li @click="dropdown('move',item)"><img
                width="14px"
                :src="moveImgs"
                alt=""
              >&nbsp;{{ $t('移动到') }}</li>
              <li @click="dropdown('del',item)"><img
                width="14px"
                :src="delImgs"
                alt=""
              >&nbsp;{{ $t('删除') }}</li>
            </ul>
          </div>

        </el-col>
      </el-row>
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
        :craft-info="craftInfo"
        :title="viewName"
        :src-url="diagramurl"
        :view-show.sync="viewShow"
      />
    </el-scrollbar>
  </div>

</template>
<script>
import { removeToken } from '@/utils/auth' // get token from cookie
import { mapGetters } from 'vuex'
import Add from './component/add.vue'
import views from './component/view.vue'
import processAdd from './component/processAdd.vue'
import fileTree from './component/fileTree.vue'
import * as _api from '@/api/technology'
import diagramSVG from '@/page/bpmnCanvas/utils/diagramSVG.svg'
const file = localStorage.theme
  ? require('@/assets/img/file.png')
  : require('@/assets/img/files.png')
const file1 = localStorage.theme
  ? require('@/assets/img/file1.png')
  : require('@/assets/img/file1s.png')
export const search = localStorage.theme
  ? require('./img/serachdark.png')
  : require('./img/serachWhite.png')
import {
  viewImgs,
  editImgs,
  copyImgs,
  moveImgs,
  delImgs,
  jtIimgs,
  technology,
  xjtIimgs,
  more,
  by,
  back,
  addimg
} from './icon'
import moment from 'moment'
let timer
export default {
  components: {
    Add,
    processAdd,
    fileTree,
    views
  },
  data() {
    return {
      back,
      addimg,
      xjtIimgs,
      viewListShow: true,
      viewName: '',
      delImgs,
      moveImgs,
      copyImgs,
      viewImgs,
      editImgs,
      search,
      formDatas: {},
      moveId: '',
      viewShow: false,
      treeShow: false,
      processformData: {},
      editState: 0,
      processAddState: 0,
      operState: 0,
      addShow: false,
      processAddShow: false,
      searchForm: {},
      src: require('./img/1.png'),
      src1: require('./img/2.png'),
      src2: require('./img/3.png'),
      src3: require('./img/4.png'),
      del: require('./img/del.png'),
      technology,
      jtIimgs,
      list: true,
      status: true,
      breadcrumbList: [{ name: '我的工艺' }],
      formData: [
        {
          type: 'label_input',
          placeholder: '请输入',
          prop: 'name',
          xl: 16,
          lg: 16,
          md: 16,
          class: 'serach',
          sm: 16,
          slotType: 'prefix',
          handleInput: () => {
            this.getData(
              1,
              999,
              this.breadcrumbList[this.breadcrumbList.length - 1].id
            )
          },
          slotText:
            '<i slot="prefix" class="el-input__icon el-icon-search"></i>'
        },

        {
          type: 'label_slot',
          slot: true,
          xl: 5,
          lg: 5,
          md: 5,
          sm: 5
        }
      ],
      ktIshow: true,
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
        mutiSelect: false, // 是否支持列表项选中功能
        height: 'calc(53vh)',
        border: false,
        padding: 'lists',
        fileSort: true
      },
      // 表格展示的列
      tableColumns: [
        {
          prop: 'name',
          label: '名称',
          file: true,
          align: 'left',
          sortable: true,
          fileSrc: file,
          fileSrc1: file1
        },
        {
          prop: 'nodePath',
          label: '路径'
        },
        {
          prop: 'configInfo',
          label: '平台'
        },

        {
          prop: 'statusName',
          label: '状态',
          render: (h, { row }) => {
            if (row.nodeType === 1) {
              return ''
            }
            return (
              <span
                class={
                  row.status === 0 || !row.status
                    ? 'naught'
                    : row.status === 1
                      ? 'notCompiled'
                      : row.status === 3
                        ? 'compiled'
                        : row.status === 4
                          ? 'notExecution'
                          : 'implement'
                }
              >
                {row.statusName}
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
                <span
                  onClick={() => this.editFileCraft(params.row)}
                  class='icons'
                  style='font-size:14px;color: #15DCC6;margin-right:13px'
                >
                  <img style=' vertical-align: middle;width: 14px;' src={by} />{' '}
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
                    <el-dropdown-item
                      command='look'
                      style={{
                        display: params.row.nodeType === 1 ? 'none' : ''
                      }}
                    >
                      <img width='14px' src={viewImgs} alt='' />
                      &nbsp;{this.$tc('查看')}
                    </el-dropdown-item>
                    <el-dropdown-item
                      command='edit'
                      style={{
                        display: params.row.nodeType === 1 ? 'none' : ''
                      }}
                    >
                      <img width='14px' src={editImgs} alt='' />
                      &nbsp;{this.$tc('更改信息')}
                    </el-dropdown-item>
                    <el-dropdown-item
                      command='copy'
                      style={{
                        display: params.row.nodeType === 1 ? 'none' : ''
                      }}
                    >
                      <img width='14px' src={copyImgs} alt='' />
                      &nbsp;{this.$tc('复制到')}
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
        {
          name: '工艺集111',
          orderCode: '--',
          type: true
        },
        {
          name: '工艺123',
          orderCode: 'a平台1.0版本'
        }
      ],
      diagramurl: diagramSVG,
      checkTreeId: '',
      craftInfo: {}
    }
  },

  computed: {
    ...mapGetters(['theme']),
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
      console.log('//')
      this.$refs.comTable.doLayout()
    }
  },
  mounted() {
    this.getData(1, 9999)
    this.$bus.$on('closeRightButton', () => {
      this.cancale1()
      this.cancale()
      this.cancale2()
    })
    this.$store.commit('LAYOUT_HEAD_TITLE', false)
  },
  methods: {
    // 切换视图
    changList() {
      this.list = !this.list
      console.log(this.dataSource)
    },
    // 显示隐藏
    jtIimgshow() {
      this.ktIshow = !this.ktIshow
    },
    // 编辑跳转画布
    editCavas(item) {
      this.craftInfo = item
      this.$router.push({
        name: 'bpmnComp',
        params: {
          craftInfo: item,
          type: 'edit'
        }
      })
    },
    // 查看
    viewProcessChange(item) {
      this.viewShow = true
      this.viewName = item.name
      this.craftInfo = item
    },
    // 复制
    copys(item) {
      this.operState = 2
      this.moveId = item.id
      this.treeShow = true
      item.visible = false
    },
    // 点击table-操作编辑icon
    editFileCraft(row) {
      if (row.nodeType === 1) {
        this.processAddState = 1
        this.processAddShow = true
        this.processformData = { ...row }
        return
      }
      this.craftInfo = row
      this.$router.push({
        name: 'bpmnComp',
        params: {
          craftInfo: row,
          type: 'edit'
        }
      })
    },
    // 编辑
    editFile(row) {
      if (row.nodeType === 1) {
        this.processAddState = 1
        this.processAddShow = true
        this.processformData = { ...row }
        return
      }
      row.visible = false
      this.editState = this.formDatas = { ...row }
      this.addShow = true
    },
    getData(pageNumber, pageSize, parentId, v) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        parentId,
        ...this.searchForm
      }
      _api.page(obj).then((res) => {
        // 如果是双击文件夹
        if (v && !this.searchForm.name) {
          this.breadcrumbList.push({ name: v.name, id: v.id })
        } else if (v) {
          // 如果搜索有值，面包屑直接取后台返回的并且加上自己本身的名称和id
          this.searchForm.name = ''
          this.breadcrumbList = v.nodePathObjects.map((item) => ({
            ...item,
            id: item.nodePath
          }))
          this.breadcrumbList.push({ name: v.name, id: v.id })
        }
        this.dataSource = res.data
          .map((item) => {
            item.visible = false
            if (item.status === 0 || !item.status) {
              item.statusName = this.$tc('空白')
            } else if (item.status === 1) {
              item.statusName = this.$tc('未编译')
            } else if (item.status === 2) {
              item.statusName = this.$tc('已编译')
            } else if (item.status === 3) {
              item.statusName = this.$tc('执行中')
            } else if (item.status === 4) {
              item.statusName = this.$tc('已执行')
            }
            return item
          })
          .sort((a, b) => b.nodeType - a.nodeType)
        this.pageVo.total = res.total
        this.recent()
        // 改变表格高度
        if (this.breadcrumbList.length === 1) {
          this.tableOptions.height = '53vh'
        } else {
          this.tableOptions.height = '72vh'
        }
        //   this.tableOptions.loading = false
      })
    },
    // 最近查询
    recent() {
      _api
        .recent({
          pageSize: 6,
          pageNumber: 1
        })
        .then((res) => {
          this.recents = res.data.map((item) => ({ ...item, visible: false }))
        })
    },
    // 下拉触发
    dropdown(v, item, flag) {
      item.visible = false
      switch (v) {
      case 'del':
        if (item.childCount !== '0' && !flag) {
          this.$message.error(this.$tc('不可删除'))
          return
        }
        this.$confirm(
          this.$tc(
            `<span style='color:${
              localStorage.theme ? '#fff' : '#000'
            }'>确定</span><span style='color:rgb(244,118,118)'>删除</span><span style='color:${
              localStorage.theme ? '#fff' : '#000'
            }'>${item.nodeType === 1 ? '工艺集' : '工艺'}</span>${item.name}`
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
              this.getData(1, 999, id)
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
        this.moveId = item.id
        this.operState = 1
        this.treeShow = true
        break
      case 'copy':
        this.copys(item)
        break
      case 'edit':
        this.editFile(item)
        break
      default:
        this.viewProcessChange(item)
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
        this.getData(1, 999, id)
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
      // 点击前清空其他显示的列表
      this.cancale(item)
      this.cancale1(item)
      this.cancale2(item)
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
              this.craftInfo = res.data
              this.$router.push({
                name: 'bpmnComp',
                params: {
                  craftInfo: res.data,
                  type: 'edit'
                }
              })
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
              this.craftInfo = res.data
              this.$router.push({
                name: 'bpmnComp',
                params: {
                  craftInfo: res.data,
                  type: 'edit'
                }
              })
            })
            .catch(() => {})
        })
    },
    // 返回
    getDatas(item, index) {
      this.breadcrumbList = this.breadcrumbList.slice(0, index + 1)
      this.getData(1, 9999, item.id)
    },
    // 双击行
    handleRowDbClick(v) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        if (v.nodeType === 1) {
          this.getData(1, 999, v.id, v)
        }
      }, 200)
    },
    dels({ row }) {
      this.$confirm('此操作将退出该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--primary'
      })
        .then(() => {})
        .catch(() => {})
    },
    logout() {
      removeToken()
      setTimeout(() => {
        location.reload()
      }, 200)
    }
  }
}
</script>
<style scoped lang="less">
.technology {
  .viewGy {
    font-size: 14px;
    position: absolute;
    top: -15px;
    display: inline-block !important;
  }
  .ellipsis {
    display: block;
  }
  .titicon {
    margin-left: 12px;
    margin-top: 20px;
  }
  .addImg {
    width: 16px;
    margin-right: 5px;
  }
  .btn_files {
    img {
      width: 16px;
      margin-right: 5px;
    }
  }
  overflow-x: hidden;
  ::-webkit-scrollbar {
    // width: 0 !important;
  }
}
.ktIshowTrue {
  transform: rotate(180deg);
}
.ktIshowFalse {
  transform: rotate(360deg);
}
.ktIshows {
  transition: all 0.5s;
}
.titlese {
  display: inline-block;
  width: 75%;
}
.changeimg {
  width: 72px;
  padding-left: 10px;
}
.posta {
  position: absolute;
  right: 0;
  top: 0px;
}
.contentImg {
  .kb {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 999;
  }
  embed {
    width: 45%;
    height: 96px;
    transform: scale(0.9);
  }
}
.contents {
  overflow: hidden;
  margin-top: 0px;
  .btns {
    float: left;
  }
  .form {
    float: right;
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
  > img {
    position: absolute;
    left: 0;
    width: 24px;
    bottom: 10px;
  }
  .firstBreadcrumb {
    margin-left: 36px;
  }
  //  width: 100v;
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
  height: 51px;

  text-align: left;

  img {
    width: 16px;
    vertical-align: middle;

    margin: 12px 12px 23px 21px;
  }
  span {
    margin: 12px 12px 23px 0px;
    font-size: 14px;
    position: absolute;
    top: -15px;
  }
  .titleViewli {
    height: 51px;
  }
}
.viewstable {
  margin-top: 2px;
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
  box-shadow: 2px 2px 18px 0 rgba(0, 0, 0, 0.3);
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
.gyimg {
}
.changeimg1 {
  opacity: 0;
}
.result {
  display: inline-block;
  height: 2.5rem;
  font-size: 1.75rem;
  font-family: GalanoGrotesqueDEMO-Bold, GalanoGrotesqueDEMO;
  font-weight: bold;
  width: 100%;
  line-height: 2.375rem;
  text-align: left;
}
</style>
<style lang="less">
.technology {
  .el-breadcrumb__inner {
    max-width: 120px;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
  }
  .btns {
    .el-button {
      padding: 10px 1.25rem !important;
    }
  }
  .view::after {
    height: 26px;
  }
  .el-divider--horizontal {
    margin: 5px 0 10px 0;
  }
  .viewProcess {
    .el-dialog__header {
      padding: 16px 1.75rem 10px 1.75rem;
    }
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
}
.white {
  .technology {
    .result {
      color: #606266;
    }
    .mainRight {
      line-height: 38px;
      float: right;
      input {
        background: #e6e6e9;
      }
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
    .serach {
      input {
        background: #e6e6e9;
        width: 228px;
      }
    }
    .titleViewli {
      background: #e5e7e9;
    }
  }
}
.white {
  .technology {
    overflow-x: hidden;
    .el-button--primary,
    .el-button--primary:hover {
      font-size: 14px;

      font-size: 14px;
    }
    .compiled {
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
    .notCompiled {
      width: 98px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: rgb(253, 242, 230);
      border-radius: 13px;
      color: #f4810e;
      font-size: 12px;
      display: inline-block;
    }
    .implement {
      width: 98px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: rgb(229, 243, 253);
      border-radius: 13px;
      color: #008cf2;
      font-size: 12px;
      display: inline-block;
    }
    .naught {
      width: 98px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: rgb(234, 234, 234);
      border-radius: 13px;
      color: #999999;
      font-size: 12px;
      display: inline-block;
    }
    .notExecution {
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
  }
}
.dark {
  .technology {
    .result {
      color: #fff;
    }
    .mainRight {
      float: right;
      line-height: 38px;
      input {
        //   background: #e6e6e9;
      }
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
    .implement {
      width: 98px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: rgb(47, 57, 63);
      border-radius: 13px;
      color: #35aaff;
      font-size: 12px;
      display: inline-block;
    }
    overflow-x: hidden;
    .el-button--primary,
    .el-button--primary:hover {
      font-size: 14px;
    }
    .naught {
      width: 98px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: rgb(68, 68, 68);
      border-radius: 13px;
      color: #999999;
      font-size: 12px;
      display: inline-block;
    }
    .compiled {
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
    .notCompiled {
      width: 98px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: rgb(63, 58, 43);
      border-radius: 13px;
      color: #f5b700;
      font-size: 12px;
      display: inline-block;
    }
    .notExecution {
      width: 98px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      background: rgb(63, 51, 53);
      border-radius: 13px;
      color: #ff5d75;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
