import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import { createResult } from '../../db/model/result'
import { UserModel } from '../../db/user'

/**
 * @api {get} /user/getUserInfo 获取用户信息
 * @apiName getUserInfo
 * @apiGroup user
 *
 * @apiHeader {String} authorization token
 *
 * @apiSuccess {Number} code 错误代码
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {String} msg 响应信息
*/
router.get('/', tokenFilters, (req, res) => {
  const result = createResult()

  const query = req.query
  const user = query.user as UserModel

  // 删除隐私字段
  delete user._id
  delete user.password

  result.data = user

  res.send(result)
})

export default router
