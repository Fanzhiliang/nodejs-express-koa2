import express from 'express'
const router = express.Router()
import tokenFilter from '../../filters/token'
import { createResult } from '../../db/common-model/result'
import { UserModel } from '../../db/user'

/**
 * @api {Get} /user/getUserInfo getUserInfo 获取用户信息
 * @apiGroup user 用户
 *
 * @apiUse Authorization
 *
 * @apiUse Result
 * @apiUse UserSuccess
 */
router.get('/', tokenFilter, (req, res) => {
  const result = createResult()

  const query = req.query
  const user = query.user as UserModel

  // 删除隐私字段
  // delete user._id
  delete user.password

  result.data = user

  res.send(result)
})

export default router
