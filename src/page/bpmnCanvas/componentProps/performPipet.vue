<template>
  <div class="attributeForm">
    <div class="attrTitle">{{ $t('基本信息') }}</div>
    <div class="attrLabel topStyle">{{ $t('使用设备') }}</div>
    <div class="attrSelect">
      <el-select
        v-model="formData.deviceName"
        style="margin-top: 7px; width: 95%"
        :placeholder="$t('请选择')"
        size="small"
        @change="handleSelect"
      >
        <el-option
          v-for="(item, index) in deviceOption"
          :key="index"
          :label="item.equipmentName"
          :value="item.equipmentName"
        />
      </el-select>
    </div>
    <div class="attrLabel topStyle">{{ $t('脚本名称') }}</div>
    <div class="attrContent">
      <div
        style="display: flex; margin-top: 7px"
        class="attrFile"
      >
        <el-input
          v-model="formData.fileName"
          size="small"
          :disabled="true"
          :placeholder="$t('请选择')"
        />
        <el-button
          type="primary"
          class="filePathBtn"
          size="small"
          @click="handleFileInfo"
        >浏览</el-button>
      </div>
    </div>
    <div class="attrLabel topStyle">{{ $t('描述') }}</div>
    <div class="attrSelect">
      <el-input
        v-model="formData.desc"
        style="margin-top: 7px; width: 95%"
        :placeholder="$t('请输入')"
        type="textarea"
      />
    </div>
    <div
      class="attrLabel topStyle"
      style="display: flex; margin-bottom: 12px;"
    >
      <span>{{ $t('物料输入') }}</span>
    </div>
    <div class="attrContent">
      <template v-for="(item, index) in performPipetData">
        <div
          :key="index"
          style="margin-bottom: 16px;"
        >
          <div class="cardVariableStyle">
            <p style="margin-bottom: 7px;">{{ $t('物料名称') }}</p>
            <el-select
              v-model="item.name"
              style="margin-top: 7px; width: 100%"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item1 in commonMaterialName"
                :key="item1.id"
                :label="item1.name"
                :value="item1.name"
              />
            </el-select>
            <p style="margin-top: 17px;">{{ $t('移液工作站位置名称') }}</p>
            <el-select
              v-model="item.position"
              style="margin-top: 7px; width: 100%"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item1 in scriptListInfo"
                :key="item1.positionId"
                :label="item1.positionName"
                :value="item1.positionName"
              />
            </el-select>
          </div>
          <div class="cardBottom">
            <img
              v-if="theme === 'dark'"
              src="@/page/bpmnCanvas/img/dataDeleteDark.png"
              class="cursor cardBottomIcon"
              @click="handleDelete('in', index)"
            >
            <img
              v-else
              src="@/page/bpmnCanvas/img/deleteData.png"
              class="cursor cardBottomIcon"
              @click="handleDelete('in', index)"
            >
          </div>
        </div>
      </template>
    </div>
    <div
      class="customAddStyle"
      @click="handleAddPipetData(performPipetData)"
    >
      <span class="customAddChildStyle">+</span>
    </div>
    <div
      class="attrLabel topStyle"
      style="display: flex; margin-bottom: 12px;"
    >
      <span>{{ $t('物料输出') }}</span>
    </div>
    <div class="attrContent">
      <template v-for="(item, index) in performPipetOutData">
        <div
          :key="index"
          style="margin-bottom: 16px;"
        >
          <div class="cardVariableStyle">
            <p style="margin-bottom: 7px;">{{ $t('物料名称') }}</p>
            <el-select
              v-model="item.name"
              style="margin-top: 7px; width: 100%"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item1 in commonMaterialName"
                :key="item1.id"
                :label="item1.name"
                :value="item1.name"
              />
            </el-select>
            <p style="margin-top: 17px;">{{ $t('移液工作站位置名称') }}</p>
            <el-select
              v-model="item.position"
              style="margin-top: 7px; width: 100%"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item1 in scriptListInfo"
                :key="item1.positionId"
                :label="item1.positionName"
                :value="item1.positionName"
              />
            </el-select>
          </div>
          <div class="cardBottom">
            <img
              v-if="theme === 'dark'"
              src="@/page/bpmnCanvas/img/dataDeleteDark.png"
              class="cursor cardBottomIcon"
              @click="handleDelete('out', index)"
            >
            <img
              v-else
              src="@/page/bpmnCanvas/img/deleteData.png"
              class="cursor cardBottomIcon"
              @click="handleDelete('out', index)"
            >
          </div>
        </div>
      </template>
    </div>
    <div
      class="customAddStyle"
      @click="handleAddPipetData(performPipetOutData)"
    >
      <span class="customAddChildStyle">+</span>
    </div>
    <div v-if="isSaveDialog">
      <el-dialog
        :title="$t('脚本列表')"
        :visible.sync="isSaveDialog"
        width="40%"
        :before-close="handleClose"
      >
        <fileDialog @returnFileInfo="returnFileInfo" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as canvasAPI from '@/api/canvas'
