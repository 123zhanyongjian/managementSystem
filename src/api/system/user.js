import axios from '@/utils/request'
const baseURL = 'exp/system/subject'
const baseURL1 = 'exp/system/resource'
// 列表查询
export function page(data) {
  return axios({
    url: `${baseURL}/list`,
    method: 'post',
    data
  })
}
export function add(data) {
  return axios({
    url: `${baseURL}/add`,
    method: 'post',
    data
  })
}
export function update(data) {
  return axios({
    url: `${baseURL}/update`,
    method: 'post',
    data
  })
}
// 删除
export function deletes(data) {
  return axios({
    url: `${baseURL}/delete`,
    method: 'post',
    data
  })
}
// 查询详细
export function query(data) {
  return axios({
    url: `${baseURL}/query`,
    method: 'post',
    data
  })
}

// 获取验证码
export function getCode(data) {
  return axios({
    url: `${baseURL}/getCode`,
    method: 'get',
    responseType: 'blob',
    data
  })
}
// 登录
export function login(data) {
  return axios({
    url: `${baseURL}/login`,
    method: 'post',
    noMessage: true,
    data
  })
}
// 登出
export function logout(data) {
  return axios({
    url: `${baseURL}/logout`,
    method: 'post',
    data
  })
}
// 菜单栏
export function userTree(data) {
  return axios({
    url: `${baseURL1}/tree/by/user`,
    method: 'post',
    data
  })
}

// 状态修改
export function status(data) {
  return axios({
    url: `${baseURL}/update/status`,
    method: 'post',
    data
  })
}
// 修改密码
export function password(data) {
  return axios({
    url: `${baseURL}/update/my/password`,
    method: 'post',
    data
  })
}

export function reset(data) {
  return axios({
    url: `${baseURL}/update/password`,
    method: 'post',
    data
  })
}
