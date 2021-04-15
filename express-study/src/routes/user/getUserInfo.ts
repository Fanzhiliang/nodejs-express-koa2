import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import { createResult } from '../../db/model/result'
import { UserModel } from '../../db/user'

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
