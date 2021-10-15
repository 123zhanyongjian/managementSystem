<template>
  <div
    :class="themeIsDark && 'bpmnDarkAll'"
    class="bpmnAll"
  >
    <div class="bpmnTitle">
      <div
        class="titleBack"
        @click="routerReturn"
      >
        <img :src="themeIsDark ? returnImg : returnWImg ">
      </div>
      <div class="titleContent">{{ $t(title) }}</div>
      <div :class="themeIsDark ? 'titleSaveContentDark' : 'titleSaveContent'">{{ $t(`上次保存时间${saveContent}`) }}</div>
    </div>
    <div
      class="bpmnTopStyle"
      :class="themeIsDark ? 'bpmnTopStyleDark' : 'bpmnTopStyleLight'"
    >
      <template v-for="(item, index) in (theme === 'dark') ? btnArr : btnWhiteArr ">
        <customButton
          :key="index"
          :label="$t(item.label)"
          :icon="item.img"
          :type="item.type"
          :default-zoom="defaultZoom"
          :global-theme="theme"
          :class-name="item.groupClass"
          @handleReturn="handleReturn"
          @handleExport="handleExport"
          @handleAlign="(data) => handleAlign(data)"
        />
      </template>
      <div class="saveBtnStyle">
        <el-button
          size="mini"
          class="saveBtnItem"
          :class="themeIsDark && 'saveBtnItemDark'"
          @click="saveProcess"
        >{{ $t('保存流程') }}</el-button>
        <el-button
          size="mini"
          :class="themeIsDark && 'compilationBtnItemDark'"
          class="compilationBtnItem"
        >{{ $t('编译流程') }}</el-button>
        <el-button
          size="mini"
          :class="themeIsDark && 'compilationBtnItemDark'"
          class="compilationBtnItem"
        >{{ $t('执行流程') }}</el-button>
        <el-button
          size="mini"
          :class="themeIsDark && 'compilationBtnItemDark'"
          class="compilationBtnItem"
          @click="handleSee"
        >{{ $t('预览') }}</el-button>
      </div>
    </div>
    <bpmnComp
      ref="bpmnRef"
      :node-data="craftInfo.nodeData"
      @viewer="viewer"
    />
    <!-- 用于打开本地文件-->
    <input
      v-if="ishowFile"
      id="files"
      ref="refFile"
      type="file"
      style="display: none"
      accept=".xml"
      @change="importLocalFile"
    >
    <el-dialog
      title="预览"
      width="50%"
      :visible.sync="previewModelVisible"
      append-to-body
      destroy-on-close
      top="5vh"
    >
      <highlightjs
        :language="previewType"
        :code="previewResult"
      />
    </el-dialog>
    <el-dialog
      :title="craftId ? $t('编辑工艺') : $t('新增工艺')"
      :visible.sync="isSaveDialog"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item
          label="工艺名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :placeholder="$t('请输入1~50位中英文或者数字')"
          />
        </el-form-item>
        <el-form-item
          label="平台配置"
          prop="model"
        >
          <el-select
            v-model="form.configInfo"
            style="display: block"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in modelOptions"
              :key="index"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.remark"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <span
          class="footerCancel"
          @click="isSaveDialog = false"
        >{{ $t('取消') }}</span>
        <el-button
          type="primary"
          size="mini"
          @click="onSubmit"
        >{{ $t('确认') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import bpmnComp from './bpmnComp'
import customButton from './customButton.vue'
import returnImg from './img/return.png'
import exportImg from './img/export.png'
import revokeImg from './img/revoke.png'
import restoreImg from './img/restore.png'
import leftImg from './img/left.png'
import importImg from './img/import.png'
import returnWImg from './img/returnW.png'
import importWImg from './img/importW.png'
import exportWImg from './img/exportW.png'
import revokeWImg from './img/revokeW.png'
import restoreWImg from './img/restoreW.png'
import leftWImg from './img/leftW.png'
import deleteImg from './img/deleteImg.png'
import deleteWImg from './img/deleteW.png'
import connectImgDark from './img/connectImgDark.png'
import connectImg from './img/connectImg.png'
import groupImg from './img/groupImg.png'
import groupImgDark from './img/groupImgDark.png'
import * as _api from '@/api/data/data'
import * as API from '@/api/technology'
import * as canvasAPI from '@/api/canvas'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Pagecomponent',
  components: {
    bpmnComp,
    customButton
  },
  data() {
    return {
      title: '未命名工艺',
      saveContent: '-',
      defaultZoom: 1,
      bpmnModeler: null,
      previewResult: '',
      previewType: 'xml',
      previewModelVisible: false,
      returnWImg,
      returnImg,
      ishowFile: true,
      btnArr: [
        {
          label: '导入',
          img: importImg,
          type: 'import'
        },
        {
          label: '导出',
          img: exportImg,
          type: 'export'
        },
        {
          label: '伸缩',
          img: returnImg,
          type: 'zoom'
        },
        {
          label: '撤销',
          img: revokeImg,
          type: 'revoke',
          groupClass: 'group'
        },
        {
          label: '恢复',
          img: restoreImg,
          type: 'restore'
        },
        {
          label: '对齐',
          img: leftImg,
          type: 'left',
          groupClass: 'group'
        },
        {
          label: '删除',
          img: deleteImg,
          type: 'delete',
          groupClass: 'group'
        },
        {
          label: '群组',
          img: groupImgDark,
          type: 'group',
          groupClass: 'group'
        },
        {
          label: '连接',
          img: connectImgDark,
          type: 'connect'
        }
      ],
      btnWhiteArr: [
        {
          label: '导入',
          img: importWImg,
          type: 'import'
        },
        {
          label: '导出',
          img: exportWImg,
          type: 'export'
        },
        {
          label: '伸缩',
          img: returnImg,
          type: 'zoom'
        },
        {
          label: '撤销',
          img: revokeWImg,
          type: 'revoke',
          groupClass: 'group'
        },
        {
          label: '恢复',
          img: restoreWImg,
          type: 'restore'
        },
        {
          label: '对齐',
          img: leftWImg,
          type: 'left',
          groupClass: 'group'
        },
        {
          label: '删除',
          img: deleteWImg,
          type: 'delete',
          groupClass: 'group'
        },
        {
          label: '群组',
          img: groupImg,
          type: 'group',
          groupClass: 'group'
        },
        {
          label: '连接',
          img: connectImg,
          type: 'connect'
        }
      ],
      isSaveDialog: false,
      form: {
        name: '',
        configInfo: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入工艺名称', trigger: 'blur', message: '工艺名称不可为空', },
        ]
      },
      modelOptions: [{
        label: '第一期内容，暂时可非必填',
        value: '第一期内容，暂时可非必填'
      }, {
        label: '第三期内容，暂时可非必填',
        value: '第三期内容，暂时可非必填'
      }, {
        label: '测试',
        value: '测试'
      }],
      saveXml: '',
      type: '',
      isBack: false,
      craftInfo: {},
      craftId: '', //工艺id
      theme: ''
    }
  },
  computed: {
    ...mapGetters(['isSave', 'contentStateData', 'materialStateData', 'systemMaterialList', 'userMaterialList']),
    themeIsDark() {
      return this.theme === 'dark';
    }
  },
  created() {
    canvasAPI.componentQuery({}).then((res) => {
      if (res.success) {
        localStorage.setItem('paletteDataInfo', JSON.stringify(res.data))
        this.setpaletteData(res.data);
      }
    });
    this.theme = localStorage.theme ? 'dark' : 'white';
    this.type = this.$route.params.type;
    this.initGetInfo();
  },
  methods: {
    ...mapActions(['setDataInfo', 'setPositionList', 'setDeviceList']),
    ...mapMutations(['SET_ISSAVE', 'SET_CONTENTDATA', 'SET_MATERIALDATA']),
    ...mapActions(['setpaletteData']),
    initGetInfo() {
      // 禁用ctrl+s
      this.stropCtrlS();
      // 编辑数据放到缓存中
      this.initStorage();
      // 画布初始进来初始化isSave
      this.SET_ISSAVE(true);
      // 获取物料类型
      this.getDataInfo();
      // 获取设备信息
      this.getDeviceInfo();
      // 获取位置信息
      this.getPositionInfo();
      // 初始化/更新保存列表
      this.initSaveDialogInfo(this.craftInfo);
    },
    stropCtrlS() {
      document.onkeydown = function () {
        if (event.ctrlKey === true && event.keyCode === 83) {
          event.preventDefault();
        }
      }
    },
    initStorage() {
      if (this.type === 'add') {
        const materialData = [];
        const variableData = [];
        this.SET_MATERIALDATA(materialData);
        this.SET_CONTENTDATA(variableData);
        return;
      }
      this.$route.params.craftInfo && localStorage.setItem('craftInfo', JSON.stringify(this.$route.params.craftInfo));
      const craftInfo = localStorage.getItem('craftInfo') && JSON.parse(localStorage.getItem('craftInfo'));
      this.initRouteData(craftInfo);
    },

    initRouteData(craftInfo) {
      if (craftInfo) {
        this.craftInfo = craftInfo;
        this.title = craftInfo.name;
        this.craftId = craftInfo.id;
        this.saveContent = craftInfo.updateTime;
        // 物料、数据初始化
        if (craftInfo.res1) {
          const data = JSON.parse(craftInfo.res1);
          this.SET_CONTENTDATA(data.contentStateData);
          this.SET_MATERIALDATA(data.materialStateData);
        } else {
          const initData = [];
          this.SET_CONTENTDATA(initData);
          this.SET_MATERIALDATA(initData);
        }
      }
    },

    // 获取数据类型
    getDataInfo() {
      let obj = {
        pageNumber: "1",
        pageSize: 100
      }
      _api.dataPage(obj).then(res => {
        this.setDataInfo(res.data);
      })
    },
    getDeviceInfo() {
      canvasAPI.equipmentQuery({}).then(res => {
        if (res.success) {
          this.setDeviceList(res.data);
        }
      })
    },
    getPositionInfo() {
      canvasAPI.positionQuery({}).then(res => {
        if (res.success) {
          this.setPositionList(res.data);
        }
      })
    },
    viewer(data) {
      this.bpmnModeler = data;
    },
    routerReturn() {
      console.log('isSave', this.isSave);
      if (!this.isSave) {
        this.$confirm('检测到您未进行保存，请确认是否保存该工艺？', this.$tc('提示'), {
          confirmButtonText: this.$tc('确认'),
          cancelButtonText: this.$tc('取消'),
          cancelButtonClass: 'conffirmMessageCancle',
          customClass: 'miniMessage'
        }).then(() => {
          this.isSaveDialog = true;
          this.isBack = true;
        }).catch(() => {
          this.handleBack();
        });
      } else {
        this.handleBack();
      }
    },
    handleExport(data) {
      if (data === 'xml') {
        this.saveBpmn()
      } else if (data === 'svg') {
        this.handleDowloadSVG();
      }
    },
    handleReturn(data, value) {
      if (data === 'import') {
        this.handleImport();
      } else if (data === 'narrow') {
        this.processZoomOut()
      } else if (data === 'enlarge') {
        this.processZoomIn()
      } else if (data === 'zoomCenter') {
        this.processReZoom()
      } else if (data === 'revoke') {
        this.processUndo()
        this.processUndo()
      } else if (data === 'restore') {
        this.processRedo()
        this.processRedo()
      } else if (data === 'delete') {
        this.handleDeleteElement()
      } else if (data === 'connect') {
        this.onConnectionMulti();
      } else if (data === 'group') {
        this.onLassoTool();
      } else if (value) {
        this.changeZoom(value);
      }
    },

    // 导入文件
    handleImport() {
      this.$refs.refFile.click();
    },
    // 打开文件
    importLocalFile() {
      const that = this;
      const file = this.$refs.refFile.files[0];
      const isXML = file.name?.split('.')[1];
      if (isXML !== 'xml' && isXML !== 'XML') return this.$message.warning('导入文件必须是xml文件');
      const reader = new FileReader();
      this.ishowFile = false;
      reader.readAsText(file);
      reader.onload = function () {
        let xmlStr = this.result;
        that.createNewDiagram(xmlStr);
      };
    },
    async createNewDiagram(xml) {
      try {
        let { warnings } = await this.bpmnModeler.importXML(xml);
        // 导入成功后初始化数据表格
        this.initDataInfo();
        // 用于导入后更新
        this.processReZoom();
        this.ishowFile = true;
        if (warnings && warnings.length) {
          console.log('导入出错:', warnings)
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e.message || e}`);
      }
    },
    initDataInfo() {
      // 获取所有节点
      const tempElementTypeConnect = this.getAllElement();
      const materialData = [];
      const variableData = [];
      const materialInfo = ['materialenter', 'obtain', 'enterPre'];
      tempElementTypeConnect.map((item, index) => {
        const tempType = item.businessObject?.newType;
        if (tempType && materialInfo.includes(tempType)) {
          const extensionElements = item.businessObject?.extensionElements;
          const property = extensionElements?.values[0]?.values;
          const obj = {}
          property && property.map(item1 => {
            obj[item1.name] = item1.value;
          })
          property && materialData.push(obj);
        } else if (tempType === 'materialChange' || tempType === 'openTheLid') {
          const extensionElements = item.businessObject?.extensionElements;
          const tempProperty = extensionElements?.values[0];
          if (tempProperty && tempProperty.values.length > 1) {
            const templist = tempProperty.values.slice(1);
            templist.map(item1 => {
              const property = item1.values;
              const obj = {};
              property && property.map(item2 => {
                obj[item2.name] = item2.value;
              })
              property && materialData.push(obj);
            })
          }
        } else if (tempType === 'newvariable' || tempType === 'inputVariable') {
          const extensionElements = item.businessObject?.extensionElements;
          const tempProperty = extensionElements?.values[0].values;
          tempProperty && tempProperty.map(item1 => {
            const property = item1.values;
            const obj = {}
            property && property.map(item2 => {
              obj[item2.name] = item2.value;
            })
            property && variableData.push(obj);
          })
        }
      })
      materialData.map(item => {
        // 1：用户物料库，0：系统物料库
        const materialList = item.type === '1' ? this.userMaterialList.filter(aitem => aitem.id === item.id) : this.systemMaterialList.filter(aitem => aitem.id === item.id);
        item.materialType = materialList[0].materielName;
        item.color = 'black';
      })
      this.SET_MATERIALDATA(materialData);
      this.SET_CONTENTDATA(variableData);
    },
    // 获取所有节点
    getAllElement(type = 'bpmn:Task') {
      const elementRegistry = this.bpmnModeler.get('elementRegistry');
      const elementTypeConnect = elementRegistry.filter(item => item.type === type);
      return elementTypeConnect;
    },

    // 预览xml
    handleSee() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = xml;
        this.previewType = 'xml';
        this.previewModelVisible = true;
      });
    },

    async handleDowloadSVG() {
      const { err, svg } = await this.bpmnModeler.saveSVG();
      // 读取异常时抛出异常
      if (err) {
        return console.error(err);
      }
      const { href, filename } = this.setEncoded('svg', 'diagramSVG', svg);
      downloadFunc(href, filename);
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          const a = document.createElement('a');
          a.download = filename; // 指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    },

    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = 'diagramSVG', data) {
      const encodedData = encodeURIComponent(data);
      console.log(encodedData)
      return {
        filename: `${filename}.${type}`,
        href: `data:application/bpmn20-xml;charset=UTF-8,${encodedData}`,
        data: data
      };
    },

    // 返回上一层
    handleBack() {
      this.$router.go(-1)
    },

    // 导出文件
    saveBpmn() {
      this.$refs.bpmnRef.saveBpmn()
    },

    // 缩小视图
    processZoomOut(zoomStep = 0.1) {
      const newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100
      if (newZoom < 0.2) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
      }
      this.changeZoom(newZoom);
    },

    // 放大视图
    processZoomIn(zoomStep = 0.1) {
      const newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100
      if (newZoom > 4) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
      }
      this.changeZoom(newZoom);
    },

    // 自定义改变视图
    changeZoom(newZoom) {
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
    },

    // 重置视图并居中
    processReZoom() {
      this.defaultZoom = 1
      this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
    },

    // 撤销
    processUndo() {
      this.bpmnModeler.get('commandStack').undo()
    },

    // 恢复
    processRedo() {
      this.bpmnModeler.get('commandStack').redo()
    },

    // 对齐方式（上：top，下：bottom，右：right，左：left，水平居中：center，垂直居中：middle）
    handleAlign(align) {
      const Selection = this.bpmnModeler.get('selection')
      const SelectedElements = Selection.get()
      const AlignElements = this.bpmnModeler.get('alignElements')
      if (!SelectedElements || SelectedElements.length <= 1) {
        this.$message.warning('请按住 Shift 键选择多个元素对齐')
        return
      }
      AlignElements.trigger(SelectedElements, align)
    },

    // 删除元素
    handleDeleteElement() {
      const Selection = this.bpmnModeler.get('selection')
      const SelectedElements = Selection.get()
      const Modeling = this.bpmnModeler.get('modeling')
      if (!SelectedElements || SelectedElements.length < 1) {
        this.$message.warning('请按住 Shift 键至少选择一个元素')
        return
      }
      this.$confirm(this.$tc('确定删除该条数据吗?'), this.$tc('提示'), {
        confirmButtonText: this.$tc('确认'),
        cancelButtonText: this.$tc('取消'),
        cancelButtonClass: 'conffirmMessageCancle',
        customClass: 'miniMessage',
      }).then(() => {
        const newSelectedElements = SelectedElements.map(item => [item])
        newSelectedElements.forEach(item => {
          Modeling.removeElements(item)
        })
      })
    },

    // 抓手工具
    handleDrag() {
      this.bpmnModeler.get('handTool').toggle();
    },

    // 连线工具
    onConnectionMulti() {
      this.bpmnModeler.get('globalConnect').toggle();
    },

    // 平移工具
    onLassoTool() {
      this.bpmnModeler.get('lassoTool').toggle();
    },

    handleClose() {
      this.isSaveDialog = false;
    },

    // 保存接口
    saveProcess() {
      this.isBack = false;
      this.isSaveDialog = !this.form.name;
      if (!this.isSaveDialog) {
        this.onSubmit();
      }
    },

    // 保存提交接口
    async onSubmit() {
      const form = this.form;
      if (!form.name) return this.$message.warning('工艺名称不允许为空');
      let obj = {
        contentStateData: this.contentStateData,
        materialStateData: this.materialStateData
      }
      const canvasData = JSON.stringify(obj);
      const { err, svg } = await this.bpmnModeler.saveSVG();
      // 读取异常时抛出异常
      if (err) {
        return console.error(err);
      }
      const encodedData = encodeURIComponent(svg);
      const nodeImageData = `data:image/svg+xml,${encodedData}`;
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.saveXml = xml
      }).then(() => {
        this.title = this.form.name;
        const obj = {
          name: form.name,
          configInfo: form.configInfo,
          remark: form.remark,
          nodeType: 0,
          nodeData: this.saveXml,
          res1: canvasData,
          nodeImageData
        };
        if (this.craftId) {
          obj.id = this.craftId;
          API.update(obj).then((res) => {
            if (res.success) {
              this.saveContent = res.data.updateTime;
              this.$message.success(res.message)
              this.isSaveDialog = false;
              this.isBack && this.handleBack();
              this.SET_ISSAVE(true);
            }
          })
        } else {
          API.add(obj).then((res) => {
            if (res.success) {
              this.saveContent = res.data.updateTime;
              this.$message.success(res.message)
              this.craftId = res.data.id;
              this.craftInfo = res.data;
              this.isSaveDialog = false;
              this.isBack && this.handleBack();
              this.SET_ISSAVE(true);
            }
          })
        }
      })
    },

    // 获取当前时间
    getCurrentDate() {
      const currentData = new Date();
      const tempDate = currentData.toLocaleString('chinese', { hour12: false });
      const date = tempDate.replace(/\//g, '-');
      this.saveContent = date;
    },

    initSaveDialogInfo(craftInfo) {
      this.form = {
        name: craftInfo.name,
        configInfo: craftInfo.configInfo,
        remark: craftInfo.remark
      }
    }
  },
  destroyed() {
    const materialData = [];
    const variableData = [];
    this.SET_MATERIALDATA(materialData);
    this.SET_CONTENTDATA(variableData);
    localStorage.removeItem('craftInfo');
    localStorage.removeItem('paletteDataInfo');
  }
}
</script>

<style lang='less'>
.dialog-footer {
  .footerCancel {
    margin-right: 1.0625rem;
    cursor: pointer;
  }
}

.bpmnAll {
  margin-top: -60px;
  overflow: hidden;
  position: absolute;
  height: 100vh;
  .bpmnTitle {
    display: flex;
    margin-top: 10px;
    .titleBack {
      width: 50px;
      margin-bottom: 10px;
    }
    .titleBack:hover {
      transform: scale(1.2, 1.2);
    }
    .titleContent {
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
      margin-right: 29px;
    }
    .titleSaveContent {
      font-size: 14px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.4);
    }
    .titleSaveContentDark {
      font-size: 14px;
      line-height: 22px;
      color: rgba(255, 255, 255, 0.4);
    }
  }
}
.bpmnDarkAll {
  background-color: #323232;
  color: #ffffff;
}
.bpmnTopStyleDark {
  border-bottom: 1px solid #4d4d4d;
}
.bpmnTopStyleLight {
  border-bottom: 1px solid #d3d3d3;
}
.bpmnTopStyle {
  height: 60px;
  display: flex;
  padding-left: 10px;
  .saveBtnStyle {
    display: flex;
    margin-top: 7px;
    height: 35px;
    position: absolute;
    right: 45px;
    .saveBtnItem {
      margin-right: 10px;
      background: #00b8a4;
      color: #fff;
    }
    .saveBtnItemDark {
      border-color: #00b8a4;
    }
    .compilationBtnItem {
      margin-right: 10px;
      color: #00b8a4;
      border-color: #00b8a4;
    }
    .compilationBtnItemDark {
      background: #323232;
    }
  }
}
</style>
