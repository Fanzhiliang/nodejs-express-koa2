import { Token, TokenModel } from './index'

export const deleteManyToken = function(this: typeof Token, token: TokenModel) {
  return this.deleteMany(token)
}
