import jwt from 'jsonwebtoken'
import Token from '../db/token'

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
  Token.insertManyToken([
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
    reject('token 为空')
  }

  jwt.verify(token, global.Config.TOKEN_SECRET, (err, payload) => {
    if (err) {
      reject(err)
    } else {
      const tokenData = payload as TokenData
      // 判断 token 是否存在
      Token.isExistsToken({
        userId: tokenData.userId,
        token: token.trim(),
      }).then(isExists => {
        isExists ? resolve(tokenData) : reject('token 不存在')
      })
    }
  })
})

// 销毁 token
export const removeToken = (token: string) => parseToken(token).then(tokenData => {
  // 删除数据库 token
  return Token.deleteManyToken({
    userId: tokenData.userId,
    token: token.trim(),
  })
})

