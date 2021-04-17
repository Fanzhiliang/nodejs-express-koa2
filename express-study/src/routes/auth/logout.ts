import express from 'express'
const router = express.Router()
import { createResult } from '../../db/model/result'
const { SESSION_NAME } = global.Config
import { removeToken } from '../../utils/token'

/**
 * @api {Get} /auth/logout logout 退出登录
 * @apiGroup auth
 *
 * @apiUse Authorization
 *
 * @apiUse Result
 */
router.get('/', (req, res, next) => {
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
