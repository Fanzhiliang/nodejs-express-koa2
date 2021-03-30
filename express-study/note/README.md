## 2021年学习 Express 笔记

### 1 起步

[安装Express](https://www.expressjs.com.cn/)

```
npm install express --save
```

### 2 简单路由

```js
// app.js
const express = require('express')

const app = express()

const port = 3000

app.get('/auth/login', (request, response) => {
  console.log(request.query)
  console.log(request.headers)
  response.send('登录')
})

app.post('/user/add', (request, response) => {
  console.log(request)
  response.send('添加用户')
})

// 动态路由
app.delete('/user/delete/:id', (request, response) => {
  console.log(request.params)
  response.send('删除用户')
})

app.listen(port)

console.log(`Server running at http://127.0.0.1:${port}/`)
```

```
supervisor app.js
```

### 3 ejs、静态文件

```
npm install ejs --save
```

```js
// app.js
const express = require('express')
const ejs = require('ejs')

const app = express()

const port = 3000

// 默认模板文件夹 views
app.set('views', __dirname + '/views')
// 修改 ejs 后缀为 html
app.engine('html', ejs.__express)
// 配置 ejs 模板引擎
// app.set('view engine', 'ejs')
app.set('view engine', 'html')

// ejs 模板路由
app.get('/news', (request, response) => {
  response.render('news', {})
})

app.get('/', (request, response) => {
  response.render('index', {
    title: '这个是 ejs 模板文件',
    userInfo: {
      name: 'fzl',
      age: 24
    },
    tag: '<p>我是一个p标签</p>',
    hobby: ['吃饭', '睡觉', '打豆豆']
  })
})

// 静态目录
app.use('/', express.static('public'))

app.listen(port)

console.log(`Server running at http://127.0.0.1:${port}/`)
```

目录结构：

![目录结构](./1.png)

```html
<!-- index.html 模板 -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ejs 测试</title>

  <link rel="stylesheet" href="/static/css/main.css">
</head>
<body>
  <!-- 普通属性 -->
  <h2><%= title %></h2>

  <!-- 对象 -->
  <h3>用户名：<%= userInfo.name %></h3>
  <h3>年龄：<%= userInfo.age %></h3>

  <!-- 标签 -->
  <%- tag %>

  <!-- 条件判断 -->
  <% if (userInfo.age >= 100) { %>
    <h3>是一个百岁老人</h3>
  <% } else if(userInfo.age >= 18) { %>
    <h3>是一个成年人</h3>
  <% } else { %>
    <h3>是一个小孩子</h3>
  <% } %>

  <!-- 循环遍历 -->
  <h3>兴趣：</h3>
  <% for (var i = 0; i < hobby.length; i++){ %>
    <span><%= hobby[i] %></span>
  <% } %>

  <!-- 引入模板 -->
  <%- include('components/footer.html') %>
</body>
</html>
```

### 3 中间件

#### 1. 应用级中间件

```js
app.use((request, response, next) => {
  console.log('Authorization' + request.headers['authorization'])
  next()
})
```

#### 2. 路由级中间件

```js
app.get('/user/:id', (req, res, next) => {
  console.log('获取单个用户信息，参数：' + req.params.id)
  next()
})

app.get('/user/friendList', (req, res) => {
  console.log('获取用户好友列表')
  res.send('获取用户好友列表')
})
```

#### 3. 错误处理中间件

```js
app.use((req, res) => {
  res.status(404).send('404')
})
```

#### 4. 内置中间件

```js
// 静态目录
app.use('/', express.static('public'))
```

#### 5. 第三方中间件

1. body-parser

```
npm install body-parser --save
```

```js
// 解析 body
const bodyParser = require('body-parser')

// 解析 body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
```

2. cookie-parser

```
npm install cookie-parser --save
```

```js
// cookie
const cookieParser = require('cookie-parser')

app.use(cookieParser())

// 添加 cookie
res.cookie('express_test_cookie', '123456', {
  maxAge: 1000 * 60 * 60 * 24
})

// 获取 cookie
console.log(req.cookies['express_test_cookie'])
```

3. express-session

```
npm install express-session connect-mongo --save
```

```js
// session
const session = require('express-session')
// session 保存到 mongodb
const MongoStore = require('connect-mongo')
// // session 保存到 redis
// const MongoStore = require('connect-redis')
// // session 保存到 mysql
// const MongoStore = require('connect-mysql')

// 账号
const username = 'admin'

// 密码
const password = '123456'

// 连接地址
const mongoUrl = `mongodb://${username}:${password}@127.0.0.1:27017/`

// session
app.use(session({
  // 服务端生成的 session 签名
  secret: 'fanzhiliang',
  // 对应 cookie 的名称
  name: 'express_test_session',
  // 强制保存 session 即使没有改变
  resave: true,
  // 强制将未初始的 session 保存
  saveUninitialized: true,
  // cookie 设置
  cookie: {
    // 过期时间
    // maxAge: 1000 * 60 * 60 *24,
    maxAge: 1000 * 8,
    // 只有 https 可以访问 cookie
    secure: false
  },
  // 每次请求重新设置对应的 cookie 的过期时间
  rolling: true,
  // session 保存到服务器中
  store: MongoStore.create({
    mongoUrl,
    // 数据库名
    dbName: 'test-session',
    // 无论有多少请求，一定时间内 session 只更新一次，除非 session 改变
    touchAfter: 1000 * 60 * 60 *24,
  })
}))

app.get('/auth/login', (req, res) => {
  // 设置 session
  req.session['express_test_session'] = '654321'

  res.send('登录成功')
})

app.get('/auth/test', (req, res) => {
  if (req.session['express_test_session'] === '654321') {
    res.send('已经登录')
  } else {
    res.send('还未登录')
  }
})

// 销毁 cookie
app.get('/auth/logout', (req, res) => {
  // 设置 cookie 超时时间
  req.session.cookie.maxAge = 0
  // 设置 session 内容为空
  req.session['express_test_session'] = undefined
  // 调用销毁方法
  req.session.destroy()
  res.send('退出成功')
})
```

4. multer 上传文件

```
npm install multer --save
```

注意，使用 diskStorage 处理无法获取 req.body 参数

```js
const express = require('express')
const router = express.Router()
// 上传文件设置
const ResourcesPath = 'resources/upload/'
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { parseTime } = require(path.resolve(__dirname, '../../utils'))

// 获取文件后缀
const getSuffix = (fileName = '') => {
  return fileName.includes('.') ? fileName.substr(fileName.lastIndexOf('.') + 1) : ''
}

// 创建文件夹
const mkdir = (path = '') => {
  if (!path) return

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

let _saveFileName = ''
let _saveDir = ''
const uploadNoParam = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      _saveDir = ResourcesPath + parseTime(Date.now(), '{y}{m}{d}') + '/'
      mkdir(_saveDir)
      cb(null, _saveDir)
    },
    filename: function (req, file, cb) {
      const suffix = getSuffix(file.originalname)
      _saveFileName = Date.now() + '_' + file.fieldname + '.' + suffix
      cb(null, _saveFileName)
    }
  })
})
// 上传文件不获取参数
router.post('/noParam', uploadNoParam.single('file'), (req, res) => {
  res.send(_saveDir + _saveFileName)
})

// 多文件多字段上传
router.post('/noParamArray', uploadNoParam.fields([
  { name: 'file', maxCount: 1 },
  { name: 'list', maxCount: 3 }
]), (req, res) => {
  res.send(req.body)
})

const uploadAbleSendParam = multer({
  storage: multer.memoryStorage()
})
// 上传并且可以获取参数
router.post('/ableSendParam', uploadAbleSendParam.single('file'), (req, res) => {
  const suffix = getSuffix(req.file.originalname)
  const now = Date.now()
  const fileName = now + '_' + (req.body.desc || 'file') + '.' + suffix
  const dir = ResourcesPath + parseTime(now, '{y}{m}{d}') + '/'
  mkdir(dir)

  fs.writeFile(dir + fileName, Buffer.from(req.file.buffer), error => {
    if (error) {
      res.status(500).send(JSON.stringify(error))
    } else {
      res.send(dir + fileName)
    }
  })
})

module.exports = router

```