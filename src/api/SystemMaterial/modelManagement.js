import axios from '@/utils/request'
const baseURL = '/exp/materiel/materielModelInfo'

// 列表查询
export function page(data) {
  return axios({
    url: `${baseURL}/page`,
    method: 'post',
    data
  })
}
export function list(data) {
  return axios({
    url: `${baseURL}/selectList`,
    method: 'post',
    data
  })
}
export function recent(data) {
  return axios({
    url: `${baseURL}/recent`,
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
// 移动
export function move(data) {
  return axios({
    url: `${baseURL}/move`,
    method: 'post',
    data
  })
}
// 复制
export function copy(data) {
  return axios({
    url: `${baseURL}/copy`,
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

export function reset(data) {
  return axios({
    url: `${baseURL}/update/password`,
    method: 'post',
    data
  })
}
