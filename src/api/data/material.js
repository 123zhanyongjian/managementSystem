
import axios from '@/utils/request'
const baseURL = '/exp/materiel'

// 系统物料列表查询
export function selectMaterialTemplateList(data) {
  return axios({
    url: `${baseURL}/materielTemplateInfo/selectList`,
    method: 'post',
    data
  })
}

// 用户物料列表查询
export function selectMaterialList(data) {
  return axios({
    url: `${baseURL}/materielInfo/selectList`,
    method: 'post',
    data
  })
}
