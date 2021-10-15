const canvas = {
  state: {
    paletteData: [],
    dataInfo: [],
    isSave: false,
    color: 'black',
    width: 100,
    contentStateData: [],
    materialStateData: [],
    deviceList: [],
    positionList: [],
    compInfo: {},
    systemMaterialList: [],
    userMaterialList: []
  },
  getters: {
    paletteData: state => state.paletteData,
    dataInfo: state => state.dataInfo,
    isSave: state => state.isSave,
    color: state => state.color,
    width: state => state.width,
    contentStateData: state => state.contentStateData,
    materialStateData: state => state.materialStateData,
    deviceList: state => state.deviceList,
    positionList: state => state.positionList,
    compInfo: state => state.compInfo,
    systemMaterialList: state => state.systemMaterialList,
    userMaterialList: state => state.userMaterialList
  },
  mutations: {
    SET_PALETTE_DATA: (state, data) => {
      console.log('---data', data)
      state.paletteData = data;
    },
    SET_DATAINFO: (state, data) => {
      state.dataInfo = data;
    },
    SET_ISSAVE: (state, data) => {
      state.isSave = data;
    },
    SET_COLOR: (state, data) => {
      state.color = data;
    },
    SET_WIDTH: (state, data) => {
      state.width = data;
    },
    SET_CONTENTDATA: (state, data) => {
      state.contentStateData = data;
    },
    SET_MATERIALDATA: (state, data) => {
      state.materialStateData = data;
    },
    SET_DEVICELIST: (state, data) => {
      state.deviceList = data;
    },
    SET_POSITIONLIST: (state, data) => {
      state.positionList = data;
    },
    SET_COMP_INFO: (state, data) => {
      state.compInfo = data;
    },
    SET_SYSTEMMATERIALLIST: (state, data) => {
      state.systemMaterialList = data;
    },
    SET_USERMATERIALLIST: (state, data) => {
      state.userMaterialList = data;
    }
  },
  actions: {
    setpaletteData({ commit, rootState }, data) {
      commit('SET_PALETTE_DATA', data)
    },
    setDataInfo({ commit, rootState }, data) {
      commit('SET_DATAINFO', data)
    },
    setDeviceList({ commit, rootState }, data) {
      commit('SET_DEVICELIST', data)
    },
    setPositionList({ commit, rootState }, data) {
      commit('SET_POSITIONLIST', data)
    },
    setSystemMaterialList({ commit, rootState }, data) {
      commit('SET_SYSTEMMATERIALLIST', data)
    },
    setUserMaterialList({ commit, rootState }, data) {
      commit('SET_USERMATERIALLIST', data)
    }
  }
}

export default canvas
