export default function ContextPadProvider(
  contextPad,
  config,
  injector,
  translate,
  bpmnFactory,
  elementFactory,
  create,
  modeling,
  globalConnect,
  connect,
  rules
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;
  this.bpmnFactory = bpmnFactory;
  this.modeling = modeling;
  this.connect = connect;
  this.globalConnect = globalConnect;
  this._rules = rules;
  config = config || {};
  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }
  contextPad.registerProvider(this);
}

ContextPadProvider.$inject = [
  'contextPad',
  'config',
  'injector',
  'translate',
  'bpmnFactory',
  'elementFactory',
  'create',
  'modeling',
  'connect',
  'globalConnect',
  'rules'
];

ContextPadProvider.prototype.getContextPadEntries = function(element) {
  const {
    translate,
    modeling,
    globalConnect
  } = this;
  const rules = this._rules;
  // 为contextPad中connect功能添加规则
  rules.allowed('connection.create', { elements: [element] });
  // 删除功能
  function removeElement(e) {
    modeling.removeElements([element]);
  }

  // contextPad删除icon
  function deleteElement() {
    return {
      group: 'edit',
      className: 'bpmn-icon-customdelete',
      title: translate('删除'),
      action: {
        click: removeElement
      }
    };
  }

  // contextPad连接icon
  function connectElement() {
    return {
      group: 'tools',
      className: 'bpmn-icon-customconnection',
      title: translate('连接'),
      action: {
        click: function(event, element) {
          globalConnect.start(event, element);
        }
      }
    };
  }

  return {
    // contextPad自定义添加事件
    // 'append.lindaidai-task': {
    //   group: 'model',
    //   className: 'icon-custom lindaidai-task',
    //   title: translate('创建一个类型为lindaidai-task的任务节点'),
    //   action: {
    //     click: appendTask,
    //     dragstart: appendTaskStart,
    //   },
    // },
    connect: connectElement(),
    delete: deleteElement()
  };
};
