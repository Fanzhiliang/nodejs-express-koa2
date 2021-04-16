import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import User from '../../db/user'
import { createResult } from '../../db/model/result'

router.use(tokenFilters)

router.get('/', async(req, res, next) => {
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
