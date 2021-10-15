import { getCookies } from '@/utils/auth'
const lang = {
  state: {
    lackLang: [], // 缺少的多语言配置
    lang: getCookies('LANG_6PL_E3'),
    langList: {} // 多语言JSON
  },
  getters: {
    lackLang: state => state.lackLang,
    langList: state => state.langList
  },
  mutations: {
    SET_LACKLANG: (state, data) => {
      state.lackLang.push(data)
    },
    SET_LANGLIST: (state, data) => {
      state.langList = data
    }
  },
  actions: {
    // 存储缺少的key到lackLang
    SaveLackLang({ commit, rootState }, data) {
      if (rootState.lang.lackLang.length) {
        const ishas = rootState.lang.lackLang.find(it => it === data)
        if (!ishas) {
          commit('SET_LACKLANG', data)
        }
      } else {
        commit('SET_LACKLANG', data)
      }
    }
  }
}

export default lang
