import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import Order from '../../db/order'
import { UserModel } from '../../db/user'
import { createResult } from '../../db/model/result'

/**
 * @api {Get} /order/getOrderList getOrderList 获取订单列表
 * @apiGroup order 订单
 *
 * @apiUse Authorization
 *
 * @apiUse ListParams
 *
 * @apiUse Result
 * @apiUse ListResult
 * @apiSuccess {Order[]} data.list 订单数组 (看下方json)
 *
 * @apiUse OrderSuccessExample
 * @apiUse GoodsSuccessExample
 */

router.get('/', tokenFilters, async(req, res, next) => {
  const query = req.query
  const user = query.user as UserModel

  const result = createResult()
  try {
    const data = await Order.getOrderList(user._id as string, {
      current: Number(query.current),
      size: Number(query.size),
      sort: query.sort as string,
      order: query.order as string,
    })
    // 设置商品列表的商品数量
    data.list.forEach(item => {
      item.goodsList?.forEach(it => {
        const findObj = item.orderList?.find(i => i.goodsId?.toString() === it._id?.toString())
        if (findObj) {
          it.number = findObj.number
        }
        delete item.orderList
      })
    })
    // 查询成功
    result.code = 200
    result.data = data
  } catch (error) {
    // 报错
    result.code = 1
    result.msg = error
    next(error)
  }

  res.send(result)
})

export default router
