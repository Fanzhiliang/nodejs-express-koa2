import { Token, TokenModel } from './index'

export const isExistsToken = function(this: typeof Token, token: TokenModel) {
  return this.exists(
    {
      userId: token.userId || '',
      token: token.token || '',
    },
  )
}
