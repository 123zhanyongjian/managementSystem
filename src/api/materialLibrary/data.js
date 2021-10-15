
import axios from '@/utils/request'
const baseURL = '/exp/data/data/object'
// 列表查询
export function page(data) {
  return axios({
    url: `${baseURL}/find/page`,
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
    url: `${baseURL}/get`,
    method: 'post',
    data
  })
}

