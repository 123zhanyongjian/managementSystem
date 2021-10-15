import Vue from 'vue'
import Vuex from 'vuex'
// if (process.env.NODE_ENV === 'development') {
//   Vue.use(Vuex)
// }
Vue.use(Vuex)
import user from './modules/user'
import test from './modules/test'
import lang from './modules/lang'
import layout from './modules/layout'
import canvas from './modules/canvas'
export default new Vuex.Store({
  modules: {
    user,
    test,
    lang,
    layout,
    canvas
  }
})

