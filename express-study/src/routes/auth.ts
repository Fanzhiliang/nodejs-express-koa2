import express from 'express'
const router = express.Router()
import tokenFilters from '../filters/token'
import { createResult } from '../db/model/result'
const result = createResult()
const { SESSION_NAME } = global.Config
import { createToken } from '../utils/token'
import { getUserByUsernameAndPassword } from '../db/user/find'

/**
 * @api {get} /auth/login 登录
 * @apiName login
 * @apiGroup auth
 *
 * @apiHeader {String} authorization token
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 *
 * @apiSuccess {Number} code 错误代码
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {String} msg 响应信息
*/
router.get('/login', (req, res) => {
  const query = req.query
  const username = query.username as string
  const password = query.password as string

  if (username && password) {
    getUserByUsernameAndPassword({
      username,
      password,
    }).then((data) => {
      const isValidate = data?.username === username && data?.phone === password
      if (isValidate) {
        result.code = 0
        result.data = createToken({ username, password })
        result.msg = ''
      } else {
        result.code = 1
        result.msg = '用户名或密码错误'
      }
    }).finally(() => {
      res.send(result)
    })
  } else {
    result.code = 1
    result.msg = '请输入用户名和密码'
    res.send(result)
  }
})

/**
 * @api {get} /auth/logout 退出登录
 * @apiName logout
 * @apiGroup auth
 *
 * @apiHeader {String} authorization token
 *
 * @apiSuccess {Number} code 错误代码
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {String} msg 响应信息
*/
router.get('/logout', tokenFilters, (req, res) => {
  // 设置 cookie 超时时间
  req.session.cookie.maxAge = 0
  // 设置 session 内容为空
  req.session[SESSION_NAME] = undefined
  // 调用销毁方法
  req.session.destroy()

  // 响应结果
  result.code = 0
  result.msg = '退出登录'
  res.send(result)
})

export default router
