const http = require('http')
const url = require('url')

const { parseTime } = require('./utils')

console.log('当前时间：' + parseTime(Date.now()))

http.createServer(function (request, response) {
  if (request.url !== '/favicon.ico') {
    // 第一个参数：url
    // 第二个参数：是否解析 query 字符串
    const query = url.parse(request.url, true).query

    console.log(`地址参数传入姓名：${query.name}`)
  }

  /**
   * text/plain ：纯文本格式
   * text/html ： HTML格式
   * application/json： JSON数据格式
   *
   * Content-Type 需要设置成 text/html，下面的html标签才会识别渲染
   * 如果设置成 text/plain，全部输出成纯文本
  */
  response.writeHead(200, { 'Content-Type': 'text/html;charset="UTF-8"' })

  response.write('我是fanzhiliang<br>')

  response.write('你好啊~')

  response.end()
}).listen(3000)

console.log('Server running at http://127.0.0.1:3000/')
