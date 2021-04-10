import jwt from 'jsonwebtoken'

export interface TokenData {
  username?: string
  password?: string
  iat?: number
}

export const createToken = (data: TokenData): string => {
  const payload = Object.assign(data, {
    // 签发时间
    iat: Date.now(),
    // 过期时间
    // exp: global.Config.TOKEN_EXP,
  })
  const token = jwt.sign(payload, global.Config.TOKEN_SECRET)
  return token
}

export const parseToken = (token: string): Promise<any> => new Promise((resolve, reject) => {
  if (!token) {
    reject(new Error('token 为空'))
  }

  jwt.verify(token, global.Config.TOKEN_SECRET, (err, payload) => {
    if (err) {
      reject(err)
    } else {
      resolve(payload)
    }
  })
})

