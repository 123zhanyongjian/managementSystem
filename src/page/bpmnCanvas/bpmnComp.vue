
<template>
  <div
    id="containClickId"
    class="containers"
  >
    <div
      ref="canvas"
      :class="theme === 'dark' ? 'canvasDark' : 'canvas'"
    />
    <template v-if="viewer">
      <properComp :modeler="viewer" />
    </template>
  </div>
</template>

<script>
/* eslint-disable */
// import BpmnModeler from 'bpmn-js/lib/Modeler' // 引入 bpmn-js
import paletteEntries from './config/paletteEntries'
import customRenderer from './renderer'
import customRules from './rules'
import customPalette from './palette'
import properComp from './properComp'
import CustomModeler from './customModeler'
import paletteProvider from './bpmnTools'
import CustomDescriptor from './config/CustomDescriptor.json'
// import resizeTask from 'bpmn-js-task-resize/lib';
import resizeTask from './taskResize';
import "bpmn-js/dist/assets/diagram-js.css"; // 左边工具栏以及编辑节点的样式
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
  name: 'BpmncompCanvas',
  components: {
    properComp
  },
  props: {
    nodeData: {
      type: String,
      default: ''
    }
  },
  watch: {
    nodeData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.xml = newVal;
          this.$forceUpdate();
        }
      }
    }
  },
  data() {
    return {
      viewer: null,
      theme: '',
      xml: this.nodeData || `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0qnjqfg" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.6.0">
  <bpmn:process id="Process_0coajcg" isExecutable="false">
    
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0coajcg">
      
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
    }
  },
  mounted() {
    const canvas = this.$refs.canvas;
    this.theme = localStorage.theme ? 'dark' : 'white';

    // 生成实例
    // this.viewer = new BpmnModeler({
    this.viewer = new CustomModeler({
      paletteEntries,
      container: canvas,
      keyboard: {
        bindTo: window
      },
      propertiesPanel: {
      },
      additionalModules: [
        customRenderer,
        customRules,
        customPalette,
        paletteProvider,
        resizeTask,
        { zoomScroll: ['value', ''] },
        { labelEditingProvider: ["value", ""] }, // 禁用双击编辑
        // { paletteProvider: ["value", ""] }// 禁用左侧工具栏
      ],
      moddleExtensions: {
        camunda: CustomDescriptor
      },
      taskResizingEnabled: true
    })
    window.modeler = {
      modeling: this.viewer.get("modeling"),
      moddle: this.viewer.get("moddle"),
      // eventBus: this.bpmnModeler.get("eventBus"),
      // bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
      // elementRegistry: this.bpmnModeler.get("elementRegistry"),
      // replace: this.bpmnModeler.get("replace"),
      // selection: this.bpmnModeler.get("selection")
    }
    this.createNewDiagram() // 新增流程定义
    this.$emit('viewer', this.viewer);
    const dom = document.getElementById('containClickId');
    dom.oncontextmenu = function (e) {
      e.preventDefault();
    }
  },
  methods: {
    createNewDiagram() {
      // 将字符串转换成图显示出来
      try {
        this.viewer.importXML(this.xml).then(() => {
          // 流程图初始化居中显示，伸缩100%
          this.viewer.get('canvas').zoom('fit-viewport', 'auto');
          this.viewer.get('canvas').zoom(1)
          this.success()
          this.getNodeInfoList()
        })
      } catch (err) {
        console.log(err)
      }
    },

    // 获取流程图中所有节点信息
    getNodeInfoList() {
      const elementRegistry = this.viewer.get('elementRegistry')
      const userTaskList = elementRegistry.filter(
        (item) => item.type === 'bpmn:UserTask'
      )
      // 此时得到的userTaskList 便是流程图中所有的用户节点的集合
    },

    saveBpmn() {
      this.viewer.saveXML({ format: true }, (err, xml) => {
        // 将xml转换为file
        const fileName = 'diagram' // 文件名
        const { href, filename } = this.setEncoded('xml'.toUpperCase(), fileName, xml)
        this.downloadFunc(href, filename)
      })
    },

    // 根据所需类型进行转码并返回下载地址
    // type: xml/svg
    setEncoded(type, filename = 'diagram', data) {
      const encodedData = encodeURIComponent(data)
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
        data: data
      }
    },

    // 文件下载方法
    downloadFunc(href, filename) {
      if (href && filename) {
        const a = document.createElement('a')
        a.download = filename // 指定下载的文件名
        a.href = href //  URL对象
        a.click() // 模拟点击
        URL.revokeObjectURL(a.href) // 释放URL 对象
      }
    },

    success() {
      // 添加绑定事件,
      // 判断拖拽是点击还是拖拽
      const eventBus = this.viewer.get('eventBus')
      // 注册节点事件，eventTypes中可以写多个事件
      const eventTypes = ['element.click', 'element.hover', 'shape.added']
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          const { element } = e
          if (!element.parent) return
          if (!e || element.type === 'bpmn:Process') {
            return false
          } else {
            if (eventType === 'element.click') {
              // 节点点击后想要做的处理
              // 此时想要点击节点后，拿到节点实例，通过外部输入更新节点名称
              console.log('this.viewer', element, this.viewer.get('elementRegistry'))
            } else if (eventType === 'element.hover') {
              // 鼠标滑过节点后想要做的处理
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.containers {
  width: 100vw;
  display: flex;
  ::-webkit-scrollbar {
    display: none;
  }
  ::-ms-scrollbar {
    display: none;
  }
  .scrollbar {
    display: none;
  }
  .canvas {
    width: 83vw;
    height: 95vh;
    background: #f6f8fa;
    /deep/ .djs-palette {
      left: -1px;
      top: -1px;
      width: 300px;
      overflow-y: auto;
      height: 98%;
      background: white;
    }
    /deep/ .bjs-powered-by {
      display: none;
    }
  }
  .canvasDark {
    width: 83vw;
    height: 95vh;
    background: #f6f8fa;
    /deep/ .djs-palette {
      left: -1px;
      top: -1px;
      width: 300px;
      overflow-y: auto;
      height: 98%;
      background: #323232;
    }
    /deep/ .bjs-powered-by {
      display: none;
    }
  }
  .bjs-powered-by {
    display: none;
  }
}
</style>
