/* eslint-disable */
import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";
import inherits from "inherits";

export default function ResizeTask(eventBus, taskResizingEnabled) {
  RuleProvider.call(this, eventBus);
  this.taskResizingEnabled = taskResizingEnabled || false;
}

inherits(ResizeTask, RuleProvider);

ResizeTask.$inject = ["eventBus", "config.taskResizingEnabled"];

ResizeTask.prototype.init = function() {
  var me = this;

  me.addRule("shape.resize", 1500, function(data) {
    if (
      me.taskResizingEnabled &&
      data.shape.businessObject &&
      data.shape.businessObject.$instanceOf("bpmn:Task")
    ) {
      const newType = data.shape.businessObject.newType;
      if (newType === "collect") {
        return true;
      }
    }
  });
};
