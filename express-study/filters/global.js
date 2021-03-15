const path = require('path')
const express = require('express')
const router = express.Router()
// 解析 body
const bodyParser = require('body-parser')
// cookie
const cookieParser = require('cookie-parser')
// session
const session = require('express-session')
// session 保存到 mongodb
const MongoStore = require('connect-mongo')
// // session 保存到 redis
// const MongoStore = require('connect-redis')
// // session 保存到 mysql
// const MongoStore = require('connect-mysql')

const { SESSION_SECRET, SESSION_NAME, MONGO_URL, MONGO_DB } = require(path.resolve(__dirname, '../config'))

// 静态目录
router.use('/', express.static('public'))

// 解析 body
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

// cookie
router.use(cookieParser())

// session
router.use(session({
  // 服务端生成的 session 签名
  secret: SESSION_SECRET,
  // 对应 cookie 的名称
  name: SESSION_NAME,
  // 强制保存 session 即使没有改变
  resave: true,
  // 强制将未初始的 session 保存
  saveUninitialized: true,
  // cookie 设置
  cookie: {
    // 过期时间
    maxAge: 1000 * 60 * 60 * 24,
    // maxAge: 1000 * 8,
    // 只有 https 可以访问 cookie
    secure: false
  },
  // 每次请求重新设置对应的 cookie 的过期时间
  rolling: true,
  // session 保存到服务器中
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    // 数据库名
    dbName: MONGO_DB,
    // 无论有多少请求，一定时间内 session 只更新一次，除非 session 改变
    touchAfter: 1000 * 60 * 60 * 24
  })
}))

module.exports = router
