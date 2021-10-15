
import axios from '@/utils/request'
const baseURL = '/exp/data/data'
// 列表查询
export function dataPage(data) {
  return axios({
    url: `${baseURL}/type/find/page`,
    method: 'post',
    data
  })
}
