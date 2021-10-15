
var that
export const getThis = v => { that = v }
export const validator = (r, v, callbalck) => {
  const reg = /^[a-zA-Z0-9_]{0,}$/g

  if (v && !reg.test(v)) {
    console.log(111, reg.test(v), v)
    return callbalck(new Error(that.$tc('不允许输入中文')))
  }
  if (!v) {
    return callbalck(new Error(that.$tc('不可为空')))
  }
  callbalck()
}

