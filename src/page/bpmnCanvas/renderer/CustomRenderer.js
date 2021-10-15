/* eslint-disable */
import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import { find } from "min-dash";

import { is } from "bpmn-js/lib/util/ModelUtil";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import {
  attr as svgAttr,
  create as svgCreate,
  append as svgAppend,
} from "tiny-svg";
import { customConfig } from "../utils";

const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer, paletteEntries) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
    this.paletteEntries = paletteEntries;
  }

  canRender(element) {
    // only render tasks and events (ignore labels)
    return isAny(element, ["bpmn:Task", "bpmn:Event"]) && !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const paletteEntries = this.paletteEntries;
    const shape = find(paletteEntries, (entry) => {
      return is(element, entry.type);
    });
    const optimazationArr = ["bpmn:StartEvent", "bpmn:EndEvent"];
    if (shape && shape.drawShape instanceof Function) {
      return shape.drawShape(parentNode, element, this.bpmnRenderer);
    } else if (optimazationArr.includes(element.type)) {
      return drawOptimazationShape(parentNode, element, this.bpmnRenderer);
    }
    return this.bpmnRenderer.drawShape(parentNode, element);
  }
}

// 优化开始/结束svg图形构造
function drawOptimazationShape(parentNode, element, bpmnRenderer) {
  const type = element.type;
  const url = customConfig[type].url;
  const attr = customConfig[type].attr;
  const customIcon = svgCreate("image", {
    ...attr,
    href: process.env.NODE_ENV === "production"
    ? "https://devcloud.vpclub.cn/exp/website/" + url
    : "http://localhost:8080/" + url,
  });
  element["width"] = attr.width;
  element["height"] = attr.height;
  svgAppend(parentNode, customIcon);
  
  // 添加text文字说明
  // const text = svgCreate("text", {
  //   x: attr.x,
  //   y: attr.y + attr.height + 20,
  //   "font-size": "14",
  //   fill: "#000",
  // });
  // text.innerHTML = element.businessObject.name;
  // svgAppend(parentNode, text);
  // console.log(text);

  // 最初shape
  // let shape = bpmnRenderer.drawShape(parentNode, element);
  // svgAttr(shape, {
  //   fill: "#f6f8fa",
  // });
  return customIcon;
}

CustomRenderer.$inject = ["eventBus", "bpmnRenderer", "config.paletteEntries"];
