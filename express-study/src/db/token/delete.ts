import { Token, TokenModel } from './index'

export const deleteMany = (token: TokenModel) => Token.deleteMany(token)
