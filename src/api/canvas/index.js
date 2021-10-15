
import axios from '@/utils/request'
const baseURL = '/exp/canvas'

// 设备列表查询
export function equipmentQuery(data) {
  return axios({
    url: `${baseURL}/structureEquipment/selectList`,
    method: 'post',
    data
  })
}

// 位置列表查询
export function positionQuery(data) {
  return axios({
    url: `${baseURL}/structurePosition/selectList`,
    method: 'post',
    data
  })
}

// 组件列表查询
export function componentQuery(data) {
  return axios({
    url: `${baseURL}/FunctionStructure/selectList`,
    method: 'post',
    data
  })
}
