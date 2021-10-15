<template>
  <div class="attributeForm">
    <div class="attrTitle">{{ $t('运行自定义PCR流程') }}</div>
    <div class="attrLabel topStyle">{{ $t('物料名称') }}</div>
    <div class="attrSelect">
      <el-select
        v-model="formData.name"
        style="margin-top: 5px; width: 95%"
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
    </div>
    <div class="attrLabel topStyle">{{ $t('设备名称') }}</div>
    <div class="attrSelect">
      <el-select
        v-model="formData.deviceName"
        style="margin-top: 5px; width: 95%"
        :placeholder="$t('请选择')"
        size="small"
      >
        <el-option
          v-for="(item, index) in deviceOption"
          :key="index"
          :label="item.equipmentName"
          :value="item.equipmentName"
        />
      </el-select>
    </div>
    <div class="attrLabel topStyle">{{ $t('Run Mode') }}</div>
    <div class="attrSelect">
      <el-select
        v-model="formData.mode"
        style="margin-top: 5px; width: 95%"
        :placeholder="$t('请选择')"
        size="small"
      >
        <el-option
          v-for="(item, index) in runModeOption"
          :key="index"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </div>
    <div class="attrLabel topStyle">
      <span>{{ $t('Cover Temperture') }}</span>
      <el-checkbox
        v-model="formData.checked"
        class="attrCheckbox"
      />
    </div>
    <div class="attrContent topStyle">
      <div class="inputWidthRecovery">
        <el-input-number
          v-model="formData.temperture"
          :disabled="!formData.checked"
          class="inputValueLeft"
          style="width: 95%;"
          size="small"
          controls-position="right"
          :min="0"
        />
      </div>
    </div>
    <div class="attrLabel topStyle">{{ $t('描述') }}</div>
    <div class="attrSelect">
      <el-input
        v-model="formData.desc"
        style="margin-top: 7px; width: 97%"
        :placeholder="$t('请输入')"
        type="textarea"
      />
    </div>
    <div
      class="attrLabel topStyle"
      style="display: flex; margin-bottom: 12px;"
    >
      <span>{{ $t('Stages') }}</span>
    </div>
    <div class="attrContent">
      <template v-for="(item, index) in stagesData">
        <div
          :key="index"
          style="margin-bottom: 16px;"
        >
          <div class="cardVariableStyle">
            <p style="margin-bottom: 7px;">{{ $t('Stage') }}</p>
            <el-input
              v-model="item.stage"
              :placeholder="$t('请输入')"
              size="mini"
            />
            <p style="margin-top: 17px;">{{ $t('Cycle') }}</p>
            <div :class="theme === 'dark' ? 'inputWidthSecondRecoveryDark' : 'inputWidthSecondRecovery'">
              <el-input-number
                v-model="item.cycle"
                class="inputValueLeft"
                style="width: 100%;"
                size="small"
                controls-position="right"
                :min="0"
              />
            </div>
            <div
              class="attrLabel"
              style="display: flex; margin-bottom: 12px; margin-top: 17px;"
            >
              <span>{{ $t('Steps') }}</span>
            </div>
            <template v-for="(item1, index1) in item.steps">
              <div
                :key="index1"
                :class="theme ==='dark' ? 'cardInsideStyleDark' : 'cardInsideStyle'"
              >
                <p style="margin-bottom: 7px; margin-top: 7px;">{{ $t('Temperature(℃)') }}</p>
                <div class="inputWidthRecovery">
                  <el-input-number
                    v-model="item1.temperature"
                    class="inputValueLeft"
                    style="width: 100%;"
                    size="small"
                    controls-position="right"
                    :min="0"
                  />
                </div>
                <p style="margin-bottom: 7px; margin-top: 7px;">{{ $t('Rame Rate(%)') }}</p>
                <div class="inputWidthRecovery">
                  <el-input-number
                    v-model="item1.rampRate"
                    class="inputValueLeft"
                    style="width: 100%;"
                    size="small"
                    controls-position="right"
                    :min="0"
                  />
                </div>
                <p style="margin-bottom: 7px; margin-top: 7px;">{{ $t('Hold Time(S)') }}</p>
                <div class="inputWidthRecovery">
                  <el-input-number
                    v-model="item1.holdTime"
                    class="inputValueLeft"
                    style="width: 100%;"
                    size="small"
                    controls-position="right"
                    :min="0"
                  />
                </div>
                <div class="cardBottom">
                  <img
                    v-if="theme === 'dark'"
                    src="@/page/bpmnCanvas/img/dataDeleteDark.png"
                    class="cursor cardBottomDelete"
                    @click="handleStepDelete(index)"
                  >
                  <img
                    v-else
                    src="@/page/bpmnCanvas/img/deleteData.png"
                    class="cursor cardBottomDelete"
                    @click="handleStepDelete(index, index1)"
                  >
                </div>
              </div>
            </template>
            <div
              :class="theme === 'dark' ? 'customCardAddStyleDark' : 'customCardAddStyle'"
              @click="handleAddSteps(index)"
            >
              <span class="customAddChildStyle">+</span>
            </div>
          </div>
          <div class="cardBottom">
            <img
              v-if="theme === 'dark'"
              src="@/page/bpmnCanvas/img/dataDeleteDark.png"
              class="cursor cardBottomIcon"
              @click="handleDelete(index)"
            >
            <img
              v-else
              src="@/page/bpmnCanvas/img/deleteData.png"
              class="cursor cardBottomIcon"
              @click="handleDelete(index)"
            >
          </div>
        </div>
      </template>
    </div>
    <div
      class="customAddStyle"
      @click="handleAddStages"
    >
      <span class="customAddChildStyle">+</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    parentFormData: {
      type: Object,
      default: () => { }
    },
    deviceOption: {
      type: Array,
      default: () => []
    },
    commonMaterialName: {
      type: Array,
      default: () => []
    },
    updateStages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      runModeOption: [{
        name: 'Fast'
      }, {
        name: '9700 Simulation'
      }],
      checked: '',
      stagesData: this.updateStages || [],
      theme: '',
      formData: this.parentFormData || {}
    }
  },
  watch: {
    updateStages: {
      handler(newVal) {
        this.stagesData = newVal;
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
    this.theme = localStorage.theme ? 'dark' : 'white';
  },
  methods: {
    handleAddStages() {
      this.$message.closeAll();
      const length = this.stagesData.length;
      if (length > 0) {
        const stagesData = this.stagesData[length - 1];
        if (stagesData.stage === '' || stagesData.cycle === 0) return this.$message.warning(this.$tc('stages值不允许为空'));
        if (stagesData.steps.length > 0) {
          const steps = stagesData.steps[stagesData.steps.length - 1];
          if (steps.temperature === 0 || steps.rampRate === 0 || steps.holdTime === 0) return this.$message.warning(this.$tc('steps值不允许为空'));
        }
      }
      this.stagesData.push({
        stage: '',
        cycle: 0,
        steps: []
      })
    },
    handleDelete(index) {
      const stagesData = JSON.parse(JSON.stringify(this.stagesData));
      stagesData.splice(index, 1);
      this.stagesData = stagesData;
    },
    handleAddSteps(index) {
      const stagesData = JSON.parse(JSON.stringify(this.stagesData));
      const tempLength = stagesData[index].steps?.length;
      this.$message.closeAll();
      if (tempLength > 0) {
        const tempSteps = stagesData[index].steps[tempLength - 1];
        if (tempSteps.temperature === 0 || tempSteps.rampRate === 0 || tempSteps.holdTime === 0) return this.$message.warning(this.$tc('steps值不允许为空'));
      }
      stagesData[index].steps.push({
        temperature: 0,
        rampRate: 0,
        holdTime: 0
      });
      this.stagesData = stagesData;
    },
    handleStepDelete(index, index1) {
      const stagesData = JSON.parse(JSON.stringify(this.stagesData));
      stagesData[index].steps.splice(index1, 1);
      this.stagesData = stagesData;
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
    .titleStagesAdd {
      margin-left: 77%;
    }
    .titleSecondAdd {
      margin-left: 79%;
    }
    .attrCheckbox {
      margin-left: 6px;
    }
  }
  .attrTitle {
    font-size: 16px;
    margin-bottom: 6px;
  }
  .topStyle {
    margin-top: 10px;
  }
  .attrContent {
    .attrFile {
      .el-input {
        width: 63%;
      }
    }
    .cardStyle {
      .el-input {
        width: 100%;
      }
    }
    .cardVariableStyle {
      color: rgba(0, 0, 0, 0.5);
      background-color: #f6f8fa;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      width: 90%;
      padding: 10px;
      .el-input {
        width: 100%;
      }
      .inputWidthSecondRecovery {
        .inputValueLeft {
          .el-input {
            input {
              text-align: left;
              background-color: #ffffff;
            }
          }
        }
      }
      .inputWidthSecondRecoveryDark {
        .inputValueLeft {
          .el-input {
            input {
              text-align: left;
            }
          }
        }
      }
      .cardInsideStyle {
        background-color: #ffffff;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        width: 93%;
        padding: 10px;
        margin-bottom: 15px;
      }

      .cardInsideStyleDark {
        background-color: #323232;
        border-radius: 6px;
        border: 1px solid rgba(211, 211, 211, 0.13);
        width: 93%;
        padding: 10px;
        margin-bottom: 15px;
        input {
          border: 1px solid rgba(211, 211, 211, 0.13);
        }
      }

      .customCardAddStyle {
        height: 31px;
        border: 1px dashed rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        cursor: pointer;

        .customAddChildStyle {
          margin-left: 45%;
          font-size: 40px;
          color: rgba(0, 0, 0, 0.2);
        }
      }
      .customCardAddStyleDark {
        height: 31px;
        border: 1px dashed rgba(255, 255, 255, 0.25);
        border-radius: 4px;
        cursor: pointer;

        .customAddChildStyle {
          margin-left: 45%;
          font-size: 40px;
          color: rgba(255, 255, 255, 0.2);
        }
      }
    }
    .el-input {
      width: 80%;
    }
    .cardStyle {
      background-color: #f6f8fa;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      width: 90%;
      padding: 10px;
      display: flex;
    }
    .inputWidthRecovery {
      .el-input {
        width: 100%;
      }
      .inputValueLeft {
        input {
          text-align: left;
        }
      }
    }
  }
}
</style>
