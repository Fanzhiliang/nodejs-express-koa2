/* eslint-disable no-unused-vars */
import mongoose from '../db'
import { Document, Model } from 'mongoose'
// 合并增删改查
import * as insertApi from './insert'
import * as deleteApi from './delete'
import * as updateApi from './update'
import * as findApi from './find'

/**
 * @apiDefine UserParam
 *
 * @apiParam {String} _id id
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParam {String} phone 电话号码
 * @apiParam {Number} gender 性别 (0: 未知  1: 男  2: 女)
 * @apiParam {Number} createTime 创建时间
 * @apiParam {String} avatar 头像
 * @apiParam {Number} status 状态 (0: 禁用  1: 正常)
 */

/**
 * @apiDefine UserSuccess
 *
 * @apiSuccess {String} _id id
 * @apiSuccess {String} username 用户名
 * @apiSuccess {String} password 密码
 * @apiSuccess {String} phone 电话号码
 * @apiSuccess {Number} gender 性别 (0: 未知  1: 男  2: 女)
 * @apiSuccess {Number} createTime 创建时间
 * @apiSuccess {String} avatar 头像
 * @apiSuccess {Number} status 状态 (0: 禁用  1: 正常)
 */

/**
 * @apiDefine UserSuccessExample
 *
 * @apiSuccessExample 用户
 * {
 *   // id
 *   _id?: string
 *   // 用户名
 *   username?: string
 *   // 密码
 *   password?: string
 *   // 电话号码
 *   phone?: string
 *   // 性别 (0: 未知  1: 男  2: 女)
 *   gender?: number
 *   // 创建时间
 *   createTime?: number
 *   // 头像
 *   avatar?: string
 *   // 状态 (0: 禁用  1: 正常)
 *   status?: number
 * }
 */

export interface UserModel {
  // id
  _id?: string
  // 用户名
  username?: string
  // 密码
  password?: string
  // 电话号码
  phone?: string
  // 性别 (0: 未知  1: 男  2: 女)
  gender?: number
  // 创建时间
  createTime?: number
  // 头像
  avatar?: string
  // 状态 (0: 禁用  1: 正常)
  status?: number
}

// 性别
export enum UserGender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

// 状态
export enum UserStatus {
  Disable = 0,
  Normal = 1,
}

export interface UserDocument extends UserModel, Document<string> { }

const UserSchema = new mongoose.Schema<UserDocument>({
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
  gender: {
    type: Number,
    enum: UserGender,
    default: UserGender.Unknown,
  },
  createTime: {
    type: Number,
    default: () => Date.now(),
  },
  avatar: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: Number,
    enum: UserStatus,
    default: UserStatus.Normal,
  },
}, {
  versionKey: false,
})

type InsertApi = typeof insertApi
type DeleteApi = typeof deleteApi
type UpdateApi = typeof updateApi
type FindApi = typeof findApi
interface SchemaApis extends InsertApi, DeleteApi, UpdateApi, FindApi { }
interface SchemaStatics extends Model<UserDocument>, SchemaApis { }

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
