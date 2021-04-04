const path = require('path')
const express = require('express')
// ejs 模板
const ejs = require('ejs')

const { PORT, HOST } = require('./config')

const app = express()

// 全局
app.use(require('./filters/global'))
// 接口路由
app.use(require('./routes'))

// 默认模板文件夹 views
app.set('views', path.resolve(__dirname, 'views'))
// 修改 ejs 后缀为 html
app.engine('html', ejs.__express)
// 配置 ejs 模板引擎
// app.set('view engine', 'ejs')
app.set('view engine', 'html')
// ejs 路由
app.use(require('./views'))

// 错误处理中间件
app.use((req, res) => {
  res.status(404).send('404')
})

app.listen(PORT)

console.log(`Server running at http://${HOST}:${PORT}/`)