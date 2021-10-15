// 引入i18n国际化插件
import { getCookies } from '@/utils/auth'
import Vue from 'vue'
import locale from 'element-ui/lib/locale'
import VueI18n from 'vue-i18n'
import store from '../store'
Vue.use(VueI18n)
// process.env.NODE_ENV === "development" ? Vue.use(VueI18n) : null;

// 注册i18n实例并引入语言文件，文件格式等下解析
const i18n = new VueI18n({
  locale: getCookies('LANG_6PL_E3') || 'zh_CN', // 语言环境
  fallbackLocale: 'zh_CN', // 预设语言环境
  silentTranslationWarn: true, // 禁止本地化失败警告
  fallbackRoot: false,
  missing: (lang, key) => {
    // 缺少本地化时的处理函数
    store.dispatch('SaveLackLang', key)
  }
})
locale.i18n((key, value) => i18n.t(key, value)) // 重点：为了实现element插件的多语言切换
export default i18n