import fileDialog from './fileDialog.vue'
export default {
  components: {
    fileDialog
  },
  props: {
    parentFormData: {
      type: Object,
      default: () => { }
    },
    positionListInfo: {
      type: Array,
      default: () => []
    },
    commonMaterialName: {
      type: Array,
      default: () => []
    },
    deviceOption: {
      type: Array,
      default: () => []
    },
    enterPipetData: {
      type: Array,
      default: () => []
    },
    outputPipetData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      performPipetData: this.enterPipetData || [],
      performPipetOutData: this.outputPipetData || [],
      isSaveDialog: false,
      theme: '',
      scriptListInfo: this.positionListInfo || [],
      formData: this.parentFormData || {}
    }
  },

  watch: {
    enterPipetData: {
      handler(newVal) {
        this.performPipetData = newVal;
      },
      deep: true
    },
    outputPipetData: {
      handler(newVal) {
        this.performPipetOutData = newVal
      },
      deep: true
    },
    parentFormData: {
      handler(newVal) {
        console.log(newVal)
        this.formData = newVal;
      },
      deep: true
    }
  },
  mounted() {
    console.log('++++++', this.parentFormData)
    this.theme = localStorage.theme ? 'dark' : 'white';
  },
  methods: {
    handleSelect(value) {
      const equipmentId = this.deviceOption.filter(item => item.equipmentName === value)[0].equipmentId;
      canvasAPI.positionQuery({ equipmentId }).then(res => {
        if (res.success) {
          this.scriptListInfo = res.data;
        }
      })
    },
    handleFileInfo() {
      this.isSaveDialog = true;
    },
    handleClose() {
      this.isSaveDialog = false;
    },
    handleAddPipetData(data) {
      let flag = false;
      this.$message.closeAll();
      data.map(item => {
        if (item.name === '' || item.position === '') {
          flag = true;
          return this.$message.warning(this.$tc(`物料名称或位置名称不允许为空`))
        }
      })
      !flag && data.push({
        name: '',
        position: ''
      })
    },
    handleDelete(type, index) {
      type === 'in' ? this.performPipetData.splice(index, 1) : this.performPipetOutData.splice(index, 1);
    },
    returnFileInfo(data) {
      this.isSaveDialog = false;
      this.formData.fileName = data.name;
    }
  }
}
</script>

<style lang="less">
.attributeForm {
  padding-left: 16px;
  text-align: left;
  line-height: 24px;
  .attrLabel {
    color: rgba(0, 0, 0, 0.5);
  }
  .attrTitle {
    font-size: 16px;
    margin-bottom: 6px;
  }
  .topStyle {
    margin-top: 10px;
  }
  .attrContent {
    .cardStyle {
      .el-input {
        width: 100%;
      }
    }
    .cardVariableStyle {
      background-color: #f6f8fa;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      width: 90%;
      padding: 10px;
      .el-input {
        width: 100%;
      }
    }
    .el-input {
      width: 80%;
    }

    .filePathBtn {
      margin-left: 7px;
      background: #00b8a4;
      color: #fff;
      font-size: 10px;
    }

    .cardStyle {
      background-color: #f6f8fa;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      width: 90%;
      padding: 10px;
      display: flex;
    }
  }
  .el-dialog__body {
    padding: 1.875rem 1.25rem;
  }
}
</style>
