
import axios from '@/utils/request'
const baseURL = '/exp/file/file/info'
// 上传
export function upload(data) {
  return axios({
    url: `${baseURL}/upload`,
    method: 'post',
    data
  })
}
// 下载
export function download(data) {
  return axios({
    url: `${baseURL}/download`,
    method: 'get',
    params: data
  })
}
