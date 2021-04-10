import express from 'express'
const router = express.Router()
import { parseToken, TokenData } from '../utils/token'
import { createResult } from '../db/model/result'
const result = createResult()
import { getUserByUsernameAndPassword } from '../db/user/find'
const { TOKEN_KEY, TOKEN_EXP } = global.Config

router.use((req, res, next) => {
  result.code = 2

  // const cookie = req.cookies[TOKEN_KEY]
  // const session = req.session[SESSION_NAME]
  const token = req.headers[TOKEN_KEY] as string

  new Promise<any>((resolve, reject) => {
    parseToken(token).then((tokenData: TokenData) => {
      const now = Date.now()
      const iat = tokenData.iat || 0
      if (now - iat <= TOKEN_EXP) {
        return getUserByUsernameAndPassword({
          username: tokenData.username as string,
          password: tokenData.password as string,
        }).then(() => {
          resolve(next())
        }).catch(() => {
          reject('登录信息错误请重新登录')
        })
      } else {
        reject('登录信息已过期')
      }
    }).catch(() => {
      reject('还未登录或登录信息已过期')
    })
  }).catch(err => {
    result.msg = err
    res.send(result)
  })
})

export default router
