import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getCookies } from '@/utils/auth'
import i18n from '@/lang'
import qs from 'qs'
// import cancelClass from './cancelToken'
import { messageList } from './warningCode'
import Vue from 'vue'
// 设置全局按钮loading
// Vue.prototype.$bus.saveBtnLoading = false;
const CancelToken = axios.CancelToken
// 创建axios实例
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // api的base_url
//   timeout: 10000 // 请求超时时间
// })
let baseURL
if (process.env.NODE_ENV === 'development') {
  baseURL = '/api'
} else {
  baseURL = '/'
}
const service = axios.create({
  baseURL: baseURL, // api的base_url
  timeout: 10000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
  console.log(process.env)
  if (config.data) {
    config.data.appId = 'app1'
  }
  if (config.params) {
    config.params.appId = 'app1'
  }
  if (config.method === 'get') {
    // get请求方式下，把数组转成同名参数
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  if (getCookies('TOKEN_6PL_E3')) {
    config.headers['Authorization'] = getCookies('TOKEN_6PL_E3') // 携带权限参数
  }
  if (getCookies('LANG_6PL_E3')) {
    config.headers['language'] = getCookies('LANG_6PL_E3') // 携带多语言参数
  }
  config.cancelToken = new CancelToken((menthod) => {
    Vue.prototype.$bus.InterfaceList.push(menthod)
  })
  return config
}, error => {
  Promise.reject(error)
})
// respone拦截器

service.interceptors.response.use(
  response => {
    /**
    * code:200,接口正常返回;
    */
    const res = response.data
    // 成功回调
    if (res.code === 'message.common.success') {
      res.code = 200
    }
    if (res.code !== 200 && response.config.responseType !== 'blob') {
      var msg = res.msg || res.message
      if (res.code === '400' && res.msg === 'Bad credentials') {
        Message({
          message: i18n.tc('密码错误！'),
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(response)
      }
      if (res.code === 'message.common.login.expired') {
        // token过期
        MessageBox.confirm(i18n.tc('您已被登出，可以继续留在当前界面，或者重新登录'), i18n.tc('重新登录'), {
          confirmButtonText: i18n.tc('重新登录'),
          cancelButtonText: i18n.tc('取消'),
          cancelButtonClass: 'conffirmMessageCancle',
          customClass: 'miniMessage'

        })
          .then(() => {
            store.dispatch('userloginin', {}).then(() => {
              // next('/login')
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          })
          .catch(() => {

          })
      }
      if (!response.config.noMessage) {
        Message({
          message: i18n.tc(messageList[res.code]) || msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      Vue.prototype.$bus.saveBtnLoading = false
      return Promise.reject(response)
    } else if (response.config.responseType === 'blob') {
      if (response.data.type.includes('application/json')) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const content = reader.result
            const fileRes = JSON.parse(content)
            Message({
              message: i18n.tc(fileRes.msg),
              type: 'error'
            })
            reject(fileRes)
          }
          reader.readAsText(response.data)
        })
      } else {
        return response
      }
    } else { // res.code === 200,正常返回数据
      Vue.prototype.$bus.saveBtnLoading = false
      return response.data
    }
  },
  error => {
    // axios.isCancel(error) 用于判断error是否是cancel()方法停止的，true就不需要提示报错信息
    if (!axios.isCancel(error)) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    Vue.prototype.$bus.saveBtnLoading = false
    return Promise.reject(error)
  }
)

export default service
