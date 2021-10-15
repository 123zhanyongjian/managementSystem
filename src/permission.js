import router, { resetRouter } from './router'
import store from './store'
import i18n from './lang'
import Vue from 'vue'
import { Message } from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, setCookies } from '@/utils/auth'
import ZH from '@/lang/ZH'
import EN from '@/lang/EN'
import { codeZh, codeEn } from '@/utils/warningCode'
// 异步添加中英文数据
i18n.setLocaleMessage('zh_CN', { ...ZH, ...codeZh, ...zhLocale })
i18n.setLocaleMessage('en_US', { ...EN, ...codeEn, ...enLocale })
// 不重复加载菜单列表
if (getToken()) {
  if (localStorage.leftRouter) {
    store.commit('LEFTROUTER', JSON.parse(localStorage.leftRouter))
    store.commit('USERBTNPERMISSION', JSON.parse(localStorage.btnPre))
    router.addRoutes(store.getters.asyncRoutes) // 每刷新次执行一次
  } else {
    store.dispatch('userGetMenu') // 获取菜单
      .then(() => {
        router.addRoutes(store.getters.asyncRoutes) // 每刷新次执行一次
      })
  }
}
setCookies('Language', true)
NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/auth-redirect']
router.beforeEach(async(to, from, next) => {
  //
  if (getToken() && from.path === '/login') {
    location.reload()
  }
  NProgress.start() // bar开始滑动
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      console.log(333)

      next({ path: '/' })
      NProgress.done()
    } else {
      NProgress.done() // 结束滑动
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      store.commit('LAYOUT_HEAD_TITLE', true)
      if (hasRoles) {
        next()
        if (to.path !== '/redirect') {
          // 切换页面取消之前的所有请求
          Vue.prototype.$nextTick(() => {
            Vue.prototype.$bus.InterfaceList.forEach((item, index, arr) => {
              item()
              delete arr[index]
            })
          })
        }
      } else {
        resetRouter()
        try {
          const roles = 'admin'
          const accessRoutes = await store.dispatch('generateRoutes', roles)
          console.log(roles)

          console.log(accessRoutes)
          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack方法以确保addRoutes是完整的
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
          return
        } catch (error) {
          console.log(error)
          // 删除token并转到登录页以重新登录
          // await store.dispatch('userResetToken')
          Message.success('Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 未登录*/
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
    // 其他没有访问权限的页面将重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 关闭
  NProgress.done()
})
