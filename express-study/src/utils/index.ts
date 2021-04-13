import fs from 'fs'

// 格式化时间戳
export const parseTime = (time: number | string| Date, cFormat = '{y}-{m}-{d} {h}:{i}:{s}'): string => {
  if (!time) return ''

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      } else {
        time = time.replace(/-/gm, '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

// 获取文件后缀
export const getSuffix = (fileName = '') => {
  return fileName.includes('.') ? fileName.substr(fileName.lastIndexOf('.') + 1) : ''
}

// 检查文件夹是否存在再创建文件夹
export const mkdirCheckExists = (path = '') => {
  if (!path) return

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}
