/* eslint-disable */
import { is } from "bpmn-js/lib/util/ModelUtil";
import { assign } from "min-dash";
import store from "@/store";
import {
  attr as svgAttr,
  remove as svgRemove,
  create as svgCreate,
  append as svgAppend,
} from "tiny-svg";
import {
  drawLine,
  drawCircle,
  drawRect,
  drawDiamond,
  drawPath,
  drawHorizonLine,
  drawEllipse,
} from "../utils";
import { customConfig } from "../utils";
let TASK_BORDER_RADIUS = 12;
let theme = localStorage.theme ? true : false;
const defineTypeCompObj = {
  循环: "loop",
  判断: "judgment",
  等待: "wait",
  暂停: "pause",
  物料输入: "materialenter",
  物料变更: "materialChange",
  数据计算: "dataCal",
  物料输出: "materialOutput",
  获取物料: "obtain",
  物料释放: "freed",
  数据输出: "dataOutput",
  读取文件: "readFile",
  写入文件: "writeFile",
  丢弃物料: "discardedMaterials",
  光学吸收: "opticalAbsorption",
  震荡培养: "shakingCulture",
  酵标仪振荡: "fermenterShakes",
  执行移液脚本: "performPipet",
  移动物料: "moveMaterial",
  开盖: "openTheLid",
  人工输入: "manualInput",
  新建变量: "newvariable",
  启动定时器: "openTimer",
  输入变量: "inputVariable",
  震动组件: "shake",
  吸光度测量组件: "absorbance",
  荧光测量组件: "fluorescence",
  PCR关盖: "pcrCloseLid",
  PCR开盖: "pcrOpenLid",
  撕膜: "tearMembrane",
  封透气膜: "sealMembrane",
  封铝膜: "sealAluminum",
  分液器: "liquidSeparator",
  运行已有PCR: "hasPCR",
  运行自定义PCR: "customPCR",
  收集并发: "collect",
};
function createAction(
  type,
  group,
  className,
  title,
  imageUrl = "",
  drawShape,
  tempTitle
) {
  function createListener(event, autoActivate, elementFactory, create) {
    console.log("+++++tempTitle", tempTitle);
    let obj = {
      title: title === "循环" ? "循环开始" : title,
      tempTitle,
    };
    localStorage.setItem("infoType", JSON.stringify(obj));
    var shape;
    let width = 100;
    let height = 60;
    if (title === "收集并发") {
      width = 240;
      height = 6;
    } else if (title === "等待" || title === "暂停") {
      width = 40;
      height = 40;
    } else if (title === "判断") {
      width = 120;
      height = 80;
    } else if (title === "循环") {
      height = 40;
      width = 60;
    }
    shape = elementFactory.createShape({
      type,
      width,
      height,
    });
    create.start(event, shape);
  }

  const config = {
    type,
    group: group,
    className: className,
    title: title,
    drawShape: drawShape,
    action: {
      dragstart: createListener,
      click: createListener,
    },
  };
  if (imageUrl) {
    assign(config, {
      imageUrl,
    });
  }
  if (drawShape) {
    assign(config, {
      drawShape,
    });
  }

  return config;
}

