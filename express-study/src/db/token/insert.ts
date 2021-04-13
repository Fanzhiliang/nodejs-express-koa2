import { Token, TokenModel } from './index'

export const insertManyToken = function(this: typeof Token, tokenList: TokenModel[]) {
  return this.insertMany(tokenList)
}
