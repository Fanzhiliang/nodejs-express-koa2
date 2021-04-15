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
interface SchemaStatics extends Model<UserDocument>, SchemaApis{}

export interface UserModel {
  _id?: string
  username?: string
  password?: string
  phone?: string
  hobby?: string[]
  status?: number
}

export interface UserDocument extends UserModel, Document<string> {}

const UserSchema = new mongoose.Schema<UserDocument>({
  // 设置索引
  username: {
    type: String,
    // 唯一索引
    unique: true,
    // 普通索引
    // index: true,
    // 去除左右空格
    trim: true,
  },
  // 密码
  password: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
  },
  hobby: Array,
  status: {
    type: Number,
    // 默认值
    default: 1,
  },
})

// 把数据库操作方法设置到静态中
UserSchema.statics = {
  ...<any>insertApi,
  ...<any>deleteApi,
  ...<any>updateApi,
  ...<any>findApi,
}

mongoose.set('useCreateIndex', true)
export const User = mongoose.model<UserDocument>('User', UserSchema, 'user') as SchemaStatics

export default User
