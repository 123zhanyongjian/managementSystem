
import axios from '@/utils/request'
const baseURL = '/exp/materiel/craftMateriel'
// 列表查询
export function page(data) {
  return axios({
    url: `${baseURL}/page`,
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
// 查询位置

export function location(data) {
  return axios({
    url: '/exp/canvas/structurePosition/selectList',
    method: 'post',
    data
  })
}
