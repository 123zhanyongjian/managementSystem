
var that
export const getThis = v => { that = v }
export const validator = (r, v, callbalck) => {
  const reg = /^[0-9A-Za-z]{2,16}$/

  if (!v || !reg.test(v)) {
    return callbalck(new Error(that.$tc('请输入2-16位中英文或者数字，不区分大小写')))
  }
  callbalck()
}