// svg图形构造
function drawShape(parentNode, element, bpmnRenderer) {
  let shape;
  const newType = element.businessObject.newType;
  console.log("+++++震荡培养", newType);
  if (!newType) return;
  const propertyArr =
    element.businessObject.extensionElements?.values[0]?.values;
  let color = "";
  propertyArr &&
    propertyArr.map((item) => {
      if (item.name === "color") {
        color = item.value;
      }
    });
  if (newType === "wait" || newType === "pause") {
    const attr = customConfig[newType].attr;
    const url = customConfig[newType].url;
    const customIcon = svgCreate("image", {
      ...attr,
      href:
        process.env.NODE_ENV === "production"
          ? "https://devcloud.vpclub.cn/exp/website/" + url
          : "http://localhost:8080/" + url,
    });
    element["width"] = attr.width;
    element["height"] = attr.height;
    svgAppend(parentNode, customIcon);
    return customIcon;
  } else if (newType === "collect") {
    let width = element.width || 240;
    let height = 6;
    let rect = drawLine(parentNode, 0, width - 20, "black");
    drawLine(parentNode, 5, width - 20, "black");
    element.width = width;
    element.height = height;
    svgAppend(parentNode, rect);
    return rect;
  } else {
    shape = bpmnRenderer.drawShape(parentNode, element);
    svgAttr(shape, {
      fill: "#f6f8fa",
      stroke: "none",
    });
  }
  if (is(element, "bpmn:Task")) {
    let height = 60,
      width = 100;
    // 过程组件
    const processComp = [
        "materialenter",
        "materialChange",
        "dataCal",
        "opticalAbsorption",
        "震荡培养",
        "fermenterShakes",
        "performPipet",
        "moveMaterial",
        "openTheLid",
        "openTimer",
        "shake",
        "absorbance",
        "fluorescence",
        "pcrOpenLid",
        "pcrCloseLid",
        "tearMembrane",
        "sealMembrane",
        "sealAluminum",
        "liquidSeparator",
        "hasPCR",
        "customPCR",
      ],
      // 输入/输出组件
      inOutputComp = [
        "materialOutput",
        "obtain",
        "freed",
        "dataOutput",
        "readFile",
        "writeFile",
        "discardedMaterials",
      ],
      // 预处理组件
      pretreatmentComp = [
        "newvariable",
        "enterPre",
        "inputVariable",
        "dataCalculationPre",
      ];
    let inColor = "";
    if (newType === "loop") {
      height = 40;
      width = 60;
      const d = `M10 0 L50 0 L60 8 L60 40 L0 40 L0 8 Z`,
        rect = drawPath(parentNode, d);
      element.width = width;
      element.height = height;
      return rect;
    } else if (newType === "judgment") {
      width = 120;
      height = 80;
      const rect = drawDiamond(parentNode, width, height);
      element.width = width;
      element.height = height;
      return rect;
    } else if (pretreatmentComp.includes(newType)) {
      TASK_BORDER_RADIUS = 0;
      let rect = drawHorizonLine(parentNode, 4, 60, "black");
      rect = drawHorizonLine(parentNode, width - 4, 60, "black");
      rect = drawRect(parentNode, width, height, TASK_BORDER_RADIUS);
      svgAttr(rect, {
        fill: "#f6f8fa",
      });
      prependTo(rect, parentNode);
      svgRemove(shape);
      element.width = width;
      element.height = height;
      return shape;
    } else if (inOutputComp.includes(newType)) {
      const d = `M0 0 L100 0 Q94 30, 100 60 L0 60 Q -6 30, 0 -1`,
        rect = drawPath(parentNode, d);
      element.width = width;
      element.height = height;
      return rect;
    } else if (newType === "manualInput") {
      const d = `M0 0 L96 0 L100 60 L0 60 Z`,
        rect = drawPath(parentNode, d);
      element.width = width;
      element.height = height;
      return rect;
    } else {
      // inColor = color ? color : store.getters.color;
      // console.log("---inColor", inColor, color, store.getters.color);
      // const rect1 = drawEllipse(parentNode, 10, 10, inColor);
      // svgAttr(rect1, {
      //   transform: `translate(${element.width - 14}, 1)`,
      //   stroke: "black",
      // });
      // prependTo(rect1, parentNode);
      TASK_BORDER_RADIUS = 0;
      const rect = drawRect(parentNode, width, height, TASK_BORDER_RADIUS);
      svgAttr(rect, {
        fill: "#f6f8fa",
      });
      prependTo(rect, parentNode);
      svgRemove(shape);
      element.width = width;
      element.height = height;
      return shape;
    }
    // else if (name === '收集并发'){
    //   width = 240
    //   height = 6
    //   let rect = drawLine(parentNode, 0, width - 20, 'black')
    //   drawLine(parentNode, 5, width - 20, 'black')
    //   element.width = width
    //   element.height = height
    //   return rect
    // }
  }
}

function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}

const actionZh = [
    // 0-9
    "循环",
    "判断",
    "等待",
    "物料输入",
    "物料输出",
    "获取物料",
    "物料释放",
    "物料变更",
    "新建变量",
    "数据计算",
    // 10-19
    "数据输入",
    "数据输出",
    "读取文件",
    "写入文件",
    "光学吸收",
    "震荡培养",
    "酵标仪振荡",
    "执行移液脚本",
    "移动物料",
    "开盖",
    // 20-29
    "丢弃物料",
    "人工输入",
    "物料输入(预)",
    "输入变量",
    "数据计算(预)",
    "启动定时器",
    "震动组件",
    "吸光度测量组件",
    "荧光测量组件",
    "PCR开盖",
    // 30-39
    "PCR关盖",
    "撕膜",
    "封透气膜",
    "运行已有PCR",
    "运行自定义PCR",
    "暂停",
    "封铝膜",
    "分液器",
  ],
  actionArr = actionZh;
