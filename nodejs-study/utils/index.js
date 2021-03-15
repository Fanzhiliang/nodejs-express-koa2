const fs = require('fs')
const path = require('path')

/**
 * 解析时间戳
 * @param {(object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
exports.parseTime = function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }

  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })

  return timeStr
}

// 保存 mime-type json 对象
let mimeJson = null
/**
 * 获取 mime-type json 对象
*/
const getMimeJson = () => new Promise((resolve, reject) => {
  if (mimeJson) {
    resolve(mimeJson)
  } else {
    fs.readFile(path.resolve(__dirname, 'mime.json'), (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        mimeJson = JSON.parse(data.toString())
        resolve(mimeJson)
      }
    })
  }
})

/**
 * 根据拓展名获取 mime
 * @param {string} extname
 * @returns {string | null}
 */
exports.getMime = async function getMime (extname) {
  const mimeJson = await getMimeJson()
  return mimeJson[extname] ? mimeJson[extname] : 'text/html'
}
