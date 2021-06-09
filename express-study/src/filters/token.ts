import express from 'express'
const tokenFilter = express.Router()
import { parseToken } from '../utils/token'
import { Code, createResult } from '../db/common-model/result'
const result = createResult()
import User from '../db/user'

tokenFilter.use(async(req, res, next) => {
  result.code = Code.AuthError

  // const cookie = req.cookies[global.Config.TOKEN_KEY]
  // const session = req.session[global.Config.SESSION_NAME]
  const token = req.headers[global.Config.TOKEN_KEY] as string

  try {
    const tokenData = await parseToken(token)

    const now = Date.now()
    const exp = tokenData.exp || 0
    if (now < exp) {
      const user = await User.getUserByUsernameAndPassword({
        username: tokenData.username as string,
        password: tokenData.password as string,
      })

      // 是否存在该用户信息
      if (user) {
        req.query.user = user as any
        next()
      } else {
        throw new Error('登录信息不存在请重新登录')
      }
    } else {
      throw new Error('登录信息已过期')
    }
  } catch (error) {
    const err = error as Error
    result.msg = err.message || '还未登录或登录信息已过期'
    res.send(result)
    // 如果是普通错误不输出到日志
    err.name !== 'Error' && next(err)
  }
})

export default tokenFilter
