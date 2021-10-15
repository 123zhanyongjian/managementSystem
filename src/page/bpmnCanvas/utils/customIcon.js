/* eslint-disable */
const startCanvas = "img/startCanvas.svg";
const endCanvas = "img/endCanvas.svg";
const waitCanvas = "img/waitCanvas.svg";
const pauseCanvas = "img/pauseCanvas.svg";
const customConfig = {
  "bpmn:StartEvent": {
    url: startCanvas,
    attr: { x: 0, y: 0, width: 40, height: 40 },
  },
  "bpmn:EndEvent": {
    url: endCanvas,
    attr: { x: 0, y: 0, width: 40, height: 40 },
  },
  wait: {
    url: waitCanvas,
    attr: { x: 0, y: 0, width: 40, height: 40 },
  },
  pause: {
    url: pauseCanvas,
    attr: { x: 0, y: 0, width: 40, height: 40 },
  },
};

export { customConfig };
