export function exports(data, name) {
  const blob = data
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = (e) => {
    const a = document.createElement('a')
    a.download = `${name}`
    // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
    a.href = e.target.result
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
