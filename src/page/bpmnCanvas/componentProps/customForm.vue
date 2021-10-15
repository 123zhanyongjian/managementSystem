<template>
  <div class="attributeForm">
    <div
      v-if="form.length > 0"
      class="attrTitle"
    >{{ compTitle }}</div>
    <template v-for="(item, index) in form">
      <div :key="index">
        <div class="attrLabel topStyle">{{ $t(item.label) }}</div>
        <div
          v-if="item.type === 'input'"
          class="attrContent"
        >
          <el-input
            v-model="item.value"
            style="margin-top: 7px; width: 95%"
            :placeholder="$t(item.config.placeholder)"
            size="mini"
          />
        </div>
        <div
          v-else-if="item.type === 'textarea'"
          class="attrContent"
        >
          <el-input
            v-model="item.value"
            style="margin-top: 7px; width: 95%"
            :placeholder="$t(item.config.placeholder)"
            type="textarea"
          />
        </div>
        <div
          v-else-if="item.type === 'int'"
          class="attrContent"
        >
          <div class="inputWidthRecovery">
            <el-input-number
              v-model="item.value"
              :placeholder="$t(item.config.placeholder)"
              class="inputValueLeft"
              style="margin-top: 7px; width: 95%;"
              size="small"
              controls-position="right"
              :min="0"
            />
          </div>
        </div>
        <div v-else-if="item.type === 'select'">
          <div class="attrSelect">
            <el-select
              v-model="item.value"
              style="margin-top: 7px; width: 95%"
              :placeholder="$t(item.config.placeholder)"
              size="small"
              filterable
            >
              <el-option
                v-for="(aitem, aindex) in selectData(item) "
                :key="aindex"
                :label="selectLabel(aitem, item)"
                :value="selectValue(aitem, item)"
              />
            </el-select>
          </div>
        </div>
        <div
          v-else-if="item.type === 'file'"
          class="attrContent"
        >
          <div
            style="display: flex; margin-top: 5px"
            class="attrFile"
          >
            <el-input
              v-model="item.value"
              size="mini"
              :placeholder="$t(item.config.placeholder)"
              disabled
            />
            <el-button
              type="primary"
              size="mini"
              class="filePathBtn"
              @click="handleFile(index)"
            >{{ $t('浏览') }}</el-button>
          </div>
        </div>
      </div>
    </template>
    <div v-if="isShowFile">
      <el-dialog
        :title="$t('文件列表')"
        :visible.sync="isShowFile"
        width="40%"
        :before-close="handleCloseFile"
      >
        <fileDialog @returnFileInfo="returnFileInfo" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import fileDialog from './fileDialog.vue';
import { getCookies } from '@/utils/auth'
export default {
  components: {
    fileDialog
  },
  props: {
    functionName: {
      type: String,
      default: ''
    },
    compForm: {
      type: Array,
      default: () => []
    },
    compInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      form: this.compForm || [],
      formValue: '',
      isENUS: true,
      isShowFile: false,
      compTitle: '',
      formIndex: -1
    }
  },
  computed: {
    ...mapGetters(['dataInfo', 'userInfo', 'contentStateData', 'materialStateData', 'deviceList', 'positionList']),
    selectData() {
      return function (res) {
        let data = [];
        const optionType = res.config?.optionType;
        if (optionType === 'position') {
          data = this.positionList;
        } else if (optionType === 'equipment') {
          data = this.deviceList;
        } else if (optionType === 'materiel') {
          data = this.materialStateData;
        } else if (optionType === 'variable') {
          data = this.contentStateData;
        }
        return data;
      }
    },
    selectLabel() {
      return function (item, data) {
        const optionType = data.config?.optionType;
        if (optionType === 'position') {
          return item.positionName;
        } else if (optionType === 'equipment') {
          return item.equipmentName;
        } else if (optionType === 'materiel' || optionType === 'variable') {
          return item.name;
        }
        return item.value;
      }
    },
    selectValue() {
      return function (item, data) {
        const optionType = data.config?.optionType;
        if (optionType === 'position') {
          return item.positionName;
        } else if (optionType === 'equipment') {
          return item.equipmentName;
        } else if (optionType === 'materiel' || optionType === 'variable') {
          return item.name;
        }
        return item.value;
      }
    }
  },
  watch: {
    compForm: {
      handler(newVal) {
        console.log('表单信息', newVal);
        this.form = newVal;
      },
      deep: true
    },
    compInfo: {
      handler(newVal) {
        console.log('组件信息', newVal);
        if (!newVal) return;
        this.compTitle = `${this.isENUS ? newVal.componentEnglish : newVal.component}属性`;
      },
      deep: true
    }
  },
  mounted() {
    this.isENUS = getCookies('LANG_6PL_E3') === 'en_US';
    if (!this.compInfo) return;
    this.compTitle = `${this.isENUS ? this.compInfo.componentEnglish : this.compInfo.component}属性`;
  },
  methods: {
    // 读取文件、写入文件
    handleFile(index) {
      this.formIndex = index;
      this.isShowFile = true;
    },
    handleCloseFile() {
      this.isShowFile = false;
    },
    returnFileInfo(data) {
      this.isShowFile = false;
      this.form[this.formIndex].value = data.name;
      this.formIndex = -1;
    }
  }
}
</script>

<style lang="less">
@import '../style/common';
@import '../style/white';
@import '../style/black';
</style>
