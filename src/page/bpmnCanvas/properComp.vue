<template>
  <div
    id="common-scroll-panel"
    ref="properComp"
    :class="theme === 'dark' ? 'property-panel-black' : 'property-panel'"
    class="common-property-panel"
  >
    <el-tabs
      v-model="matrialActiveName"
      stretch
    >
      <el-tab-pane
        label="物料"
        name="first"
      >
        <div class="materialDataStyle">
          <el-table
            height="250"
            :data="materialData"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            size="small"
            :row-class-name="tableRowClassName"
            @row-click="handleMaterialRowClick"
          >
            <el-table-column
              prop="name"
              label="物料名称"
            />
            <el-table-column
              prop="color"
              label="颜色"
              width="50"
            >
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="160"
                  trigger="click"
                >
                  <div style="display: flex; flex-wrap: wrap;">
                    <div
                      v-for="(item, index) in colorArr"
                      :key="index"
                      :style="`background-color: ${item}; width: 19px; height: 19px; margin-right: 3px; margin-left: 3px;margin-top: 3px; margin-bottom: 4px; cursor: pointer;`"
                      @click="handleChangeColor(item, scope.row.index)"
                    />
                  </div>
                  <div
                    slot="reference"
                    :style="`background-color: ${scope.row.color}; width: 16px; height: 16px; border-radius: 20px; cursor: pointer; margin-left: 7px`"
                  />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="materialType"
              label="物料类"
            />
            <el-table-column
              prop="type"
              width="80"
              label="所属物料库"
              :formatter="formatter"
            />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="数据"
        name="second"
        class="propInfoStyle"
      >
        <div class="materialDataStyle">
          <el-table
            height="250"
            :data="contentData"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            size="small"
            @row-click="handleRowClick"
          >
            <el-table-column
              prop="name"
              label="数据名称"
            />
            <el-table-column
              prop="type"
              label="数据类型"
            />
            <el-table-column
              prop="inout"
              label="属性"
            />
            <el-table-column
              prop="size"
              label="尺寸"
            />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="tabPane">
      <div class="tabPaneTitle"> {{ $t('属性') }}</div>
      <div class="tabPaneInfo">
        <template v-if="element && !isOnlyShowProp">
          <div class="attributeStyle">
            <el-collapse v-model="activeNames">
              <el-collapse-item
                :title="$t('组件信息')"
                name="1"
              >
                <div class="attributeForm">
                  <div class="attrLabel">{{ $t('组件Id') }}</div>
                  <div class="attrContent">{{ form.id }}</div>
                </div>
                <div class="attributeForm">
                  <div class="attrLabel">{{ $t('组件类型') }}</div>
                  <div class="attrContent">{{ form.type }}</div>
                </div>
                <template v-if="elementType !== 'loop'">
                  <div class="attributeForm">
                    <div class="attrLabel">{{ $t('组件名称') }}</div>
                    <div class="attrContent">{{ form.name }}</div>
                  </div>
                </template>
                <template v-else>
                  <div class="attributeForm">
                    <div class="attrLabel">{{ $t('组件名称') }}</div>
                    <div class="attrContent">{{ $t('循环') }}</div>
                  </div>
                  <div class="attributeForm">
                    <div class="attrLabel">{{ $t('类型') }}</div>
                    <div class="attrContent">{{ form.name }}</div>
                  </div>
                </template>
              </el-collapse-item>
            </el-collapse>
            <template v-if="elementType === 'wait'">
              <div class="attributeForm">
                <div class="attrLabel">{{ $t('等待时间(s)') }}</div>
                <div class="attrContent">
                  <div class="inputWidthRecovery">
                    <el-input-number
                      v-model="formData.time"
                      class="inputValueLeft"
                      style="margin-top: 7px; width: 95%;"
                      size="small"
                      controls-position="right"
                      :min="0"
                    />
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="elementType === 'loop'">
              <template v-if="form.name === '循环开始'">
                <div class="attributeForm">
                  <div class="attrLabel">{{ $t('循环名称') }}</div>
                  <div class="attrContent">
                    <el-input
                      v-model="formData.name"
                      style="margin-top: 7px;"
                      size="mini"
                      placeholder="请输入"
                    />
                  </div>
                </div>
                <div class="attributeForm">
                  <div class="attrLabel">{{ $t('循环次数') }}</div>
                  <div class="attrContent">
                    <el-radio
                      v-model="formData.type"
                      label="0"
                      @change="formData.number = ''"
                    >{{ $t('变量') }}</el-radio>
                    <el-radio
                      v-model="formData.type"
                      label="1"
                      @change="formData.number = ''"
                    >{{ $t('定值') }}</el-radio>
                  </div>
                </div>
                <template v-if="formData.type === '0'">
                  <div class="attributeForm">
                    <div class="attrLabel">{{ $t('选择变量') }}</div>
                    <div class="attrSelect spaceStyle">
                      <el-select
                        v-model="formData.number"
                        placeholder="请选择"
                        size="mini"
                        style="width: 95%;"
                      >
                        <el-option
                          v-for="item in contentData"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="attributeForm">
                    <div class="attrLabel">{{ $t('输入次数(次)') }}</div>
                    <div class="attrContent spaceStyle">
                      <el-input
                        v-model="formData.number"
                        size="mini"
                      />
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="attributeForm">
                  <div class="attrLabel">{{ $t('循环开始ID') }}</div>
                  <div class="attrContent">
                    {{ startLoopId }}
                  </div>
                </div>
              </template>
            </template>
            <template v-else-if="sequenceFlow">
              <div class="attributeForm">
                <div class="attrLabel">{{ $t('前组件ID') }}</div>
                <div class="attrContent">
                  {{ sourceId }}
                </div>
              </div>
              <div class="attributeForm">
                <div class="attrLabel">{{ $t('后组件ID') }}</div>
                <div class="attrContent">
                  {{ targetId }}
                </div>
              </div>
              <div
                v-if="isJudgment"
                class="attributeForm"
              >
                <div class="attrLabel">{{ $t('判断结果') }}</div>
                <div class="attrContent">
                  <el-select
                    v-model="judgmentConnectName"
                    placeholder="请选择"
                    size="small"
                    style="width: 95%; margin-top: 5px;"
                  >
                    <el-option
                      v-for="item in judgmentOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </template>
            <template v-else-if="elementType === 'judgment'">
              <div class="attributeForm">
                <div class="attrTitle">自定义表达式</div>
                <div class="attrContent">
                  <el-input
                    v-model="formData.name"
                    style="margin-top: 7px;"
                    size="mini"
                    placeholder="请输入"
                  />
                </div>
              </div>
            </template>
            <template v-else-if="elementType === 'openTimer'">
              <div class="attributeForm">
                <div class="attrTitle">{{ $t('定时器属性') }}</div>
                <div class="attrLabel">{{ $t('变量名称') }}</div>
                <div class="attrSelect">
                  <el-select
                    v-model="formData.name"
                    placeholder="请选择"
                    style="width: 95%; margin-top: 7px;"
                    size="mini"
                  >
                    <el-option
                      v-for="item in contentData"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </div>
              </div>
            </template>
            <template v-else-if="elementType === 'writeFile' || elementType === 'readFile'">
              <div class="attributeForm">
                <div class="attrTitle">文件路径</div>
                <div class="attrContent">
                  <div
                    style="display: flex; margin-top: 5px"
                    class="attrFile"
                  >
                    <el-input
                      v-model="formData.fileName"
                      size="mini"
                      placeholder="请输入内容"
                      disabled
                    />
                    <el-button
                      type="primary"
                      size="mini"
                      class="filePathBtn"
                      @click="handleFile"
                    >浏览</el-button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="elementType === 'dataOutput'">
              <div class="attributeForm">
                <div class="attrTitle">数据信息</div>
                <div class="attrLabel">数据名称</div>
                <div class="attrSelect">
                  <el-select
                    v-model="formData.name"
                    placeholder="请选择"
                    size="small"
                    style="width: 95%; margin-top: 5px;"
                  >
                    <el-option
                      v-for="item in contentData"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </div>
              </div>
            </template>
            <template v-else-if="materialInfo.includes(elementType)">
              <div class="attributeForm">
                <div class="attrTitle">物料信息</div>
                <div class="attrLabel topStyle">所属物料库</div>
                <div class="attrContent">
                  <el-radio
                    v-model="formData.type"
                    label="1"
                    @change="handleChangeMatiral"
                  >用户物料库</el-radio>
                  <el-radio
                    v-model="formData.type"
                    label="0"
                    @change="handleChangeMatiral"
                  >系统物料库</el-radio>
                </div>
                <div class="attrLabel topStyle">{{ $t('物料类') }}</div>
                <div class="attrSelect">
                  <el-select
                    v-model="formData.id"
                    style="margin-top: 5px; width: 95%"
                    placeholder="请选择"
                    size="mini"
                    filterable
                  >
                    <el-option
                      v-for="item in commonMaterialOptions"
                      :key="item.id"
                      :label="item.materielName"
                      :value="item.id"
                    />
                  </el-select>
                </div>
                <div class="attrLabel topStyle">物料名称</div>
                <div class="attrContent topStyle">
                  <el-input
                    v-model="formData.name"
                    placeholder="请输入"
                    size="mini"
                  />
                </div>
                <template v-if="elementType === 'obtain'">
                  <div class="attrLabel topStyle">序列号</div>
                  <div class="attrContent">
                    <el-input
                      v-model="formData.serialNum"
                      placeholder="请输入内容"
                      size="mini"
                    />
                  </div>
                </template>
              </div>
            </template>
            <template v-else-if="elementType === 'newvariable' || elementType === 'inputVariable'">
              <div class="attributeForm">
                <div
                  class="attrTitle"
                  style="display: flex; margin-bottom: 12px;"
                >
                  <span>{{ $t('变量信息') }}</span>
                </div>
                <div
                  v-if="elementType === 'newvariable'"
                  class="attrContent"
                >
                  <template v-for="(item, index) in newVariableData">
                    <div
                      :key="index"
                      style="margin-bottom: 16px;"
                    >
                      <div class="cardStyle">
                        <div style="width: 50%; padding-right: 10px;">
                          <p style="margin-bottom: 7px;">{{ $t('名称') }}</p>
                          <el-input
                            v-model="item.name"
                            size="mini"
                            placeholder="请输入"
                          />
                          <div style="display: flex; margin-top: 17px">
                            <div
                              class="leftInside"
                              style="padding-right: 10px;"
                            >
                              <p style="margin-bottom: 7px;">{{ $t('值') }}</p>
                              <el-input
                                v-model="item.value"
                                size="mini"
                                placeholder="请输入"
                              />
                            </div>
                            <div class="leftInside">
                              <p style="margin-bottom: 7px;">{{ $t('尺寸') }}</p>
                              <el-input
                                v-model="item.size"
                                size="mini"
                                placeholder="请输入"
                              />
                            </div>
                          </div>
                        </div>
                        <div style="width: 50%">
                          <p>{{ $t('类型') }}</p>
                          <el-select
                            v-model="item.type"
                            style="margin-top: 7px; width: 100%"
                            placeholder="请选择"
                            size="mini"
                          >
                            <el-option
                              v-for="item1 in dataInfo"
                              :key="item1.value"
                              :label="item1.typeName"
                              :value="item1.typeName"
                            />
                          </el-select>
                          <p style="margin-top: 17px;">{{ $t('输入/输出') }}</p>
                          <el-select
                            v-model="item.inout"
                            style="margin-top: 7px; width: 100%"
                            placeholder="请选择"
                            size="mini"
                          >
                            <el-option
                              v-for="item1 in inOutputData"
                              :key="item1.value"
                              :label="item1.label"
                              :value="item1.value"
                            />
                          </el-select>
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
                  v-else
                  class="attrContent"
                >
                  <template v-for="(item, index) in newVariableData">
                    <div
                      :key="index"
                      style="margin-bottom: 16px;"
                    >
                      <div class="cardVariableStyle">
                        <p style="margin-bottom: 7px;">变量名称</p>
                        <el-input
                          v-model="item.name"
                          placeholder="请输入"
                          size="mini"
                        />
                        <p style="margin-top: 17px;">{{ $t('类型') }}</p>
                        <el-select
                          v-model="item.type"
                          style="margin-top: 7px; width: 100%"
                          placeholder="请选择"
                          size="mini"
                        >
                          <el-option
                            v-for="item1 in dataInfo"
                            :key="item1.value"
                            :label="item1.typeName"
                            :value="item1.typeName"
                          />
                        </el-select>
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
                  @click="handleAddData"
                >
                  <span class="customAddChildStyle">+</span>
                </div>
              </div>
            </template>
            <template v-else-if="elementType === 'dataCal' || elementType === 'dataCalculationPre'">
              <div class="attributeForm">
                <div class="attrTitle">数据计算</div>
                <div class="attrContent">
                  <el-button
                    v-if="elementType === 'dataCalculationPre'"
                    type="text"
                    style="margin-left: 75%;"
                    @click="handleImportFile"
                  >导入包</el-button>
                  <el-input
                    v-model="formData.name"
                    style="margin-top: 7px; width: 90%"
                    placeholder="请输入"
                    type="textarea"
                  />
                </div>
              </div>
            </template>
            <template v-else-if="getMaterialData.includes(elementType)">
              <div class="attributeForm">
                <div class="attrTitle">物料信息</div>
                <div class="attrLabel">物料名称</div>
                <div class="attrSelect">
                  <el-select
                    v-model="formData.name"
                    style="margin-top: 7px; width: 95%"
                    placeholder="请选择"
                    size="mini"
                    filterable
                  >
                    <el-option
                      v-for="item in materialData"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </div>
                <template v-if="elementType !== 'discardedMaterials' && elementType !== 'moveMaterial'">
                  <div class="attrLabel topStyle">是否移动</div>
                  <div class="attrContent">
                    <el-radio
                      v-model="formData.isMove"
                      label="1"
                      @change="formData.path = ''"
                    >是</el-radio>
                    <el-radio
                      v-model="formData.isMove"
                      label="0"
                      @change="formData.path = ''"
                    >否</el-radio>
                  </div>
                </template>
                <template v-if="formData.isMove === '1'">
                  <div class="attrLabel topStyle">
                    {{ $t(`选择`) }}{{ elementType === 'discardedMaterials' ? $t(`丢弃`) : $t(`移动`) }}{{ $t(`位置`) }}
                  </div>
                  <div class="attrContent topStyle">
                    <el-select
                      v-model="formData.path"
                      style="width: 100%"
                      placeholder="请选择"
                      size="mini"
                    >
                      <el-option
                        v-for="item in positionListInfo"
                        :key="item.positionId"
                        :label="item.positionName"
                        :value="item.positionName"
                      />
                    </el-select>
                  </div>
                </template>
              </div>
            </template>
            <template v-else-if="['shake', 'fermenterShakes'].includes(elementType)">
              <div class="attributeForm">
                <div
                  v-if="elementType === 'shake'"
                  class="attrTitle"
                >{{ $t('震动属性') }}</div>
                <div
                  v-else-if="elementType === 'fermenterShakes'"
                  class="attrTitle"
                >{{ $t('酵标仪震荡属性') }}</div>
                <div class="attrLabel">{{ $t('物料名称') }}</div>
                <div class="attrSelect">
                  <el-select
                    v-model="formData.name"
                    style="margin-top: 7px; width: 95%"
                    size="small"
                    :placeholder="$t('请选择')"
                    filterable
                  >
                    <el-option
                      v-for="item in materialData"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </div>
                <div
                  v-if="elementType === 'shake'"
                  class="attrLabel topStyle"
                >{{ $t('震动时间') }}</div>
                <div
                  v-else-if="elementType === 'fermenterShakes'"
                  class="attrLabel topStyle"
                >{{ $t('震荡时间(s)') }}</div>
                <div class="attrContent">
                  <div class="inputWidthRecovery">
                    <el-input-number
                      v-model="formData.time"
                      class="inputValueLeft"
                      style="margin-top: 7px; width: 95%;"
                      size="small"
                      controls-position="right"
                      :min="0"
                    />
                  </div>
                </div>
                <template v-if="elementType === 'fermenterShakes'">
                  <div class="attrLabel topStyle">{{ $t('选择位置') }}</div>
                  <div class="attrContent topStyle">
                    <el-select
                      v-model="formData.path"
                      style="width: 100%"
                      placeholder="请选择"
                      size="mini"
                    >
                      <el-option
                        v-for="item in positionListInfo"
                        :key="item.positionId"
                        :label="item.positionName"
                        :value="item.positionName"
                      />
                    </el-select>
                  </div>
                </template>
              </div>
            </template>
            <template v-else-if="otherMaterialName.includes(elementType)">
              <div class="attributeForm">
                <div class="attrTitle">{{ element.businessObject.name.split("\n")[0] }}属性</div>
                <div class="attrLabel">{{ $t('物料名称') }}</div>
                <div class="attrSelect">
                  <el-select
                    v-model="formData.name"
                    style="margin-top: 5px; width: 95%"
                    placeholder="请选择"
                    filterable
                    size="small"
                  >
                    <el-option
                      v-for="item in materialData"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </div>
                <template v-if="elementType !== 'opticalAbsorption'">
                  <div class="attrLabel topStyle">{{ $t('变量名称') }}</div>
                  <div class="attrSelect">
                    <el-select
                      v-model="formData.variableName"
                      style="margin-top: 5px; width: 95%"
                      placeholder="请选择"
                      filterable
                      size="small"
                    >
                      <el-option
                        v-for="item in contentData"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </div>
                </template>
                <div class="attrLabel topStyle">{{ $t('设备名称') }}</div>
                <div class="attrContent">
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
                </div>
                <template v-if="elementType === 'absorbance' || elementType === 'opticalAbsorption'">
                  <div class="attrLabel topStyle">{{ $t('吸光度波长(nm)') }}</div>
                  <div class="attrContent topStyle">
                    <div class="inputWidthRecovery">
                      <el-input-number
                        v-model="formData.wavelength"
                        class="inputValueLeft"
                        style="width: 95%;"
                        size="small"
                        controls-position="right"
                        :min="0"
                      />
                    </div>
                  </div>
                  <div class="attrLabel topStyle">{{ $t('次数') }}</div>
                  <div class="attrContent topStyle">
                    <div class="inputWidthRecovery">
                      <el-input-number
                        v-model="formData.frequency"
                        class="inputValueLeft"
                        style="width: 95%;"
                        size="small"
                        controls-position="right"
                        :min="0"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="attrLabel topStyle">{{ $t('激发波长') }}</div>
                  <div class="attrContent">
                    <div class="inputWidthRecovery">
                      <el-input-number
                        v-model="formData.wavelength"
                        class="inputValueLeft"
                        style="margin-top: 7px; width: 95%;"
                        size="small"
                        controls-position="right"
                        :min="0"
                      />
                    </div>
                  </div>
                  <div class="attrLabel topStyle">{{ $t('排放量') }}</div>
                  <div class="attrContent topStyle">
                    <el-input
                      v-model="formData.emissions"
                      size="small"
                      :placeholder="$t('请输入')"
                    />
                  </div>
                  <div class="attrLabel topStyle">{{ $t('增益模式') }}</div>
                  <div class="attrContent topStyle">
                    <el-input
                      v-model="formData.gainMode"
                      size="small"
                      :placeholder="$t('请输入')"
                    />
                  </div>
                  <div class="attrLabel topStyle">{{ $t('增益值') }}</div>
                  <div class="attrContent topStyle">
                    <el-input
                      v-model="formData.gainValue"
                      size="small"
                      :placeholder="$t('请输入')"
                    />
                  </div>
                  <div class="attrLabel topStyle">{{ $t('滞后时间') }}</div>
                  <div class="attrContent topStyle">
                    <el-input
                      v-model="formData.lagTime"
                      size="small"
                      :placeholder="$t('请输入')"
                    />
                  </div>
                  <div class="attrLabel topStyle">{{ $t('集成时间') }}</div>
                  <div class="attrContent topStyle">
                    <el-input
                      v-model="formData.integrationTime"
                      size="small"
                      :placeholder="$t('请输入')"
                    />
                  </div>
                  <div class="attrLabel topStyle">{{ $t('读延迟') }}</div>
                  <div class="attrContent topStyle">
                    <el-input
                      v-model="formData.readLatency"
                      size="small"
                      :placeholder="$t('请输入')"
                    />
                  </div>
                </template>
                <div class="attrLabel topStyle">{{ $t('范围') }}</div>
                <div class="attrContent topStyle">
                  <el-input
                    v-model="formData.range"
                    size="small"
                    :placeholder="$t('例如A2:B5')"
                  />
                </div>
                <template v-if="elementType === 'opticalAbsorption'">
                  <div class="attrLabel topStyle">{{ $t('测量结果输出') }}</div>
                  <div class="attrSelect">
                    <el-select
                      v-model="formData.variableName"
                      style="margin-top: 5px; width: 95%"
                      placeholder="请选择"
                      filterable
                      size="small"
                    >
                      <el-option
                        v-for="item in contentData"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </div>
                </template>
                <div class="attrLabel topStyle">{{ $t('描述') }}</div>
                <div class="attrSelect">
                  <el-input
                    v-model="formData.desc"
                    style="margin-top: 5px; width: 95%"
                    :placeholder="$t('请输入')"
                    type="textarea"
                  />
                </div>
              </div>
            </template>
            <template v-else-if="elementType === 'materialChange' || elementType === 'openTheLid'">
              <div class="attributeForm">
                <div class="attrTitle">{{ elementType === 'materialChange' ? $t('变更前') : $t('开盖前') }}</div>
                <div class="attrLabel">{{ $t('物料名称') }}</div>
                <div
                  v-if="elementType === 'materialChange'"
                  class="attrSelect"
                >
                  <!-- 包裹一层div为了消除浏览器渲染页面时出现的更新问题 -->
                  <div>
                    <el-select
                      v-model="formData.beforeName"
                      style="margin-top: 5px; width: 95%"
                      placeholder="请选择"
                      size="small"
                      :multiple="elementType === 'materialChange' ? true : false"
                      filterable
                    >
                      <el-option
                        v-for="(item, index) in materialData"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </div>
                </div>
                <div
                  v-else
                  class="attrSelect"
                >
                  <el-select
                    v-model="formData.lidBeforeName"
                    style="margin-top: 7px; width: 95%"
                    placeholder="请选择"
                    size="small"
                    :multiple="elementType === 'materialChange' ? true : false"
                    filterable
                  >
                    <el-option
                      v-for="(item, index) in materialData"
                      :key="index"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </div>
                <div
                  class="attrTitle"
                  style="display: flex; margin-bottom: 12px;margin-top: 10px;"
                >
                  <span>{{ elementType === 'materialChange' ? $t('变更后') : $t('开盖后') }}</span>
                </div>
                <div class="attrContent">
                  <template v-for="(item, index) in updateMaterialData">
                    <div
                      :key="index"
                      style="margin-bottom: 16px;"
                    >
                      <div class="cardVariableStyle">
                        <div class="attrLabel">{{ $t('所属物料库') }}</div>
                        <div class="attrContent">
                          <el-radio
                            v-model="item.type"
                            label="1"
                            @change="changeMatiral(item.type, index)"
                          >{{ $t('用户物料库') }}</el-radio>
                          <el-radio
                            v-model="item.type"
                            label="0"
                            @change="changeMatiral(item.type, index)"
                          >{{ $t('系统物料库') }}</el-radio>
                        </div>
                        <div class="attrLabel topStyle">{{ $t('物料类') }}</div>
                        <div class="attrSelect">
                          <el-select
                            v-model="item.id"
                            size="small"
                            style="margin-top: 7px; width: 95%"
                            :placeholder="$t('请选择')"
                            filterable
                          >
                            <el-option
                              v-for="item1 in commonOpenLidMaterialOptions(item.type)"
                              :key="item1.id"
                              :label="item1.materielName"
                              :value="item1.id"
                            />
                          </el-select>
                        </div>
                        <div class="attrLabel topStyle">{{ $t('物料名称') }}</div>
                        <div class="attrContent">
                          <el-input
                            v-model="item.name"
                            style="width:95%"
                            :placeholder="$t('请输入')"
                            size="small"
                          />
                        </div>
                      </div>
                      <div class="cardBottom">
                        <img
                          v-if="theme === 'dark'"
                          src="@/page/bpmnCanvas/img/dataDeleteDark.png"
                          class="cursor cardBottomIcon"
                          @click="handleMaterialDelete(index)"
                        >
                        <img
                          v-else
                          src="@/page/bpmnCanvas/img/deleteData.png"
                          class="cursor cardBottomIcon"
                          @click="handleMaterialDelete(index)"
                        >
                      </div>
                    </div>
                  </template>
                </div>
                <div
                  class="customAddStyle"
                  @click="handleAddMaterialData"
                >
                  <span class="customAddChildStyle">+</span>
                </div>
              </div>
            </template>
            <template v-else-if="elementType === 'performPipet'">
              <perform-pipet
                ref="performPipetRef"
                :parent-form-data="formData"
                :device-option="deviceOption"
                :common-material-name="materialData"
                :position-list-info="positionListInfo"
                :enter-pipet-data="enterPipetData"
                :output-pipet-data="outputPipetData"
              />
            </template>
            <template v-else-if="deviceComp.includes(elementType)">
              <div class="attributeForm">
                <div
                  v-if="elementType === 'shakingCulture'"
                  class="attrTitle"
                >{{ $t('震荡培养属性') }}</div>
                <template v-if="elementType !=='pcrOpenLid' && elementType !== 'pcrCloseLid'">
                  <div class="attrLabel">{{ $t('物料名称') }}</div>
                  <div class="attrSelect">
                    <el-select
                      v-model="formData.name"
                      style="margin-top: 5px; width: 95%"
                      placeholder="请选择"
                      size="small"
                      filterable
                    >
                      <el-option
                        v-for="item in materialData"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                      />
                    </el-select>
                  </div>
                </template>
                <div class="attrLabel topStyle">{{ $t('设备名称') }}</div>
                <div class="attrContent">
                  <div class="attrSelect">
                    <el-select
                      v-model="formData.deviceName"
                      style="margin-top: 7px; width: 95%"
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
                </div>
                <template v-if="elementType === 'hasPCR'">
                  <div class="attrLabel topStyle">{{ $t('PCR流程脚本名称') }}</div>
                  <div class="attrContent">
                    <div class="attrSelect">
                      <el-select
                        v-model="formData.pcrscriptname"
                        style="margin-top: 7px; width: 95%"
                        :placeholder="$t('请选择')"
                        size="small"
                      >
                        <el-option
                          v-for="(item, index) in pcrScriptOption"
                          :key="index"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </div>
                  </div>
                </template>
                <template v-if="elementType === 'shakingCulture'">
                  <div class="attrLabel topStyle">{{ $t('培养时间（s）') }}</div>
                  <div class="attrContent">
                    <div class="inputWidthRecovery">
                      <el-input-number
                        v-model="formData.time"
                        class="inputValueLeft"
                        style="margin-top: 7px; width: 95%;"
                        size="small"
                        controls-position="right"
                        :min="0"
                      />
                    </div>
                  </div>
                </template>
                <template v-if="elementType === 'liquidSeparator'">
                  <div class="attrLabel topStyle">{{ $t('物料型号') }}</div>
                  <div class="attrContent">
                    <div class="attrSelect">
                      <el-select
                        v-model="formData.model"
                        style="margin-top: 7px; width: 95%"
                        :placeholder="$t('请选择')"
                        size="small"
                      >
                        <el-option
                          v-for="(item, index) in materialModelOptions"
                          :key="index"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </div>
                  </div>
                  <div class="attrLabel topStyle">{{ $t('加液体积') }}</div>
                  <div class="attrVolume topStyle">
                    <div class="attrTable">
                      <div class="attrTableHead">
                        <div class="attrTableHeadFirst">
                          <div class="attrTableHeadFirstTriangle" />
                        </div>
                        <div
                          v-for="(item, index) in volumeLetter"
                          :key="index"
                          class="attrTableHeadFont"
                        >{{ item }}</div>
                      </div>
                      <div class="attrTableBody">
                        <div class="attrTableBodyLeft">
                          <div
                            v-for="(item, index) in columnLetter"
                            :key="index"
                            class="attrTableBodyLeftContent"
                          >
                            {{ item + 1 }}
                          </div>
                        </div>
                        <div class="attrTableBodyRight">
                          <div
                            v-for="(item,index) in volumeRowsData"
                            :key="index"
                            class="attrTableBodyRow"
                          >
                            <div
                              v-for="(item1, index1) in item"
                              :key="index1"
                              class="attrTableBodyColumn"
                              contenteditable="true"
                              @input="changeVolumeRowsData($event, index, index1)"
                              v-html="item1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="attrLabel topStyle">{{ $t('加液高度') }}</div>
                  <div class="attrContent">
                    <div class="inputWidthRecovery">
                      <el-input-number
                        v-model="formData.height"
                        class="inputValueLeft"
                        style="margin-top: 7px; width: 95%;"
                        size="small"
                        controls-position="right"
                        :min="0"
                      />
                    </div>
                  </div>
                  <div class="attrLabel topStyle">{{ $t('振荡时间（s）') }}</div>
                  <div class="attrContent">
                    <div class="inputWidthRecovery">
                      <el-input-number
                        v-model="formData.time"
                        class="inputValueLeft"
                        style="margin-top: 7px; width: 95%;"
                        size="small"
                        controls-position="right"
                        :min="0"
                      />
                    </div>
                  </div>
                </template>
                <template v-if="elementType !=='pcrOpenLid' && elementType !== 'pcrCloseLid'">
                  <div class="attrLabel topStyle">{{ $t('描述') }}</div>
                  <div class="attrSelect">
                    <el-input
                      v-model="formData.desc"
                      style="margin-top: 7px; width: 95%"
                      :placeholder="$t('请输入')"
                      type="textarea"
                    />
                  </div>
                </template>
              </div>
            </template>
            <template v-else-if="elementType === 'customPCR'">
              <custompcr
                ref="customPCRRef"
                :parent-form-data="formData"
                :device-option="deviceOption"
                :common-material-name="materialData"
                :update-stages="updateStages"
              />
            </template>
            <!-- <template v-else>
              <custom-form
                ref="customFormRef"
                :function-name="elementType"
                :comp-form="compForm"
                :comp-info="compInfo"
              />
            </template> -->
          </div>
        </template>
        <template v-if="isOnlyShowProp">
          <materialInfo
            v-if="isMaterial"
            :material-new-data="materialNewData"
            :common-material-options="commonMaterialOptions"
          />
          <template v-else>
            <dataTableInfo :new-data="newData" />
          </template>
        </template>
      </div>
    </div>
    <div
      v-if="(element && !isOnlyShowProp && elementType && !notShowSave.includes(elementType) || isJudgment)"
      class="formSaveStyle"
    >
      <div
        class="formSaveBtnStyle"
        @click="handleAllSave"
      >{{ $t('保存') }}</div>
    </div>
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
    <div v-if="isShowJudgmentDialog">
      <el-dialog
        :title="$t('判断结果')"
        :visible.sync="isShowJudgmentDialog"
        width="25%"
        :before-close="handleCloseJudgment"
      >
        <el-select
          v-model="judgmentResult"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in judgmentOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            size="mini"
            @click="onSubmitJudgment"
          >{{ $t('确认') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import * as materialAPI from '@/api/data/material';
import materialInfo from './componentProps/materialInfo';
import dataTableInfo from './componentProps/dataTableInfo';
import PerformPipet from './componentProps/performPipet.vue';
import custompcr from './componentProps/custompcr.vue';
import fileDialog from './componentProps/fileDialog.vue';
// import customForm from './componentProps/customForm.vue';
export default {
  name: 'ProperCommonComp',
  components: {
    materialInfo,
    dataTableInfo,
    PerformPipet,
    custompcr,
    fileDialog
    // customForm
  },
  props: {
    modeler: {
      type: Object,
      required: true,
      default: () => { }
    },
    parentElement: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      formData: {
        name: '',
        time: 0,
        type: '1',
        fileName: '',
        serialNum: '',
        id: '',
        isMove: '1',
        path: '',
        variableName: '',
        range: '',
        desc: '',
        deviceName: '',
        wavelength: 0,
        frequency: 0,
        model: '',
        emissions: '',
        gainMode: '',
        gainValue: '',
        lagTime: '',
        integrationTime: '',
        readLatency: '',
        pcrscriptname: '',
        volume: '',
        height: '',
        beforeName: [],
        lidBeforeName: '',
        checked: '',
        temperture: 0,
        number: ''
      },
      theme: '',
      matrialActiveName: 'first',
      materialData: [],
      contentData: [],
      activeNames: [],
      form: {
        id: '',
        type: '',
        name: '',
        value: ''
      },
      element: {},
      nameSplit: [],
      elementType: '',
      sourceId: '',
      targetId: '',
      commonMaterialOptions: [],
      newVariableData: [{
        name: '',
        type: '',
        value: '',
        size: '',
        inout: ''
      }],
      inOutputData: [{
        value: 'input',
        label: '输入'
      }, {
        value: 'output',
        label: '输出'
      }],
      startLoopId: '',
      materialInfo: ['enterPre', 'materialenter', 'obtain'],
      isOnlyShowProp: false,
      userMaterialData: [],
      systemMaterialData: [],
      getMaterialData: ['discardedMaterials', 'materialOutput', 'freed', 'moveMaterial'],
      otherMaterialName: ['opticalAbsorption', 'absorbance', 'fluorescence'],
      deviceComp: ['pcrCloseLid', 'pcrOpenLid', 'tearMembrane', 'sealMembrane', 'hasPCR', 'shakingCulture', 'sealAluminum', 'liquidSeparator'],
      notShowSave: ['pause', 'manualInput', 'collect'],
      updateMaterialData: [],
      description: '',
      pcrScriptName: '',
      pcrScriptOption: [{
        name: '设备1'
      }, {
        name: '设备2'
      }],
      materialModelOptions: [{
        name: '96Well'
      }, {
        name: '384Well'
      }],
      shakingCultureTime: 0,
      liquidHeight: 0,
      materialModel: '',
      variableValue: '',
      newData: {
        name: '',
        type: '',
        size: '',
        value: '',
        isInput: '',
        isOutput: ''
      },
      clickRowIndex: 0,
      isMaterial: false,
      materialNewData: {},
      isChangeColor: false,
      colorArr: [
        '#000000', '#7F7F7F', '#D7D7D7', '#F2F2F2',
        '#6D000E', '#A30014', '#D9001B', '#EC808D',
        '#7B4D12', '#B8741A', '#F59A23', '#FACD91',
        '#FFFF00', '#FFFF80', '#BFBF00', '#808000',
        '#95F204', '#CAF982', '#70B603', '#4B7902',
        '#00FFFF', '#80FFFF', '#00BFBF', '#008080',
        '#02A7F0', '#81D3F8', '#027DB4', '#015478',
        '#0000FF', '#8080FF', '#0000BF', '#000080',
        '#420080', '#6300BF', '#8400FF', '#C280FF'
      ],
      deviceOption: [],
      positionListInfo: [],
      enterPipetData: [],
      outputPipetData: [],
      updateStages: [],
      volumeRows: 8,
      volumeColumn: 12,
      volumeRowsData: [],
      isShowFile: false,
      compInfo: {},
      compForm: [],
      paletteData: [],
      isAddConnect: false,
      isShowJudgmentDialog: false,
      judgmentResult: '',
      connectElement: null,
      judgmentOptions: [{
        value: 'True'
      }, {
        value: 'False'
      }],
      isJudgment: false,
      judgmentConnectName: ''
    }
  },
  computed: {
    ...mapGetters(['dataInfo', 'userInfo', 'contentStateData', 'materialStateData', 'deviceList', 'positionList']),
    Task() {
      if (!this.element) return;
      return this.element.type === 'bpmn:Task'
    },
    isCollect() {
      if (!this.element) return;
      return this.element.type === 'bpmn:ParallelGateway'
    },
    sequenceFlow() {
      if (!this.element) {
        return;
      }
      return this.element.type === 'bpmn:SequenceFlow';
    },
    volumeLetter() {
      const arr = [];
      for (let i = 0; i < this.volumeColumn; i++) {
        arr.push(String.fromCharCode((65 + i)))
      }
      return arr;
    },
    columnLetter() {
      const arr = [];
      for (let i = 0; i < 8; i++) {
        arr.push(i);
      }
      return arr;
    },
    commonOpenLidMaterialOptions() {
      return function (data) {
        return data === '0' ? this.systemMaterialData : this.userMaterialData;
      }
    }
  },
  watch: {
    element: {
      handler(newVal, oldVal) {
        console.log('++++element监听', newVal, this.nameSplit, !this.sequenceFlow, this.form);
        if (!newVal) return;
        if (!this.form.name) {
          if (!this.sequenceFlow) {
            const tempS = JSON.parse(localStorage.getItem('infoType'));
            if (!tempS) return;
            localStorage.removeItem('infoType');
            let val = '';
            val = tempS.title;
            // 增加newType类型---新增属性，在xml文件以新属性展示
            const properties = {
              newType: tempS.tempTitle || ''
            }
            if (tempS.tempTitle === 'loop') {
              this.getDoubleLoopShape(tempS);
            }
            this.nameChange(val, properties);
            this.initProp();
          }
        } else {
          const name = newVal.businessObject?.name?.split('\n');
          if (this.nameSplit.length > 1) {
            const value = this.nameSplit[1];
            this.valueChange(value);
          } else if (name && name.length > 1) {
            const value = name[1];
            this.valueChange(value);
          } else {
            const value = this.isEmpty(this.nameSplit[0]);
            this.nameChange(value);
          }
        }
        if (this.sequenceFlow) {
          this.sourceId = newVal.source.id;
          this.targetId = newVal.target.id;
        }
      },
      deep: true
    },
    deviceList: {
      handler(newVal, oldVal) {
        this.deviceOption = newVal;
      }
    },
    positionList: {
      handler(newVal, oldVal) {
        this.positionListInfo = newVal
      }
    },
    materialStateData: {
      handler(newVal, oldVal) {
        this.materialData = this.deepClone(newVal);
      },
      deep: true
    },
    contentStateData: {
      handler(newVal) {
        this.contentData = this.deepClone(newVal);
      },
      deep: true
    }
  },
  mounted() {
    this.theme = localStorage.theme ? 'dark' : 'white';
    this.contentData = this.deepClone(this.contentStateData);
    this.materialData = this.deepClone(this.materialStateData);
    this.handleModeler();
    this.getMaterialInfo();
  },
  methods: {
    ...mapMutations(['SET_ISSAVE', 'SET_WIDTH', 'SET_COLOR', 'SET_CONTENTDATA', 'SET_MATERIALDATA']),
    ...mapActions(['setUserMaterialList', 'setSystemMaterialList']),
    // 将各个表单设置为初始值
    initValue() {
      this.formData = {
        name: '',
        time: 0,
        type: '1',
        fileName: '',
        serialNum: '',
        id: '',
        isMove: '1',
        path: '',
        variableName: '',
        range: '',
        desc: '',
        deviceName: '',
        wavelength: 0,
        frequency: 0,
        model: '',
        emissions: '',
        gainMode: '',
        gainValue: '',
        lagTime: '',
        integrationTime: '',
        readLatency: '',
        pcrscriptname: '',
        volume: '',
        height: '',
        beforeName: [],
        lidBeforeName: '',
        checked: '',
        temperture: 0,
        number: ''
      };
      this.newVariableData = [{
        name: '',
        type: '',
        value: '',
        size: '',
        inout: ''
      }];
      this.updateMaterialData = [];
      this.variableValue = '';
      this.description = '';
      this.pcrScriptName = '';
      this.shakingCultureTime = 0;
      this.updateStages = [];
      this.enterPipetData = [];
      this.outputPipetData = [];
      this.initmaterialType('1');
      this.initVolumeData(this.volumeColumn);
    },

    formatter(row, column) {
      if (row.type === '1') {
        return '用户物料库'
      } else {
        return '系统物料库'
      }
    },
    changeVolumeRowsData(e, index, index1) {
      this.volumeRowsData[index][index1] = e.target.innerText;
    },
    getMaterialInfo() {
      // 系统物料库获取
      materialAPI.selectMaterialTemplateList({}).then(res => {
        if (res.success) {
          this.systemMaterialData = res.data;
          this.setSystemMaterialList(res.data);
        } else {
          return this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
      // 用户物料库获取
      materialAPI.selectMaterialList({ userId: this.userInfo.id }).then(res => {
        if (res.success) {
          this.userMaterialData = res.data;
          this.setUserMaterialList(res.data);
          // this.commonMaterialOptions = res.data;
        } else {
          return this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    initProp() {
      if (!this.element) return;
      this.elementType = this.element.businessObject.newType;
      this.initValue();
      if (this.isCollect || this.conCurrent) {
        // 获取所有箭头节点
        this.handleSequenceFlowElement();
      }
    },

    // 自定义循环结束标签
    getDoubleLoopShape(tempS) {
      const modeling = this.modeler.get('modeling');
      const canvas = this.modeler.get('canvas');
      const rootElement = canvas.getRootElement();
      const elementFactory = this.modeler.get('elementFactory');
      const branchShape = elementFactory.createShape({ type: 'bpmn:Task' });
      branchShape.businessObject.name = '循环结束';
      branchShape.businessObject.newType = tempS.tempTitle || '';
      branchShape.businessObject.$attrs.startId = this.element.id;
      this.element.businessObject.$attrs.endId = branchShape.id;
      // 将循环开始组件存放到循环结束组件中
      branchShape.businessObject.$attrs.startShape = this.element;
      modeling.createShape(
        branchShape,
        {
          x: this.element.x + 100,
          y: this.element.y + 100
        },
        rootElement
      )
    },

    // 为表格每一行添加index
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },

    handleMaterialRowClick(row) {
      this.isOnlyShowProp = true;
      this.isMaterial = true;
      this.materialNewData = row
    },

    handleRowClick(row) {
      this.isOnlyShowProp = true;
      this.isMaterial = false;
      this.newData = {
        name: row.name,
        type: row.type,
        size: row.size,
        value: row.value,
        isInput: '-',
        isOutput: '-'
      }
    },

    deepClone(data) {
      return JSON.parse(JSON.stringify(data));
    },

    // 获取所有节点
    getAllElement(type = 'bpmn:Task') {
      const elementRegistry = this.modeler.get('elementRegistry');
      const elementTypeConnect = elementRegistry.filter(item => item.type === type);
      return elementTypeConnect;
    },

    handleSequenceFlowElement() {
      if (!this.element) return;
      const elementTypeConnect = this.getAllElement('bpmn:SequenceFlow');
      const targetConnect = [];
      const sourceConnect = [];
      elementTypeConnect.filter(item => {
        if (item.source.id === this.element.id) {
          sourceConnect.push(item.source);
        }
        if (item.target.id === this.element.id) {
          targetConnect.push(item.target);
        }
      });
    },

    // 功能组件基本属性
    commonMethod(value, type, isOnlyXML = false) {
      if (isOnlyXML) {
        if (type === 'range') {
          const Regx = /^[A-Za-z0-9:]*$/;
          if (value.length <= 0 || value.length > 20) {
            return this.$message({
              message: '范围长度在0-20之间',
              type: 'warning'
            });
          } else if (!Regx.test(value)) {
            return this.$message({
              message: '范围类型仅允许为数字，英文字母，英文冒号',
              type: 'warning'
            });
          }
        }
        this.handleAddLabel(type, value);
        return;
      }
    },

    handleChangeMatiral(value) {
      this.formData.id = '';
      this.initmaterialType(value);
    },

    changeMatiral(value, index) {
      this.updateMaterialData[index].id = '';
      this.initmaterialType(value);
    },
    initmaterialType(value) {
      if (value === '0') {
        this.commonMaterialOptions = this.systemMaterialData;
      } else {
        this.commonMaterialOptions = this.userMaterialData;
      }
    },

    deleteCraftInfo(data) {
      // 获取所有节点
      const tempElementTypeConnect = this.getAllElement();
      console.log('待删除的数据', data, tempElementTypeConnect);
      tempElementTypeConnect.map(item => {
        const tempName = item.businessObject?.name?.split('\n')[1];
        const temp = tempName && tempName.split(',');
        if (temp) {
          const tempIndex = temp.findIndex(item1 => item1 === data.name);
          if (tempIndex !== -1) {
            temp.splice(tempIndex, 1);
            const name = item.businessObject.name.split('\n')[0];
            this.updateProperties({ name: name ? `${name}\n${temp.join(',')}` : temp.join(',') }, item);
          }
        }
      })
    },

    // 更新物料--添加
    handleAddMaterialData() {
      this.updateMaterialData.push({
        type: '1',
        id: '',
        name: '',
        elementId: this.element.id
      })
    },

    // 更新物料--删除
    handleMaterialDelete(index) {
      const updateMaterialData = this.deepClone(this.updateMaterialData);
      updateMaterialData.splice(index, 1);
      this.updateMaterialData = updateMaterialData;
    },

    // 新建变量-添加
    handleAddData() {
      this.$message.closeAll();
      const isEmptyData = this.deepClone(this.newVariableData);
      if (isEmptyData.filter(item => item.name === '' || item.type === '').length > 0) {
        return this.$message.warning(this.$tc('存在名称或变量未填写，不允许添加'));
      }
      this.newVariableData.push(
        {
          name: '',
          type: '',
          value: '',
          size: '',
          inout: ''
        }
      )
    },

    // 新建变量-删除
    handleDelete(index) {
      const craftInfo = this.deepClone(this.newVariableData)
      // 删除工艺中所有用到此变量的信息
      // this.deleteCraftInfo(craftInfo[index]);
      // 删除属性栏中数据
      craftInfo.splice(index, 1);
      this.newVariableData = craftInfo;
      this.$forceUpdate();
    },

    handleImportFile() { },

    // 读取文件、写入文件
    handleFile() {
      this.isShowFile = true;
    },
    handleCloseFile() {
      this.isShowFile = false;
    },
    returnFileInfo(data) {
      this.isShowFile = false;
      this.formData.fileName = data.name;
    },

    // 将属性及属性值添加到节点的子节点新标签上
    handleAddLabel(name, value, calculate) {
      const isExistExtentsion = this.element.businessObject?.extensionElements?.values[0];
      this.$properties = isExistExtentsion || this.$properties;
      const moddle = this.modeler.get('moddle');
      const newElExtensionElements = moddle.create('camunda:Property', { name, value, calculate });
      const index = this.$properties.values.findIndex(item => item.name === name);
      if (index !== -1) {
        this.$properties.values[index] = newElExtensionElements;
      } else {
        this.$properties.values.push(newElExtensionElements);
      }
      // 固定craft:property只能有一组
      this.$extensions.values[0] = this.$properties;
      this.updateProperties({ extensionElements: this.$extensions });
    },

    // 批量向xml增加extensions属性，减少性能的频繁更新
    handleAllLabel(data) {
      console.log(data, '_________')
      const isExistExtentsion = this.element.businessObject?.extensionElements?.values[0];
      this.$properties = isExistExtentsion || this.$properties;
      const moddle = this.modeler.get('moddle');
      for (const i in data) {
        const newElExtensionElements = moddle.create('camunda:Property', { name: i, value: data[i] });
        const index = this.$properties.values.findIndex(item => item.name === i);
        if (index !== -1) {
          this.$properties.values[index] = newElExtensionElements;
        } else {
          this.$properties.values.push(newElExtensionElements);
        }
      }
      // 固定craft:property只能有一组
      this.$extensions.values[0] = this.$properties;
      this.updateProperties({ extensionElements: this.$extensions });
      console.log(this.element)
      if (data.desc) {
        const desc = data.desc.length > 6 ? `${data.desc.substr(0, 6)}...` : data.desc;
        this.valueChange(desc);
        return;
      }
      if (data.name) {
        this.valueChange(data.name);
        return;
      }
      if (data.variableName) {
        this.valueChange(data.variableName)
      }
    },

    handleModeler() {
      const moddle = this.modeler.get('moddle');
      // 监听节点选择变化
      this.modeler.on('selection.changed', e => {
        this.nameSplit = [];
        const element = e.newSelection[0];
        this.isOnlyShowProp = false;
        this.element = element;
        this.elementType = this.element?.businessObject?.newType;
        this.startLoopId = this.element?.businessObject?.$attrs?.startId ? this.element.businessObject.$attrs.startId : '';
        if (!element) {
          return;
        }
        this.form = {
          ...element.businessObject,
          ...element.businessObject.$attrs
        };
        if (this.sequenceFlow) {
          this.isJudgment = this.element.businessObject?.sourceRef?.newType === 'judgment';
          if (this.isJudgment) {
            this.judgmentConnectName = this.element.businessObject?.name;
          }
          return;
        }
        console.log('---selection.changed', element, element.id === this.form.id, this.$properties);
        this.initProp();
        if (element.businessObject.name && element.id === this.form.id) {
          this.updateElement(element);
          this.$properties = moddle.create('camunda:Properties', { values: [] });
          this.$extensions = moddle.create('bpmn:ExtensionElements', { values: [] });
        } else {
          this.form.type = '基础组件';
          if (element.type === 'bpmn:StartEvent') {
            this.form.name = '开始';
          } else if (element.type === 'bpmn:EndEvent') {
            this.form.name = '结束';
          } else if (element.type === 'bpmn:ParallelGateway') {
            this.form.name = '汇集';
          }
          this.$properties = moddle.create('camunda:Properties', { values: [] });
          this.$extensions = moddle.create('bpmn:ExtensionElements', { values: [] });
        }
      });
      //  监听节点属性变化
      this.modeler.on('element.changed', e => {
        this.SET_ISSAVE(false);
        this.SET_COLOR('black');
        this.nameSplit = [];
        const { element } = e;
        this.elementType = element?.businessObject?.newType;
        if (this.elementType === 'collect') {
          return;
        }
        console.log('---element.changed', element, JSON.parse(JSON.stringify(this.form)), this.elementType);
        if (!element) return;
        //  新增节点需要更新回属性面板
        if (element.id === this.form.id && element.businessObject.name) {
          this.updateElement(element);
          this.form = { ...this.form };
        }
        if (this.isAddConnect) {
          if (element.businessObject?.sourceRef?.newType === 'judgment') {
            if (!element.businessObject?.name) this.isShowJudgmentDialog = true;
            this.connectElement = element;
          }
          this.isAddConnect = !this.isAddConnect;
        }
      });

      this.modeler.on('connection.added', e => {
        this.isAddConnect = true;
      })
    },
    handleCloseJudgment() {
      this.isShowJudgmentDialog = false;
    },
    onSubmitJudgment() {
      this.isShowJudgmentDialog = false;
      this.updateProperties({ name: this.judgmentResult }, this.connectElement)
      this.judgmentResult = '';
      this.connectElement = null;
    },

    // 修改节点组件值
    updateElement(element) {
      // 自定义组件右侧属性栏联动
      // this.paletteData = JSON.parse(localStorage.getItem('paletteDataInfo'));
      // if (this.elementType && this.paletteData) {
      //   this.compInfo = this.paletteData.filter(item => item.functionName === this.elementType)[0];
      //   console.log('-----表单最初加载', this.compInfo, this.compForm, this.paletteData);
      //   if (this.compInfo) {
      //     this.compForm = JSON.parse(this.compInfo?.structure).formData;
      //   } else {
      //     this.compForm = [];
      //   }
      // }
      const isBasicComp = [
        'loop',
        'judgment',
        'wait',
        'materialenter',
        'materialOutput',
        'obtain',
        'freed',
        'materialChange',
        'newvariable',
        'dataCal',
        'dataOutput',
        'manualInput',
        'readFile',
        'writeFile',
        'discardedMaterials',
        'enterPre',
        'dataCalculationPre',
        'inputVariable',
        'openTimer'
      ];
      const type = element.businessObject.newType;
      this.nameSplit = element.businessObject.name.split('\n');
      this.form.type = isBasicComp.includes(type) ? this.$t('基础组件') : this.$t('功能组件');
      this.form.name = this.isEmpty(this.nameSplit[0]);
      const extensionElements = element.businessObject.extensionElements;
      const property = extensionElements?.values[0].values;
      const commonType = ['wait', 'loop', 'readFile', 'writeFile', 'dataOutput', 'judgment', 'openTimer', 'dataCalculationPre', 'discardedMaterials', 'materialOutput', 'freed', 'moveMaterial', 'shake', 'fermenterShakes', 'opticalAbsorption', 'absorbance', 'fluorescence', 'pcrCloseLid', 'pcrOpenLid', 'tearMembrane', 'sealMembrane', 'hasPCR', 'shakingCulture', 'sealAluminum', 'liquidSeparator', 'dataCal', 'dataCalculationPre'];
      if (type === 'newvariable' || type === 'inputVariable') {
        const newVariableData = [];
        property && property.map((item, index) => {
          const obj = {}
          for (const i in item.values) {
            obj[item.values[i].name] = item.values[i].value;
          }
          newVariableData.push(obj);
        })
        this.newVariableData = newVariableData;
      } else if (commonType.includes(type)) {
        property && property.map((item, index) => {
          this.formData[item.name] = item.value;
          if (item.name === 'volume') {
            this.volumeRowsData = JSON.parse(item.value);
          }
        })
      } else if (this.materialInfo.includes(type) && element.businessObject.extensionElements) {
        property && property.map((item, index) => {
          this.formData[item.name] = item.value;
          if (item.name === 'id') {
            this.commonMaterialOptions = this.formData.type === '0' ? this.systemMaterialData : this.userMaterialData;
          }
          if (item.name === 'color') {
            this.SET_COLOR(item.value);
          }
        })
        property && property.filter(item => item.name === 'color').length === 0 && this.SET_COLOR('#000000')
      } else if (type === 'performPipet' && element.businessObject.extensionElements) {
        const property = extensionElements?.values[0]?.values;
        property && property[0].values.map(item => {
          this.formData[item.name] = item.value;
        })
        const inputProperty = extensionElements?.values[1]?.values;
        const outputProperty = extensionElements?.values[2]?.values;
        this.enterPipetData = inputProperty && this.initPipetValue(inputProperty);
        this.outputPipetData = outputProperty && this.initPipetValue(outputProperty);
      } else if (['materialChange', 'openTheLid'].includes(type) && element.businessObject.extensionElements) {
        const extensionElements = element.businessObject.extensionElements;
        const property = extensionElements?.values[0].values;
        const newMaterialData = [];
        property && property.map((item, index) => {
          if (index === 0) {
            if (type === 'materialChange') this.formData.beforeName = item.values[0].value.split(',').filter(item1 => item1 !== '');
            if (type === 'openTheLid') this.formData.lidBeforeName = item.values[0].value;
          } else {
            const obj = {};
            for (const i in item.values) {
              obj[item.values[i].name] = item.values[i].value;
            }
            newMaterialData.push(obj);
          }
        })
        this.updateMaterialData = newMaterialData;
      } else if (type === 'customPCR') {
        const extensionElements = element.businessObject.extensionElements;
        if (!property) return;
        property.map(item => {
          this.formData[item.name] = item.value;
        })
        const stageProperty = extensionElements?.values.slice(1);
        if (!stageProperty) return;
        const updateStages = [];
        stageProperty.map(propertyItem => {
          const obj = {
            stage: '',
            cycle: 0,
            steps: []
          };
          // 过滤出所有Stage
          const tempStage = [];
          const tempNotStage = [];
          propertyItem.values.map(item => {
            if (item.name) {
              tempNotStage.push(item);
            } else {
              tempStage.push(item)
            }
          })
          tempStage.map(item => {
            const obj1 = {}
            for (const i in item.values) {
              obj1[item.values[i].name] = item.values[i].value;
            }
            obj.steps.push(obj1);
          })
          tempNotStage.map(item => {
            obj[item.name] = item.value;
          })
          updateStages.push(obj);
        })
        if (updateStages.length > 0) {
          this.updateStages = updateStages;
        }
      }
      // else if (type === '光学吸收') {
      //   property && property.map(item => {
      //     if (item.name === 'jsonValue') {
      //       this.compForm = JSON.parse(item.value);
      //     }
      //   })
      // }
    },

    initPipetValue(data) {
      const result = [];
      for (const i in data) {
        const obj = {};
        data[i].values && data[i].values.map(item => {
          obj[item.name] = item.value;
        });
        result.push(obj);
      }
      return result;
    },
    // 初始化加液体积
    initVolumeData(data) {
      const arr = [];
      for (let i = 0; i < 8; i++) {
        const temp = [];
        for (let j = 0; j < data; j++) {
          temp.push(null);
        }
        arr.push(temp);
      }
      this.volumeRowsData = arr;
    },

    // 判断是否为空
    isEmpty(value) {
      if (value) return value;
      return ''
    },
    // 属性面板名称，更新回流程节点
    nameChange(name, props) {
      if (!this.element) return;
      if (!props) {
        this.updateProperties({ name: name || this.element.businessObject?.name?.split('\n')[0] });
        return;
      } else {
        Object.assign(props, { name });
        this.updateProperties(props)
      }
    },

    // value是要更新的值，element为具体更新节点
    valueChange(value, element = this.element) {
      if (!this.element) return;
      const name = element.businessObject.name.split('\n')[0];
      this.updateProperties({ name: name ? `${name}\n${value}` : value }, element);
    },
    async handleChangeColor(color, index) {
      this.element = null;
      this.isChangeColor = false;
      const tempElementTypeConnect = this.getAllElement();
      const elementTypeConnect = tempElementTypeConnect.filter(item => {
        const temp = item.businessObject.name.split('\n');
        const name = temp.length > 1 ? temp[1].split(',')[0] : '';
        console.log(item, name, this.materialData, index);
        if (name === this.materialData[index].name) {
          return item;
        }
      });
      await this.changeColorXML(elementTypeConnect, color);
      this.materialData[index].color = color;
      this.changeColorComp(elementTypeConnect, color);
    },
    changeColorXML(elementTypeConnect, color) {
      // const tempElement = this.element;
      const moddle = this.modeler.get('moddle');
      console.log('---changeColorXMLelementTypeConnect', elementTypeConnect);
      elementTypeConnect.map(item => {
        this.$properties = moddle.create('camunda:Properties', { values: [] });
        this.element = item;
        this.nameSplit = item.businessObject?.name.split('\n');
        this.handleAddLabel('color', color);
      })
    },
    // 强制更新颜色属性-再刷新
    changeColorComp(elementTypeConnect, color) {
      const modeling = this.modeler.get('modeling');
      elementTypeConnect.map(item => {
        console.log('changeColorComp', item)
        this.SET_COLOR(color);
        const { x, y, height, width } = item;
        const newBounds = {
          x,
          y,
          height,
          width
        }
        modeling.resizeShape(item, newBounds);
      })
    },
    // 属性节点宽度
    widthChange(value) {
      if (this.element) {
        const modeling = this.modeler.get('modeling');
        console.log(modeling)
        // 改变节点宽度
        const { x, y, height, width } = this.element;
        const newBounds = {
          x,
          y,
          height,
          width
        }
        modeling.resizeShape(this.element, newBounds);
      }
    },

    // 通用的更新节点属性的方法
    updateProperties(properties, element = this.element) {
      const modeling = this.modeler.get('modeling');
      modeling.updateProperties(element, properties);
    },

    // 表单提交保存
    handleAllSave() {
      console.log(this.element);
      this.$message.closeAll();
      const newType = this.element.businessObject?.newType;
      const formData = this.deepClone(this.formData);
      const nameToXml = ['loop', 'dataOutput', 'judgment', 'openTimer', 'dataCal', 'dataCalculationPre'];
      let xmlObj = {};
      // TODO 自动化组件form表单放到json保存
      // if (newType === '光学吸收') {
      //   xmlObj.jsonValue = JSON.stringify(this.$refs.customFormRef.form);
      //   console.log('refref', this.$refs.customFormRef);
      // }
      let warningInfo = '';
      if (this.element.type === 'bpmn:SequenceFlow' && this.isJudgment) {
        this.updateProperties({ name: this.judgmentConnectName })
      }
      if (!newType) return;
      if (nameToXml.includes(newType)) xmlObj.name = formData.name;
      if (newType === 'wait') {
        xmlObj.time = formData.time;
      } else if (newType === 'loop') {
        if (!formData.name || !formData.number) return;
        xmlObj.type = formData.type;
        xmlObj.number = formData.number;
        const allElement = this.getAllElement();
        const endId = this.element.businessObject?.$attrs?.endId;
        if (endId) {
          allElement.map(item => {
            if (item.id === endId) {
              this.valueChange(formData.name, item);
            }
          })
        }
      } else if (newType === 'readFile' || newType === 'writeFile') {
        xmlObj.fileName = formData.fileName;
      } else if (this.materialInfo.includes(newType)) {
        const res = this.addMaterialInfo(formData);
        if (typeof res === 'string') {
          warningInfo = res;
        } else {
          xmlObj = res;
        }
      } else if (newType === 'newvariable' || newType === 'inputVariable') {
        this.handleSubmitVariable();
        return;
      } else if (this.getMaterialData.includes(newType)) {
        xmlObj = {
          name: formData.name,
          isMove: formData.isMove,
          path: formData.path
        }
      } else if (newType === 'shake' || newType === 'fermenterShakes') {
        xmlObj = {
          name: formData.name,
          time: formData.time,
          path: formData.path
        }
      } else if (this.otherMaterialName.includes(newType)) {
        xmlObj = {
          name: formData.name,
          deviceName: formData.deviceName,
          variableName: formData.variableName,
          desc: formData.desc,
          range: formData.range,
          wavelength: formData.wavelength
        }
        if (newType === 'absorbance' || newType === 'opticalAbsorption') {
          xmlObj.frequency = formData.frequency;
        } else {
          ['emissions', 'gainMode', 'gainValue', 'lagTime', 'integrationTime', 'readLatency'].map(item => {
            xmlObj[item] = formData[item]
          })
        }
      } else if (this.deviceComp.includes(newType)) {
        xmlObj = {
          deviceName: formData.deviceName
        }
        if (newType !== 'pcrOpenLid' || newType !== 'pcrCloseLid') {
          xmlObj.name = formData.name;
          xmlObj.desc = formData.desc
        }
        if (newType === 'hasPCR') xmlObj.pcrscriptname = formData.pcrscriptname;
        if (newType === 'shakingCulture') xmlObj.time = formData.time;
        if (newType === 'liquidSeparator') {
          xmlObj.height = formData.height;
          xmlObj.time = formData.time;
          xmlObj.model = formData.model;
          xmlObj.volume = JSON.stringify(this.volumeRowsData);
        }
      } else if (newType === 'materialChange' || newType === 'openTheLid') {
        this.changeMaterial(newType);
        return;
      } else if (newType === 'performPipet') {
        this.changePerformPipet();
        return;
      } else if (newType === 'customPCR') {
        this.changeCustomPCR();
        return;
      }
      if (warningInfo !== '') {
        this.$message.warning(this.$tc(warningInfo));
        return;
      }
      this.element && this.handleAllLabel(xmlObj);
    },

    addMaterialInfo(formData) {
      if (formData.name === '' || formData.id === '') return '物料类或物料名称不允许为空';
      const materialType = this.commonMaterialOptions.filter(item => item.id === formData.id)[0]?.materielName;
      const obj = {
        serialNum: formData.serialNum,
        name: formData.name,
        type: formData.type,
        id: formData.id,
        color: 'black',
        materialType,
        elementId: this.element.id
      }
      let flag = false;
      this.materialData.map((item, index) => {
        if (item.elementId === this.element.id) {
          // 判断物料名称修改后的是否与其他id的名字相同
          const notEleIndex = this.materialData.findIndex(item => item.name === obj.name);
          if (notEleIndex === -1) {
            // 首次点击保存判断是否存在相同组件id
            this.$set(this.materialData, index, obj);
            flag = true;
          } else if (index !== notEleIndex) {
            this.materialData.splice(index, 1);
            flag = true;
          } else {
            this.materialData.splice(index, 1, obj);
            flag = true;
          }
        }
      })
      if (!flag) {
        const notEleIndex = this.materialData.findIndex(item => item.name === obj.name);
        if (notEleIndex === -1) {
          this.materialData.push(obj);
        }
      }
      const xmlObj = {
        id: formData.id,
        serialNum: formData.serialNum,
        type: formData.type,
        name: formData.name
      };
      this.SET_MATERIALDATA(this.materialData);
      return xmlObj;
    },

    // 新建变量、输入变量数组保存
    handleSubmitVariable() {
      let flag = false;
      this.$message.closeAll();
      this.newVariableData.map((aitem, aindex) => {
        if (aitem.name === '' || aitem.type === '') {
          flag = true;
          return this.$message.warning(this.$tc(`变量名称或类型不允许为空`))
        }
      })
      if (flag) return;
      let contentData = this.deepClone(this.contentData);
      // 删掉变量中所有当前节点的数据
      contentData = contentData.filter(item1 => item1.id !== this.element.id);
      // 新建变量数组保存：newVariableData
      this.newVariableData.map((item1, index1) => {
        item1.id = this.element.id;
        const isName = contentData.findIndex(item2 => item2.name === item1.name);
        if (isName === -1) {
          contentData.push(item1);
        } else {
          contentData[isName] = item1;
        }
      })
      this.contentData = contentData;
      // 修改vuex
      this.SET_CONTENTDATA(this.contentData);
      // 修改xml
      this.setPropertyValue();
      // 修改数据表格
      this.addLabel(this.newVariableData);
    },
    setPropertyValue() {
      const moddle = this.modeler.get('moddle');
      this.$properties = moddle.create('camunda:Properties', { values: [] });
      this.newVariableData.map((item, index) => {
        const list = [];
        for (const i in item) {
          list.push(moddle.create('camunda:PropertyValue', { name: i, value: item[i] }));
        }
        this.$property = moddle.create('camunda:Property', { values: list });
        this.$properties.values[index] = this.$property;
      })
      this.$extensions.values[0] = this.$properties;
      this.updateProperties({ extensionElements: this.$extensions });
    },

    // 物料变更、开盖添加物料
    changeMaterial(newType) {
      const temp = this.deepClone(this.updateMaterialData);
      let flag = false;
      this.$message.closeAll();
      temp.map((item, index) => {
        if (item.id === '' || item.name === '') {
          flag = true;
          return this.$message.warning(this.$tc(`变更后第${index + 1}个物料类或物料名称不允许为空`))
        }
      })
      if (flag) return;
      const obj = {
        name: 'beforename',
        value: newType === 'materialChange' ? this.formData.beforeName.join(',') : this.formData.lidBeforeName
      }
      this.addMaterialTable();
      this.setMaterialProperty([obj], temp);
      this.addLabel(temp);
    },
    setMaterialProperty(data, updateMaterialData) {
      const moddle = this.modeler.get('moddle');
      this.$properties = moddle.create('camunda:Properties', { values: [] });
      const tempList = [];
      data.map(item => {
        tempList.push(moddle.create('camunda:PropertyValue', { name: item.name, value: item.value }));
      })
      this.$property = moddle.create('camunda:Property', { values: tempList });
      this.$properties.values[0] = this.$property;
      updateMaterialData.map((item, index) => {
        const list = [];
        for (const i in item) {
          list.push(moddle.create('camunda:PropertyValue', { name: i, value: item[i] }));
        }
        this.$property = moddle.create('camunda:Property', { values: list });
        this.$property.type = 'info';
        this.$properties.values[index + 1] = this.$property;
      })
      this.$extensions.values[0] = this.$properties;
      this.updateProperties({ extensionElements: this.$extensions });
    },
    addMaterialTable() {
      let flag = false;
      this.$message.closeAll();
      this.materialData.map((aitem, aindex) => {
        if (aitem.name === '' || aitem.type === '') {
          flag = true;
          return this.$message.warning(this.$tc(`物料类或物料名称不允许为空`))
        }
      })
      if (flag) return;
      let materialData = this.deepClone(this.materialData);
      // 删掉物料中所有当前节点的数据
      materialData = materialData.filter(item1 => item1.id !== this.element.id);
      // 新建物料数组保存
      const updateMaterialData = this.deepClone(this.updateMaterialData);
      updateMaterialData.map((item, index) => {
        this.commonMaterialOptions = item.type === '0' ? this.systemMaterialData : this.userMaterialData;
        const materialType = this.commonMaterialOptions.filter(bitem => bitem.id === item.id)[0].materielName;
        item.id = this.element.id;
        item.color = 'black';
        item.materialType = materialType;
        const notEleIndex = materialData.findIndex(item1 => item1.name === item.name);
        if (notEleIndex === -1) {
          materialData.push(item);
        } else {
          materialData[notEleIndex] = item;
        }
      })
      this.materialData = materialData;
      this.SET_MATERIALDATA(this.materialData);
    },
    addLabel(data) {
      let str = '';
      data.map(item => {
        str = str === '' ? item.name : `${str},${item.name}`;
      })
      this.valueChange(str);
    },

    // 移液脚本保存
    changePerformPipet() {
      const performPipetRef = this.$refs.performPipetRef;
      const formData = {
        deviceName: performPipetRef.formData.deviceName,
        desc: performPipetRef.formData.desc,
        fileName: performPipetRef.formData.fileName
      }
      const performPipetData = performPipetRef.performPipetData;
      const performPipetOutData = performPipetRef.performPipetOutData;
      this.$message.closeAll();
      if (performPipetData.length > 0) {
        const data = performPipetData[performPipetData.length - 1]
        if (data.name === '' || data.position === '') return this.$message.warning(this.$tc(`物料名称或位置名称不允许为空`));
      }
      if (performPipetOutData.length > 0) {
        const data = performPipetOutData[performPipetOutData.length - 1]
        if (data.name === '' || data.position === '') return this.$message.warning(this.$tc(`物料名称或位置名称不允许为空`));
      }
      this.setPipetSecondProperty(formData, performPipetData, performPipetOutData);
      if (formData.desc) {
        const desc = formData.desc.length > 6 ? `${formData.desc.substr(0, 6)}...` : formData.desc;
        this.valueChange(desc);
        return;
      }
      if (formData.deviceName) {
        this.valueChange(formData.deviceName);
        return;
      }
    },

    async setPipetSecondProperty(formData, performPipetData, performPipetOutData) {
      const moddle = this.modeler.get('moddle');
      this.$properties = moddle.create('camunda:Properties', { values: [] });
      const isExistExtentsion = this.element.businessObject?.extensionElements;
      this.$extensions = isExistExtentsion || this.$extensions;
      await this.setPipetProperty(formData, 0);
      await this.setPipetProperty(performPipetData, 1);
      await this.setPipetProperty(performPipetOutData, 2);
      this.updateProperties({ extensionElements: this.$extensions });
    },
    setPipetProperty(data, propIndex) {
      const moddle = this.modeler.get('moddle');
      this.$properties = moddle.create('camunda:Properties', { values: [] });
      if (propIndex === 0) {
        const list = [];
        for (const i in data) {
          list.push(moddle.create('camunda:PropertyValue', { name: i, value: data[i] }))
        }
        this.$property = moddle.create('camunda:Property', { values: list });
        this.$properties.values[0] = this.$property;
        this.$extensions.values[0] = this.$properties;
      } else if (data && data.length > 0) {
        data.map((item, index) => {
          const inOutlist = [];
          for (const i in item) {
            inOutlist.push(moddle.create('camunda:PropertyValue', { name: i, value: item[i] }));
          }
          this.$property = moddle.create('camunda:Property', { values: inOutlist });
          this.$properties.values[index] = this.$property;
        })
        this.$properties.type = propIndex === 1 ? 'enter' : 'out';
        this.$extensions.values[propIndex] = this.$properties;
      }
    },
    changeCustomPCR() {
      const customPcrRef = this.$refs.customPCRRef;
      const formData = {
        name: customPcrRef.formData.name,
        deviceName: customPcrRef.formData.deviceName,
        mode: customPcrRef.formData.mode,
        temperture: customPcrRef.formData.temperture,
        desc: customPcrRef.formData.desc,
        checked: customPcrRef.formData.checked
      };
      const stageData = customPcrRef.stagesData;
      const isNullStageData = stageData[stageData.length - 1];
      this.$message.closeAll();
      if (isNullStageData) {
        if (isNullStageData.stage === '' || isNullStageData.cycle === 0) return this.$message.warning(this.$tc('stages值不允许为空'));
        if (isNullStageData.steps.length > 0) {
          const steps = isNullStageData.steps[isNullStageData.steps.length - 1];
          if (steps.temperature === 0 || steps.rampRate === 0 || steps.holdTime === 0) return this.$message.warning(this.$tc('steps值不允许为空'))
        }
      }
      this.customPcrReturnXML(formData, stageData);
      if (formData.desc) {
        const desc = formData.desc.length > 6 ? `${formData.desc.substr(0, 6)}...` : formData.desc;
        this.valueChange(desc);
        return;
      }
      if (formData.name) {
        this.valueChange(formData.name);
        return;
      }
    },
    async customPcrReturnXML(data, stageData) {
      this.$properties = window.modeler.moddle.create('camunda:Properties', { values: [] });
      const isExistExtentsion = this.element.businessObject?.extensionElements?.values[0];
      this.$properties = isExistExtentsion || this.$properties;
      await this.setPcrProperty(data, 0);
      await this.setPcrProperty(stageData, 1);
      this.updateProperties({ extensionElements: this.$extensions });
    },
    setPcrProperty(data, propIndex) {
      const moddle = this.modeler.get('moddle');
      this.$properties = window.modeler.moddle.create('camunda:Properties', { values: [] });
      if (propIndex === 0) {
        const list = [];
        for (const i in data) {
          list.push(moddle.create('camunda:Property', { name: i, value: data[i] }))
        }
        this.$properties = moddle.create('camunda:Properties', { values: list });
        this.$extensions.values[0] = this.$properties;
      } else {
        data.map((item, index) => {
          this.$properties = window.modeler.moddle.create('camunda:Properties', { values: [] });
          const stage = item;
          const length = stage.steps.length;
          stage.steps.map((aitem, index1) => {
            const tempStep = aitem;
            const list = [];
            for (const i in tempStep) {
              list.push(window.modeler.moddle.create('camunda:PropertyValue', { name: i, value: tempStep[i] }));
            }
            this.$property = window.modeler.moddle.create('camunda:Property', { values: list });
            this.$properties.values[index1] = this.$property;
          })
          this.$properties.values[length] = window.modeler.moddle.create('camunda:Property', { name: 'cycle', value: stage.cycle });
          this.$properties.values[length + 1] = window.modeler.moddle.create('camunda:Property', { name: 'stage', value: stage.stage });
          this.$extensions.values[index + 1] = this.$properties;
        })
      }
    }
  }
}
</script>

<style lang="less">
@import './style/white.less';
@import './style/black.less';
@import './style/common.less';
</style>
