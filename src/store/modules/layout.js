const layout = {
  state: {
    isCollapse: false,
    headTitle: true,
    sidebar: {
      width: 17.063
    },
    topMenuWidth: 200,
    topRouters: [],
    cachedViews: [],
    theme: Boolean(localStorage.theme)
  },
  getters: {
    isCollapse: state => state.isCollapse,
    sidebar: state => state.sidebar,
    topMenuWidth: state => state.topMenuWidth,
    topRouters: state => state.topRouters,
    cachedViews: state => state.cachedViews,
    theme: state => state.theme,
    headTitle: state => state.headTitle
  },
  mutations: {
    LAYOUT_SET_LEFT_CPLLAPSE(state) {
      state.isCollapse = !state.isCollapse
      if (state.isCollapse) {
        state.sidebar.width = 3.375
      } else {
        state.sidebar.width = 17.063
      }
    },
    LAYOUT_HEAD_TITLE(state, data) {
      state.headTitle = data
    }
  },
  actions: {
    layoutSetLeftCollapse({ commit }) {
      commit('LAYOUT_SET_LEFT_CPLLAPSE')
    }
  }
}

export default layout
