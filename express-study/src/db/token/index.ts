import mongoose from '../db'
import { Document } from 'mongoose'

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

mongoose.set('useCreateIndex', true)
export const Token = mongoose.model<TokenDocument>('Token', TokenSchema, 'token')

export default Token
