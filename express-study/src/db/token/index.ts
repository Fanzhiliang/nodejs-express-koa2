import mongoose from '../db'
import { Document, Model } from 'mongoose'
// 合并增删改查
import * as insertApi from './insert'
import * as deleteApi from './delete'
import * as updateApi from './update'
import * as findApi from './find'
type InsertApi = typeof insertApi
type DeleteApi = typeof deleteApi
type UpdateApi = typeof updateApi
type FindApi = typeof findApi
interface SchemaApis extends InsertApi, DeleteApi, UpdateApi, FindApi {}
interface SchemaStatics extends Model<TokenDocument>, SchemaApis{}

export interface TokenModel {
  _id?: string
  userId: string
  token: string
  iat?: number
  exp?: number
}

export interface TokenDocument extends TokenModel, Document<string> {}

const TokenSchema = new mongoose.Schema<TokenDocument>({
  userId: {
    type: String,
    index: true,
  },
  token: {
    type: String,
    trim: true,
    unique: true,
  },
  iat: {
    type: Number,
    default: Date.now(),
  },
  exp: {
    type: Number,
    default: Date.now(),
  },
})

// 把数据库操作方法设置到静态中
TokenSchema.statics = {
  ...<any>insertApi,
  ...<any>deleteApi,
  ...<any>updateApi,
  ...<any>findApi,
}

mongoose.set('useCreateIndex', true)
export const Token = mongoose.model<TokenDocument>('Token', TokenSchema, 'token') as SchemaStatics

export default Token
