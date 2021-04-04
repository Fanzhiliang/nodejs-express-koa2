import path from 'path'
import express from 'express'
const router = express.Router()
import tokenFilters from '../filters/token'

const { TOKEN_KEY, SESSION_NAME } = require(path.resolve(__dirname, '../config'))

router.get('/login', (req, res) => {
  console.log(req.query)

  // 设置 cookie
  res.cookie(TOKEN_KEY, '123456', {
    maxAge: 1000 * 60 * 60 * 24,
  })

  // 设置 session
  req.session[SESSION_NAME] = '654321'

  res.send('登录成功')
})

router.get('/test', tokenFilters, (req, res) => {
  if (req.session[SESSION_NAME] === '654321') {
    res.send('已经登录')
  } else {
    res.send('还未登录')
  }
})

// 销毁 cookie
router.get('/logout', tokenFilters, (req, res) => {
  // 设置 cookie 超时时间
  req.session.cookie.maxAge = 0
  // 设置 session 内容为空
  req.session[SESSION_NAME] = undefined
  // 调用销毁方法
  req.session.destroy()
  res.send('退出成功')
})

export default router
