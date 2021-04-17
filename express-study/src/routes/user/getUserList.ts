import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import User from '../../db/user'
import { createResult } from '../../db/model/result'

/**
 * @api {Get} /user/getUserList getUserList 获取用户列表
 * @apiGroup user
 *
 * @apiUse Authorization
 *
 * @apiUse ListParams
 *
 * @apiUse Result
 * @apiUse ListResult
 * @apiSuccess {Array} data.list 用户数组 (看下方json)
 *
 * @apiUse UserSuccessExample
 */
router.get('/', tokenFilters, async(req, res, next) => {
  const query = req.query

  const result = createResult()
  try {
    const list = await User.getUserList({
      username: query.username as string,
      phone: query.phone as string,
    }, {
      current: Number(query.current),
      size: Number(query.size),
      sort: query.sort as string,
      order: query.order as string,
    })
    // 查询成功
    result.code = 200
    result.data = list
  } catch (error) {
    // 报错
    result.code = 1
    result.msg = error
    next(error)
  }

  res.send(result)
})

export default router
