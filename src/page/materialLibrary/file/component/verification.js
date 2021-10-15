var that
export const getThis = v => { that = v }
// 文件夹不可重复命名
export const validator = (r, v, callbalck) => {
  const checkId = that.$parent.$parent.checkTreeId
  //  判断同层是否文件夹重名，不同层则过滤，（判断条件 checkTreeId是否为用户id或者空，）
  if (that.$parent.$parent.dataSource.some(item => item.name === v) && (checkId === that.$parent.$parent.userInfo.id || !checkId)) {
    return callbalck(new Error(that.$t('文件夹名称不可重复')))
  }
  callbalck()
}

