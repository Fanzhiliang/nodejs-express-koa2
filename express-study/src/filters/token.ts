import express from 'express'
const router = express.Router()
import { parseToken } from '../utils/token'
import { createResult } from '../db/model/result'
const result = createResult()
import User from '../db/user'
const { TOKEN_KEY } = global.Config

router.use((req, res, next) => {
  result.code = 2

  // const cookie = req.cookies[TOKEN_KEY]
  // const session = req.session[SESSION_NAME]
  const token = req.headers[TOKEN_KEY] as string

  new Promise<any>((resolve, reject) => {
    parseToken(token).then((tokenData) => {
      const now = Date.now()
      const exp = tokenData.exp || 0
      if (now < exp) {
        return User.getUserByUsernameAndPassword({
          username: tokenData.username as string,
          password: tokenData.password as string,
        }).then((user) => {
          if (user) {
            req.query.user = user as any
            resolve(next())
          } else {
            reject('登录信息不存在请重新登录')
          }
        }).catch(() => {
          reject('登录信息错误请重新登录')
        })
      } else {
        reject('登录信息已过期')
      }
    }).catch((err: Error) => {
      reject(err || '还未登录或登录信息已过期')
    })
  }).catch((err: Error | string) => {
    result.msg = typeof err === 'string' ? err : err.message
    res.send(result)
    err instanceof Error && next(err)
  })
})

export default router
