/**
 * @apiDefine GoodsSuccessExample
 *
 * @apiSuccessExample 商品
 * {
 *   // id
 *   _id?: string
 *   // 商品名称
 *   name?: string
 *   // 创建时间
 *   createTime?: number
 *   // 价格
 *   price?: number
 *   // 数量
 *   number?: number
 * }
 */

export interface GoodsModel {
  // id
  _id?: string
  // 商品名称
  name?: string
  // 创建时间
  createTime?: number
  // 价格
  price?: number
  // 数量
  number?: number
}
