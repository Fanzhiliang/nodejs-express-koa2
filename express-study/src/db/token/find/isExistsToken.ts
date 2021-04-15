import { Token, TokenModel } from '../index'

// 判断 token 是否存在
export const isExistsToken = function(
  this: typeof Token,
  token: TokenModel,
) {
  return this.exists(
    {
      userId: token.userId || '',
      token: token.token || '',
    },
  )
}
