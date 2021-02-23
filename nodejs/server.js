const http = require('http')
const routes = require('./routes')

const port = 3031
const publishPath = './publish'

http.createServer(async function (request, response) {
  // 静态服务器
  routes(request, response, publishPath)

  routes.get('/getUserInfo', (req, res) => {
    res.end(JSON.stringify({
      code: 200,
      data: req.query,
      msg: '获取用户信息接口'
    }))
  })

  routes.post('/login', (req, res) => {
    res.end(JSON.stringify({
      code: 200,
      data: req.body,
      msg: '登录接口'
    }))
  })
}).listen(port)

console.log(`Server running at http://127.0.0.1:${port}/`)
