// import  * as units from '@/units'
import router, { asyncRoutes, constantRoutes } from '@/router'
import { setToken, removeToken, getCookies } from '@/utils/auth' // get token from cookie
import * as _api from '@/api/system/user'
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
// 加载路由组件资源
const loadView = (view) => {
  return (resolve) => require([`@/page/${view}`], resolve)
//   return () => import(`@/page/${view}`)
}

export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const user = {
  state: {
    user: 123,
    btnPer: '',
    leftMenName: '',
    roles: [true],
    asyncRoutes: [],
    userBtnPermisson: [],
    userInfo: localStorage.userInfo ? JSON.parse(localStorage.userInfo) : '',
    userCode: '',
    leftRouter: [

      {
        path: '/test',
        hidden: false,
        component: 'CommonLayout',
        meta: {
          title: '工艺名称',
          icon: 'icon-setting'
        },
        children: [{
          path: 'index',
          hidden: false,
          component: 'CommonLayout',
          meta: {
            title: '测试子系统',
            icon: 'icon-shezhi'
          }

        }, {
          path: 'test2',
          hidden: false,
          component: 'CommonLayout',
          meta: {
            title: '另一个子系统',
            icon: 'icon-shezhi'
          }

        }]

      }
    ],
    errMessage: ''
  },
  getters: {
    userBtnPermisson: state => state.userBtnPermisson,
    roles: state => state.roles,
    userCode: state => state.userCode,
    asyncRoutes: (state) => {
      console.log(state)
      state.asyncRoutes.forEach(item => {
        item.component = loadView(item.component)
        if (item.children) {
          item.children.forEach(ite => {
            ite.component = loadView(ite.component)
          })
        }
      })
      return state.asyncRoutes
    },
    leftRouter: state => state.leftRouter,
    leftMenName: state => state.leftMenName,
    userInfo: state => state.userInfo
  },
  mutations: {
    LEFTROUTER(state, data) {
      state.leftRouter = data
      // 动态路由添加
      state.asyncRoutes = data.map(item => {
        item.component = 'layout'
        item.name = item.meta.title
        if (item.children) {
          item.children.forEach(ite => {
            ite.component = ite.meta.component
            ite.name = ite.meta.title
            ite.path = ite.path.substr(1)
          })
        }
        return item
      })
      console.log(state.asyncRoutes)
    },
    ROUTER_LEFT(state, data) {
      const flag = getCookies('LANG_6PL_E3') === 'en_US'
      state.leftMenName = flag ? data.nameEn : data.name
    },
    BTN_PER(state, data) {
      state.btnPer = data
    },
    USERLOGIN(state, data) {
      setToken(data.token)
      state.userInfo = data
      localStorage.theme = localStorage.themes || ''
      router.push('/')
    },
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    USERGETCODE(state, data) {
      state.userCode = URL.createObjectURL(data)
    },
    USERERRMESSAGE(state, data) {
      state.errMessage = data.message
    },
    // 配置按钮权限
    USERBTNPERMISSION(state, data) {
      state.userBtnPermisson = data
      localStorage.btnPre = JSON.stringify(data)
    }
  },
  actions: {
    userResetToken({ commit }) {
      _api.logout()
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          const as = localStorage.themes
          localStorage.clear()
          localStorage.themes = as
          removeToken()
          location.reload()
        })
    },
    // 登录失效
    userloginin({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        const as = localStorage.themes
        localStorage.clear()
        localStorage.themes = as
        removeToken()
        resolve()
      })
    },
    generateRoutes({ commit, getters }, roles) {
      return new Promise(resolve => {
        let accessedRoutes
        if (roles.includes('admin')) {
          accessedRoutes = getters.asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(getters.asyncRoutes, roles)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    UserLogin({ commit, getters, dispatch }, data) {
      dispatch('userloginin')
      _api.login(data)
        .then(res => {
          console.log(res)
          router.addRoutes(getters.asyncRoutes)
          console.log(asyncRoutes, 111, router.options.routes)
          localStorage.userInfo = JSON.stringify(res.data)
          commit('USERLOGIN', res.data)
          commit('USERERRMESSAGE', { message: '' })
          dispatch('userGetMenu')
        }, (err) => {
          commit('USERERRMESSAGE', err.data)
          dispatch('userGetCode')
        })
    },
    userGetCode({ commit }) {
      _api.getCode()
        .then(res => {
          commit('USERGETCODE', res.data)

        // console.log(res)
        })
    },
    // 获取菜单栏
    userGetMenu({ commit }) {
      // 获取菜单栏
      return new Promise((resolve, reject) => {
        _api.userTree({
          'parentId': 0,
          'isContainParent': 0,
          'isLevelLimit': 0
        })
          .then(res => {
            // 将获取到的数据进行整合
            const btnPer = []
            const data = res.data.map(item => {
              // 只有一类
              const obj = {}
              obj.path = item.value
              obj.component = 'CommonLayout'
              obj.meta = {
                title: item.name,
                titleEn: item.nameEnus,
                icon: item.icon
              }
              // 存在子类
              if (item.children) {
                obj.children = []
                item.children.map(ite => {
                  // 是否存在孙类
                  const objChildren = {}
                  objChildren.path = ite.value
                  objChildren.component = 'CommonLayout'
                  objChildren.meta = {
                    title: ite.name,
                    icon: ite.icon,
                    titleEn: ite.nameEnus,
                    component: item.value.substr(1) + '/' + ite.component
                  }
                  // 配置权限按钮
                  if (ite.children) {
                    ite.children.map(it => {
                      btnPer.push(item.value + ite.value + it.value)
                    })
                  }
                  obj.children.push(objChildren)
                })
              }
              return obj
            })
            // 传递按钮权限标识
            commit('USERBTNPERMISSION', btnPer)
            localStorage.leftRouter = JSON.stringify(data)
            commit('LEFTROUTER', data)
            resolve(true)
          })
      })
    }

  }
}

export default user
