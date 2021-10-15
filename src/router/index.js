import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export const constantRoutes = [
  {
    path: '/login',
    name: '登录页',
    component: () => import('@/page/login')
  },
  {
    path: '*', // 如果匹配不上，返回重定向页面
    name: '首页',
    redirect: '/redirect'
  },
  {
    path: '/redirect',
    component: () => import('@/page/layout'),
    hidden: true,
    children: [
      //   {
      //     path: '/redirect/:path(.*)',
      //     component: () => import('@/views/redirect/index')
      //   }
    ]
  },
  {
    path: '/bpmnComp/:type',
    name: 'bpmnComp',
    component: () => import ('@/page/bpmnCanvas/pageComponent')
  }
]
export const asyncRoutes = [

]
// constantRoutes.concat(asyncRoutes)
const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
