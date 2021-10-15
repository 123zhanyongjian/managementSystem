export const messageList = {
  'message.common.success': '成功',
  'message.common.unauthorized': '无权限访问',
  'message.common.data.nonexistence': '数据不存在',
  'message.common.server.error': '服务器异常',
  'message.common.failed': '失败',
  'message.common.parameters.missing': '请求参数有误',
  'message.common.timeout': '请求超时',
  'message.common.data.already.exists': '数据已存在',
  'message.common.login.expired': '登录已失效, 请重新登录',
  'message.common.auth.failed': '身份验证失败',
  'message.common.insert.faild': '插入失败',
  'message.common.delete.faild': '删除失败',
  'message.common.data.deleted': '数据已删除',
  'message.common.id.missing': 'id不能为空',
  'message.common.upgrade': '系统维护升级中',
  'message.common.frequent.operation': '操作频繁，请等待{0}秒后重新尝试'
}
const messageListEn = {
  'message.common.success': 'Success',
  'message.common.unauthorized': 'Unauthorized',
  'message.common.data.nonexistence': 'Data does not exist',
  'message.common.server.error': 'Server error',
  'message.common.failed': 'Failed',
  'message.common.parameters.missing': 'Request parameters are incorrect',
  'message.common.timeout': 'Timeout',
  'message.common.data.already.exists': 'Data already exists',
  'message.common.login.expired': 'The login is expired, please login again',
  'message.common.auth.failed': 'Authentication failed',
  'message.common.insert.faild': 'No record was inserted',
  'message.common.delete.faild': 'No record was deleted',
  'message.common.data.deleted': 'Data deleted',
  'message.common.id.missing': 'Id cannot be empty',
  'message.common.upgrade': 'System maintenance and upgrade',
  'message.common.frequent.operation': 'Frequent operation, please wait {0} seconds and try again'
}
// 将中文引入
export const codeZh = {}
for (const i in messageList) {
  codeZh[messageList[i]] = messageList[i]
}
// 将英文文引入
export const codeEn = {}
for (const i in messageList) {
  for (const j in messageListEn) {
    if (i === j) {
      codeEn[messageList[i]] = messageListEn[j]
    }
  }
}
