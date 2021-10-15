/* eslint-disable */
import { assign } from 'min-dash'

/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider(
  palette,
  create,
  elementFactory,
  spaceTool,
  lassoTool,
  handTool,
  globalConnect,
  translate
) {
  this._palette = palette
  this._create = create
  this._elementFactory = elementFactory
  this._spaceTool = spaceTool
  this._lassoTool = lassoTool
  this._handTool = handTool
  this._globalConnect = globalConnect
  this._translate = translate

  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  var actions = {},
    create = this._create,
    elementFactory = this._elementFactory,
    lassoTool = this._lassoTool,
    handTool = this._handTool,
    globalConnect = this._globalConnect,
    translate = this._translate

  function createAction(type, group, className, title, imageUrl = '') {
    function createListener(event) {
      var shape = elementFactory.createShape({ type: type })

      create.start(event, shape)
    }

    var shortType = type.replace(/^bpmn:/, '')
    const config = {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    }
    if (imageUrl) {
      assign(config, {
        imageUrl
      })
    }
    return config
  }

let theme = localStorage.theme ? true : false;
  assign(actions, {
    'task-title': {
      // 工具分割线
      group: 'tools',
      titleName: '流程组件'
    },
    'create.start-event': createAction(
      // 开始事件
      'bpmn:StartEvent',
      'event',
      'bpmn-customIcon-start',
      translate('开始'),
      require('../img/start.png')
    ),
    'create.end-event': createAction(
      // 结束事件
      'bpmn:EndEvent',
      'event',
      'bpmn-customIcon-end',
      translate('结束'),
      theme ? require('../img/end.png') : require('../img/endW.png')
    ),
    'create.parallel-gateway': createAction(
      // 并行网关
      'bpmn:ParallelGateway',
      'gateway',
      'bpmn-customIcon-collection',
      translate('汇集'),
      theme ? require('../img/collection.png') : require('../img/collectionW.png')
    )
  })

  return actions
}
