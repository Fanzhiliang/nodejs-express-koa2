import mongoose from '../db'
import { Document, Model } from 'mongoose'
import * as insertApi from './insert'
import * as deleteApi from './delete'
import * as updateApi from './update'
import * as findApi from './find'

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

type InsertApi = typeof insertApi
type DeleteApi = typeof deleteApi
type UpdateApi = typeof updateApi
type FindApi = typeof findApi

interface SchemaApis extends InsertApi, DeleteApi, UpdateApi, FindApi {}

TokenSchema.statics = {
  ...<any>insertApi,
  ...<any>deleteApi,
  ...<any>updateApi,
  ...<any>findApi,
}

interface SchemaStatics extends Model<TokenDocument>, SchemaApis{}

mongoose.set('useCreateIndex', true)
export const Token = mongoose.model<TokenDocument>('Token', TokenSchema, 'token') as SchemaStatics

export default Token
