import { Token, TokenModel } from './index'

export const insert = (tokenList: TokenModel[]) => Token.insertMany(tokenList)
