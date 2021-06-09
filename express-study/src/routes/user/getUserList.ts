import express from 'express'
const router = express.Router()
import tokenFilter from '../../filters/token'
import User from '../../db/user'
import { Code, createResult } from '../../db/common-model/result'

/**
 * @api {Get} /user/getUserList getUserList 获取用户列表
 * @apiGroup user 用户
 *
 * @apiUse Authorization
 *
 * @apiUse ListParams
 *
 * @apiUse Result
 * @apiUse ListResult
 * @apiSuccess {User[]} data.list 用户数组 (看下方json)
 *
 * @apiUse UserSuccessExample
 */
router.get('/', tokenFilter, async(req, res, next) => {
  const query = req.query

  const result = createResult()
  try {
    const data = await User.getUserList({
      username: query.username as string,
      phone: query.phone as string,
    }, {
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
