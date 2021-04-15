import { Token, TokenModel } from '../index'

export const updateOneToken = function(
  this: typeof Token,
  token: TokenModel,
  newToken: TokenModel,
) {
  return this.updateOne(token, newToken)
}
