import express from 'express'
const router = express.Router()
import { createResult } from '../db/model/result'
const { SESSION_NAME } = global.Config
import { createToken, removeToken } from '../utils/token'
import User from '../db/user'

router.get('/login', (req, res, next) => {
  const result = createResult()

  const query = req.query
  const username = query.username as string
  const password = query.password as string

  if (username && password) {
    try {
      User.getUserByUsernameAndPassword({
        username,
        password,
      }).then((data) => {
        const isValidate = data?.username === username && data?.phone === password
        if (isValidate) {
          result.code = 200
          result.data = createToken({
            userId: data?._id,
            username,
            password,
          })
        } else {
          result.code = 1
          result.msg = '用户名或密码错误'
        }
      }).finally(() => {
        res.send(result)
      })
    } catch (error) {
      next(error)
    }
  } else {
    result.code = 1
    result.msg = '请输入用户名和密码'
    res.send(result)
  }
})

router.get('/logout', (req, res, next) => {
  const result = createResult()

  // 设置 cookie 超时时间
  req.session.cookie.maxAge = 0
  // 设置 session 内容为空
  req.session[SESSION_NAME] = undefined
  // 调用销毁方法
  req.session.destroy()

  // 就是 token 没有或者不正确，也返回退出成功
  const token = req.headers[global.Config.TOKEN_KEY] as string || ''

  try {
    removeToken(token).finally(() => {
      // 响应结果
      result.code = 200
      result.msg = '退出成功'
      res.send(result)
    })
  } catch (error) {
    next(error)
  }
})

export default router
