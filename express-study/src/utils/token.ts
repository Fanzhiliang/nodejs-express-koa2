import jwt from 'jsonwebtoken'
import { insert as insertToken } from '../db/token/insert'
import { exists as isExistsToken } from '../db/token/find'
import { deleteMany as deleteToken } from '../db/token/delete'

export interface TokenData {
  userId?: any
  username?: string
  password?: string
  iat?: number
  exp?: number
}

// 创建 token
export const createToken = (data: TokenData): string => {
  const iat = Date.now()
  const exp = iat + global.Config.TOKEN_EXP

  const payload = Object.assign(data, {
    // 签发时间
    iat,
    // 过期时间
    exp,
  })
  const token = jwt.sign(payload, global.Config.TOKEN_SECRET)

  // 保存到数据库
  insertToken([
    {
      userId: data.userId,
      token,
      iat,
      exp,
    },
  ])

  return token
}

// 解析 token
export const parseToken = (token: string) => new Promise((resolve: (tokenData: TokenData) => void, reject) => {
  if (!token.trim()) {
    reject(new Error('token 为空'))
  }

  jwt.verify(token, global.Config.TOKEN_SECRET, (err, payload) => {
    if (err) {
      reject(err)
    } else {
      const tokenData = payload as TokenData
      // 判断 token 是否存在
      isExistsToken({
        userId: tokenData.userId,
        token: token.trim(),
      }).then(isExists => {
        isExists ? resolve(tokenData) : reject(new Error('token 不存在'))
      })
    }
  })
})

// 销毁 token
export const removeToken = (token: string) => parseToken(token).then(tokenData => {
  // 删除数据库 token
  return deleteToken({
    userId: tokenData.userId,
    token: token.trim(),
  })
})

