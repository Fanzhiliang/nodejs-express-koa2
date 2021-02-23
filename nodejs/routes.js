const url = require('url')
const fs = require('fs')
const path = require('path')
const { getMime } = require('./utils')

const charset = 'UTF-8'

/**
 * 静态服务器
 * @param {object} request
 * @param {object} response
 * @param {string} publishPath
 * @return {undefined}
 */
exports.static = async (request, response, publishPath) => {
  // 地址
  let pathname = request.url === '/' ? '/index.html' : request.url
  pathname = url.parse(pathname).pathname
  // 拓展名
  const extname = path.extname(pathname)
  // mime
  const mime = await getMime(extname)

  fs.readFile(publishPath + pathname, (err, data) => {
    if (err) {
      response.writeHead(404, { 'Content-Type': `text/html;charset="${charset}"` })
      response.end('找不到该页面')
    } else {
      response.writeHead(200, { 'Content-Type': `${mime};charset="${charset}"` })
      response.end(data)
    }
  })
}
