import mongoose from '../db'
import { Document } from 'mongoose'

export interface UserModel {
  _id?: any,
  username?: string
  phone?: string
  hobby?: string[],
  status?: number
}

export interface UserDocument extends UserModel, Document {}

const UserSchema = new mongoose.Schema<UserDocument>({
  // 设置索引
  username: {
    type: String,
    // 唯一索引
    unique: true,
    // 普通索引
    // index: true,
    // 去除左右空格
    // trim: true,
  },
  phone: String,
  hobby: Array,
  status: {
    type: Number,
    // 默认值
    default: 1,
  },
})

export const User = mongoose.model<UserDocument>('User', UserSchema, 'user')

export default User