let exportPalette = {
  "create.collect": createAction(
    "bpmn:Task",
    "event",
    "bpmn-customIcon-collect",
    "收集并发",
    theme ? require("../img/collect.png") : require("../img/collectW.png"),
    drawShape,
    "collect"
  ),
  "create.loop": createAction(
    "bpmn:Task",
    "activity",
    "bpmn-icon-task-custom-bing",
    actionArr[0],
    theme ? require("../img/loop.png") : require("../img/loopW.png"),
    drawShape,
    "loop"
  ),
  "create.judgment": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[1],
    theme ? require("../img/judgment.png") : require("../img/judgmentW.png"),
    drawShape,
    "judgment"
  ),
  "create.wait": createAction(
    "bpmn:Task",
    "activity",
    "bpmn-icon-task-customBottom",
    actionArr[2],
    theme ? require("../img/wait.png") : require("../img/waitW.png"),
    drawShape,
    "wait"
  ),
  "create.pause": createAction(
    "bpmn:Task",
    "activity",
    "bpmn-icon-task-customBottom",
    actionArr[35],
    theme ? require("../img/wait.png") : require("../img/waitW.png"),
    drawShape,
    "pause"
  ),
  "create.selfWrite": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[21],
    theme
      ? require("../img/manualInput.png")
      : require("../img/manualInputW.png"),
    drawShape,
    "manualInput"
  ),
  "create.openTimer": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[25],
    require("../img/timer.png"),
    drawShape,
    "openTimer"
  ),
  "material-separator": {
    group: "activity",
    separator: true,
  },
  "material-title": {
    group: "activity",
    titleName: "物料管理",
  },
  "create.enter": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[3],
    theme
      ? require("../img/materialEnter.png")
      : require("../img/materialEnterW.png"),
    drawShape,
    "materialenter"
  ),
  "create.enterPre": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[22],
    theme
      ? require("../img/materialEnter.png")
      : require("../img/materialEnterW.png"),
    drawShape,
    "enterPre"
  ),
  "create.output": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[4],
    theme
      ? require("../img/materialOutput.png")
      : require("../img/materialOutputW.png"),
    drawShape,
    "materialOutput"
  ),
  "create.obtain": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[5],
    theme ? require("../img/obtain.png") : require("../img/obtainW.png"),
    drawShape,
    "obtain"
  ),
  "create.release": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[6],
    theme ? require("../img/freed.png") : require("../img/freedW.png"),
    drawShape,
    "freed"
  ),
  "create.change": createAction(
    "bpmn:Task",
    "activity",
    "bpmn-icon-task-customBottom",
    actionArr[7],
    theme ? require("../img/change.png") : require("../img/changeW.png"),
    drawShape,
    "materialChange"
  ),
  "data-separator": {
    group: "activity",
    separator: true,
  },
  "data-title": {
    group: "activity",
    titleName: "数据操作",
  },
  "create.newvariable": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[8],
    theme
      ? require("../img/newVariable.png")
      : require("../img/newVariableW.png"),
    drawShape,
    "newvariable"
  ),
  "create.dataCalculation": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[9],
    theme
      ? require("../img/calculation.png")
      : require("../img/calculationW.png"),
    drawShape,
    "dataCal"
  ),
  "create.dataCalculationPre": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[24],
    theme
      ? require("../img/calculation.png")
      : require("../img/calculationW.png"),
    drawShape,
    "dataCalculationPre"
  ),
  "create.dataOutput": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[11],
    theme
      ? require("../img/dataOutput.png")
      : require("../img/dataOutputW.png"),
    drawShape,
    "dataOutput"
  ),
  "create.inputVariable": createAction(
    "bpmn:Task",
    "activity",
    "",
    actionArr[23],
    require("../img/inputVariable.png"),
    drawShape,
    "inputVariable"
  )
};
function getPatetteData(paletteData) {
  console.log(paletteData);
  let materialManageData = [],
    dataOperateData = [],
    fileManageData = [],
    readNumberData = [],
    cultureData = [],
    pipetteData = [],
    moveData = [];
  paletteData.map((item) => {
    if (item.type === "1") {
      materialManageData.push(item);
    } else if (item.type === "2") {
      dataOperateData.push(item);
    } else if (item.type === "3") {
      fileManageData.push(item);
    } else if (item.type === "4") {
      readNumberData.push(item);
    } else if (item.type === "5") {
      cultureData.push(item);
    } else if (item.type === "6") {
      pipetteData.push(item);
    } else if (item.type === "7") {
      moveData.push(item);
    }
  });
  // exportPalette["material-separator"] = {
  //   group: "activity",
  //   separator: true,
  // };
  // exportPalette["material-title"] = {
  //   group: "activity",
  //   titleName: "物料管理",
  // };
  // materialManageData.map((item, index) => {
  //   exportPalette[`${item.functionName}`] = createAction(
  //     "bpmn:Task",
  //     "activity",
  //     "bpmn-icon-last-bottom",
  //     item.component,
  //     require("../img/customPCRW.png"),
  //     drawShape,
  //     item.functionName
  //   );
  // });
  // exportPalette["data-separator"] = {
  //   group: "activity",
  //   separator: true,
  // };
  // exportPalette["data-title"] = {
  //   group: "activity",
  //   titleName: "数据操作",
  // };
  // dataOperateData.map((item, index) => {
  //   console.log(item, index, item.component);
  //   exportPalette[`${item.functionName}`] = createAction(
  //     "bpmn:Task",
  //     "activity",
  //     "bpmn-icon-last-bottom",
  //     item.component,
  //     require("../img/customPCRW.png"),
  //     drawShape,
  //     item.functionName
  //   );
  // });
  exportPalette["file-separator"] = {
    group: "activity",
    separator: true,
  };
  exportPalette["file-title"] = {
    group: "activity",
    titleName: "文件管理",
  };
  fileManageData.map((item, index) => {
    console.log(item, index, item.component);
    exportPalette[`${item.functionName}`] = createAction(
      "bpmn:Task",
      "activity",
      "bpmn-icon-last-bottom",
      item.component,
      require("../img/customPCRW.png"),
      drawShape,
      item.functionName
    );
  });
  exportPalette["number-separator"] = {
    group: "activity",
    separator: true,
  };
  exportPalette["number-title"] = {
    group: "activity",
    titleName: "读数类",
  };
  readNumberData.map((item, index) => {
    console.log(item, index, item.component);
    exportPalette[`${item.functionName}`] = createAction(
      "bpmn:Task",
      "activity",
      "bpmn-icon-last-bottom",
      item.component,
      require("../img/customPCRW.png"),
      drawShape,
      item.functionName
    );
  });
  exportPalette["culture-separator"] = {
    group: "activity",
    separator: true,
  };
  exportPalette["culture-title"] = {
    group: "activity",
    titleName: "培养类",
  };
  cultureData.map((item, index) => {
    console.log(item, index, item.component);
    exportPalette[`${item.functionName}`] = createAction(
      "bpmn:Task",
      "activity",
      "bpmn-icon-last-bottom",
      item.component,
      require("../img/customPCRW.png"),
      drawShape,
      item.functionName
    );
  });
  exportPalette["pipette-separator"] = {
    group: "activity",
    separator: true,
  };
  exportPalette["pipette-title"] = {
    group: "activity",
    titleName: "移液类",
  };
  pipetteData.map((item, index) => {
    console.log(item, index, item.component);
    exportPalette[`${item.functionName}`] = createAction(
      "bpmn:Task",
      "activity",
      "bpmn-icon-last-bottom",
      item.component,
      require("../img/customPCRW.png"),
      drawShape,
      item.functionName
    );
  });
  exportPalette["move-separator"] = {
    group: "activity",
    separator: true,
  };
  exportPalette["move-title"] = {
    group: "activity",
    titleName: "移动类",
  };
  moveData.slice(0, moveData.length - 1).map((item, index) => {
    console.log(item, index, item.component);
    exportPalette[`${item.functionName}`] = createAction(
      "bpmn:Task",
      "activity",
      "bpmn-icon-last-bottom",
      item.component,
      require("../img/customPCRW.png"),
      drawShape,
      item.functionName
    );
  });
  moveData.slice(moveData.length - 1).map((item, index) => {
    console.log(item, index, item.component);
    exportPalette[`${item.functionName}`] = createAction(
      "bpmn:Task",
      "activity",
      "bpmn-icon-last-bottom",
      item.component,
      require("../img/customPCRW.png"),
      drawShape,
      item.functionName
    );
  });
  exportPalette["bottom-separator"] = {
    group: "activity",
    separator: true,
  };
}

(function initPatetteData() {
  // 异步获取组件列表
  let paletteData = JSON.parse(localStorage.getItem("paletteDataInfo"));
  console.log("localStorage123132", paletteData, store.getters.paletteData);
  paletteData && getPatetteData(paletteData);
})();

export default exportPalette;
