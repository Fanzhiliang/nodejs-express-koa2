import { Token, TokenModel } from './index'

export const exists = (token: TokenModel) => Token.exists(
  {
    userId: token.userId || '',
    token: token.token || '',
  },
)
