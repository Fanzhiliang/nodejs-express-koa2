import express from 'express'
const router = express.Router()
import tokenFilter from '../../filters/token'
import Order from '../../db/order'
import { UserModel } from '../../db/user'
import { Code, createResult } from '../../db/common-model/result'

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

router.get('/', tokenFilter, async(req, res, next) => {
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
    // 查询成功
    result.code = Code.Success
    result.data = data
  } catch (error) {
    // 报错
    result.code = Code.DataError
    result.msg = error
    next(error)
  }

  res.send(result)
})

export default router
