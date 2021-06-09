/* eslint-disable no-unused-vars */
import mongoose from '../db'
import { Document, Model } from 'mongoose'
// 合并增删改查
import * as insertApi from './insert'
import * as deleteApi from './delete'
import * as updateApi from './update'
import * as findApi from './find'

/**
 * @apiDefine AdminParam
 *
 * @apiParam {String} _id id
 * @apiParam {String} username 管理员名称
 * @apiParam {String} password 密码
 * @apiParam {Number} createTime 创建时间
 * @apiParam {String} avatar 头像
 * @apiParam {Number} status 状态 (0: 禁用  1: 正常)
 */

/**
 * @apiDefine AdminSuccess
 *
 * @apiSuccess {String} _id id
 * @apiSuccess {String} username 管理员名称
 * @apiSuccess {String} password 密码
 * @apiSuccess {Number} createTime 创建时间
 * @apiSuccess {String} avatar 头像
 * @apiSuccess {Number} status 状态 (0: 禁用  1: 正常)
 */

/**
 * @apiDefine AdminSuccessExample
 *
 * @apiSuccessExample 管理员
 * {
 *   // id
 *   _id?: string
 *   // 管理员名称
 *   username?: string
 *   // 密码
 *   password?: string
 *   // 创建时间
 *   createTime?: number
 *   // 头像
 *   avatar?: string
 *   // 状态 (0: 禁用  1: 正常)
 *   status?: number
 *  }
 */

export interface AdminModel {
  // id
  _id?: string
  // 管理员名称
  username?: string
  // 密码
  password?: string
  // 创建时间
  createTime?: number
  // 头像
  avatar?: string
  // 状态 (0: 禁用  1: 正常)
  status?: number
}

// 状态
export enum AdminStatus {
  Disable = 0,
  Normal = 1,
}

export interface AdminDocument extends AdminModel, Document<string> { }

const AdminSchema = new mongoose.Schema<AdminDocument>({
  username: {
    require: true,
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    require: true,
    type: String,
    trim: true,
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
    enum: AdminStatus,
    default: AdminStatus.Normal,
  },
}, {
  versionKey: false,
})

type InsertApi = typeof insertApi
type DeleteApi = typeof deleteApi
type UpdateApi = typeof updateApi
type FindApi = typeof findApi
interface SchemaApis extends InsertApi, DeleteApi, UpdateApi, FindApi { }
interface SchemaStatics extends Model<AdminDocument>, SchemaApis { }

// 把数据库操作方法设置到静态中
AdminSchema.statics = {
  ...<any>insertApi,
  ...<any>deleteApi,
  ...<any>updateApi,
  ...<any>findApi,
}

mongoose.set('useCreateIndex', true)
export const Admin = mongoose.model<AdminDocument>('Admin', AdminSchema, 'admin') as SchemaStatics

export default Admin
