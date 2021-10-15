/* eslint-disable */
import inherits from "inherits";

import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";

/**
 * A custom rule provider that decides what elements can be
 * dropped where based on a `vendor:allowDrop` BPMN extension.
 *
 * See {@link BpmnRules} for the default implementation
 * of BPMN 2.0 modeling rules provided by bpmn-js.
 *
 * @param {EventBus} eventBus
 */
export default function CustomRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(CustomRules, RuleProvider);

CustomRules.$inject = ["eventBus"];

// 预处理组件
const pretreatmentComp = [
  "newvariable",
  "enterPre",
  "inputVariable",
  "dataCalculationPre",
];

// 只允许一个输入输出的组件集合
const allowOneConnectArr = [
  "wait",
  "pause",
  "loop",
  "manualInput",
  "materialOutput",
  "obtain",
  "freed",
  "dataOutput",
  "readFile",
  "writeFile",
  "discardedMaterials",
];

CustomRules.prototype.init = function() {
  // shape.create/connection.create为设定规则的动作
  // 1234：优先级
  // function：回调方法return为false为不通过

  this.addRule(["connection.create"], 1234, function(context) {
    console.log("+++总监听", context);
    const source = context.source;
    const target = context.target;
    if (source) {
      let flag = initIsSourceConnect(source, target);
      if (!flag) return flag;
    }
    if (target) {
      let flag = initIsTargetConnect(source, target);
      if (!flag) return flag;
    }
  });

  this.addRule("shape.create", function(context) {
    var shape = context.shape,
      target = context.target;
    var shapeBo = shape.businessObject,
      targetBo = target.businessObject;

    var allowDrop = targetBo.get("vendor:allowDrop");

    if (!allowDrop || !shapeBo.$instanceOf(allowDrop)) {
      return false;
    }
  });
};

// 定义控制组件输出数量
function initIsSourceConnect(data, targetData) {
  const newType = data.businessObject?.newType;
  const targetDataNewType = targetData.businessObject?.newType;
  const outNumber = calculateOutLineNum(data);
  console.log("connection.create.source", data, outNumber, targetData);
  // 不允许组件自连
  if (data.id === targetData.id) return false;
  // 收集并发组件不允许互相连接，汇集组件入口不允许是收集并发
  if (newType === "collect" && targetData.type === "bpmn:ParallelGateway")
    return false;
  if (newType === "collect" && targetDataNewType === "collect")
    return false;
  if (targetDataNewType === "collect" &&  newType === "loop") {
    const inNumber = calculateInLineNum(targetData);
    if (inNumber > 1) return false;
  }
  if (
    data.type === "bpmn:StartEvent" ||
    (newType !== "judgment" &&
      !pretreatmentComp.includes(newType) &&
      newType !== "collect")
  ) {
    if (outNumber > 0) return false;
    if (data.type === "bpmn:StartEvent" && targetDataNewType === "collect")
      return false;
    return true;
  }
  if (pretreatmentComp.includes(newType)) {
    return false;
  }
  return true;
}

// 计算组件连出的连线数量
function calculateOutLineNum(element) {
  // element.outgoing是element输出线数量
  const number = element.outgoing.length;
  return number;
}

// 定义控制组件输入数量
function initIsTargetConnect(sourceData, data) {
  const newType = data.businessObject?.newType;
  const sourceNewType = sourceData.businessObject?.newType;
  const inNumber = calculateInLineNum(data);
  console.log("connection.create.target", data, inNumber, sourceData);
  if (
    data.type === "bpmn:EndEvent" ||
    (!pretreatmentComp.includes(newType) &&
      newType !== "collect" &&
      data.type !== "bpmn:ParallelGateway")
  ) {
    if (inNumber > 0) return false;
    if (data.type === "bpmn:EndEvent" && sourceNewType === "collect")
      return false;
    return true;
  }
  if (pretreatmentComp.includes(newType)) {
    return false;
  }
  return true;
}

// 计算组件连入的连线数量
function calculateInLineNum(element) {
  const number = element.incoming.length;
  return number;
}
