const url = require('url')
const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const { getMime } = require('./utils')

const charset = 'UTF-8'

/**
 * @param {object} request
 * @param {object} response
 * @param {string} publishPath
 * @return {undefined}
 */
const routes = async (request, response, publishPath) => {
  if (!request || !response) {
    throw new Error('缺少请求或者响应参数')
  }

  // 如果有传入静态目录，开启静态服务器
  if (publishPath) {
    await staticServer(request, response, publishPath)
  }

  // 开启路由服务器
  routeServer(request, response)
}

/**
 * 静态服务器
 * @param {object} request
 * @param {object} response
 * @param {string} publishPath
 * @return {undefined}
 */
const staticServer = async (request, response, publishPath) => {
  // 地址
  let pathname = request.url === '/' ? '/index.html' : request.url
  pathname = url.parse(pathname).pathname
  // 拓展名
  const extname = path.extname(pathname)
  // mime
  const mime = await getMime(extname)

  try {
    const data = fs.readFileSync(publishPath + pathname)
    response.writeHead(200, { 'Content-Type': `${mime};charset="${charset}"` })
    response.end(data)
  } catch (error) {
    // response.writeHead(404, { 'Content-Type': `text/html;charset="${charset}"` })
    // response.end('找不到该页面')
  }
}

const RouteMap = {
  GET: {},
  POST: {}
}

/**
 * get请求
 * @param {string} pathname
 * @param {function} callback
 * @return {undefined}
 */
routes.get = (pathname, callback) => {
  if (!pathname || !callback) {
    throw new Error('路由和回调函数不能为空')
  }

  RouteMap.GET[pathname] = callback
}

/**
 * post请求
 * @param {string} pathname
 * @param {function} callback
 * @return {undefined}
 */
routes.post = (pathname, callback) => {
  if (!pathname || !callback) {
    throw new Error('路由和回调函数不能为空')
  }

  RouteMap.POST[pathname] = callback
}

/**
 * 默认错误回调
 * @param {object} request
 * @param {object} response
 * @return {undefined}
 */
routes.error = (request, response) => {
  response.writeHead(404, { 'Content-Type': `text/html;charset="${charset}"` })
  response.end('找不到该页面')
}

/**
 * 路由服务器
 * @param {object} request
 * @param {object} response
 * @return {undefined}
 */
const routeServer = async (request, response) => {
  const urlObj = url.parse(request.url)
  // 路由
  const pathname = urlObj.pathname

  // 设置默认响应头
  response.writeHead(200, { 'Content-Type': `application/json;charset="${charset}"` })

  // 处理 get 请求
  if (RouteMap.GET[pathname]) {
    const query = querystring.parse(urlObj.query)

    request.query = query

    RouteMap.GET[pathname](request, response)

  // 处理 post 请求
  } else if (RouteMap.POST[pathname]) {
    const contentType = request.headers['content-type']

    let postData = ''
    request.on('data', (chunk) => {
      postData += chunk
    })

    request.on('end', () => {
      postData = decodeURI(postData)

      switch (contentType) {
        case 'application/x-www-form-urlencoded':
          request.body = querystring.parse(postData)
          break
        case 'application/json':
          request.body = JSON.parse(postData)
          break
      }

      RouteMap.POST[pathname](request, response)
    })

  // 找不到路由
  } else {
    routes.error(request, response)
  }
}

module.exports = routes
