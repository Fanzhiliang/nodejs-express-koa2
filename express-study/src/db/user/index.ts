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
interface SchemaApis extends InsertApi, DeleteApi, UpdateApi, FindApi { }
interface SchemaStatics extends Model<UserDocument>, SchemaApis { }

export interface UserModel {
  _id?: string
  username?: string
  password?: string
  phone?: string
  gender?: number
  createTime?: Date
  avatar?: string
  status?: number
}

export interface UserDocument extends UserModel, Document<string> { }

const UserSchema = new mongoose.Schema<UserDocument>({
  // 设置索引
  username: {
    require: true,
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
    require: true,
    type: String,
    trim: true,
  },
  phone: {
    require: true,
    type: String,
    unique: true,
    trim: true,
  },
  /**
   * 性别
   * (0: 未知、1: 男、2: 女)
  */
  gender: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  // 创建时间
  createTime: {
    type: Date,
    default: () => new Date(),
  },
  // 头像
  avatar: {
    type: String,
    trim: true,
    default: '',
  },
  /**
   * 状态
   * (0: 禁用、1: 正常)
  */
  status: {
    type: Number,
    enum: [0, 1],
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
