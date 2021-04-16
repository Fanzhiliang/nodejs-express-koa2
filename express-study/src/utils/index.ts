import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

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

export const writeAppendFile = (savePath = '', fileName = '', val = '') => new Promise((resolve, reject) => {
  if (!savePath || !fileName || !val) return reject(null)

  // 创建文件夹
  mkdirCheckExists(savePath)
  // 完整文件路径
  const filePath = path.posix.join(savePath, fileName)
  // 判断是否存在
  if (fs.existsSync(filePath)) {
    // 存在插入内容
    fs.appendFile(filePath, val, { encoding: 'utf-8' },
      err => err ? reject(err) : resolve(null),
    )
  } else {
    // 不存在新建写入内容
    fs.writeFile(filePath, val, { encoding: 'utf-8' },
      err => err ? reject(err) : resolve(null),
    )
  }
})

// MD5 加密
export const md5 = (val = '') => crypto.createHash('md5').update(val, 'utf-8').digest('hex')
