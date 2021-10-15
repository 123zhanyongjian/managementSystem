import axios from '@/utils/request'
const baseURL = '/exp/system/org'
// 列表查询
export function page(data) {
  return axios({
    url: `${baseURL}/find/page`,
    method: 'post',
    data
  })
}
// 菜单栏
export function tree(data) {
  return axios({
    url: `${baseURL}/tree`,
    method: 'post',
    data
  })
}
// 新增

export function add(data) {
  return axios({
    url: `${baseURL}/add`,
    method: 'post',
    data
  })
}
// 修改

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
// 查询
export function query(data) {
  return axios({
    url: `${baseURL}/get`,
    method: 'post',
    data
  })
}
