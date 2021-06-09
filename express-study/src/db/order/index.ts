/* eslint-disable no-unused-vars */
import mongoose from '../db'
import { Document, Model } from 'mongoose'
// 合并增删改查
import * as findApi from './find'
import { GoodsModel } from '../goods'

/**
 * @apiDefine OrderSuccessExample
 *
 * @apiSuccessExample 订单
 * {
 *   // id
 *   _id?: string
 *   // 用户id
 *   userId?: string
 *   // 创建时间
 *   createTime?: number
 *   // 状态 (-1: 已取消  0: 未支付  1: 待发货  2: 已发货  3: 已完成)
 *   status?: number
 *   // 子订单id数组
 *   childOrderIds?: string[]
 *   // 商品数组
 *   goodsList?: GoodsModel[]
 *   // 子订单数组
 *   orderList?: ChildOrderModel[]
 *   // 用户名
 *   username?: string
 *   // 手机号
 *   phone?: string
 * }
 */

export interface ChildOrderModel {
  _id?: string
  goodsId?: string
  number?: number
}
export interface OrderModel {
  // id
  _id?: string
  // 用户id
  userId?: string
  // 创建时间
  createTime?: number
  // 状态 (-1: 已取消  0: 未支付  1: 待发货  2: 已发货  3: 已完成)
  status?: number
  // 子订单id数组
  childOrderIds?: string[]
  // 商品数组
  goodsList?: GoodsModel[]
  // 子订单数组
  orderList?: ChildOrderModel[]
  // 用户名
  username?: string
  // 手机号
  phone?: string
}

export enum OrderStatus {
  Cancel = -1,
  WaitPay = 0,
  WaitDeliver = 1,
  Delivered = 2,
  Completed = 3,
}

export interface OrderDocument extends OrderModel, Document<string> {}

const OrderSchema = new mongoose.Schema<OrderDocument>({
  userId: {
    type: String,
    index: true,
  },
  createTime: {
    type: Number,
  },
  status: {
    type: Number,
    require: true,
    enum: OrderStatus,
    default: OrderStatus.Cancel,
  },
  childOrderIds: {
    type: Array,
    set(val: string[] = []) {
      return val.map(item => mongoose.Types.ObjectId(item))
    },
  },
  goodsList: {
    type: Array,
  },
  orderList: {
    type: Array,
  },
  username: {
    type: String,
  },
  phone: {
    type: String,
  },
}, {
  versionKey: false,
})

type FindApi = typeof findApi
type SchemaApis = FindApi
interface SchemaStatics extends Model<OrderDocument>, SchemaApis{}

// 把数据库操作方法设置到静态中
OrderSchema.statics = {
  ...<any>findApi,
}

mongoose.set('useCreateIndex', true)
export const Order = mongoose.model<OrderDocument>('order', OrderSchema, 'order') as SchemaStatics

export default Order
