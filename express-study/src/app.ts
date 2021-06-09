import path from 'path'
import express from 'express'
// ejs 模板
import ejs from 'ejs'

import { PORT, HOST } from './config'

const app = express()

// 全局
import global from './filters/global'
app.use(global)

// 接口路由
import routes from './routes'
app.use(routes)

// 默认模板文件夹 views
app.set('views', path.resolve(__dirname, 'views'))
// 修改 ejs 后缀为 html
app.engine('html', ejs.__express)
// 配置 ejs 模板引擎
// app.set('view engine', 'ejs')
app.set('view engine', 'html')
// ejs 路由
import views from './views'
app.use(views)

// 错误日志
import log from './filters/log'
log(app)

// 404 中间件
import notFound from './filters/not-found'
app.use(notFound)

app.listen(PORT, () => {
  console.log(`Server running at ${HOST}:${PORT}`)
})
