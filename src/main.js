import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import i18n from '@/lang'
import './style/index.less'
import './permission'
import '@/utils/permission'
// 组件
import table from '@/components/common/table/index'
import form from '@/components/common/form/index'
import tableManagement from '@/components/common/tableManagement/index'
import svgIcon from '@/components/common/svgIcon/index'
import inputClearable from '@/components/common/inputClearable/index'
import baseDialog from '@/components/common/baseDialog/index'
import conditionForm from '@/components/common/conditionForm/index'
import { vuePlugin } from '@/page/highlight'
import './utils/rem'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})
Vue.use(vuePlugin)
// 根据不同主题引入不同样式
require('@/style/canvas.less')
if (!localStorage.theme) {
  require('@/style/white.less')
} else {
  require('@/style/dark.less')
}

Vue.component('my_table', table)
Vue.component('my_form', form)
Vue.component('my_tableManagement', tableManagement)
Vue.component('svg-icon', svgIcon)
Vue.component('input-clearable', inputClearable)
Vue.component('base-dialog', baseDialog)
Vue.component('condition-form', conditionForm)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue({
  data() {
    return {
      saveBtnLoading: false,
      InterfaceList: []
    }
  }
})
console.log(Vue.p)
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
