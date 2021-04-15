import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import User from '../../db/user'
import { createResult } from '../../db/model/result'

router.use(tokenFilters)

router.get('/', (req, res, next) => {
  const query = req.query

  const result = createResult()
  try {
    User.getUserList({
      username: query.username as string,
      phone: query.phone as string,
    }, {
      current: Number(query.current),
      size: Number(query.size),
      sort: query.sort as string,
      order: query.order as string,
    }).then(data => {
      // 查询成功
      result.code = 200
      result.data = data
    }).catch(err => {
      // 报错
      result.code = 1
      result.msg = err
    }).finally(() => {
      // 响应
      res.send(result)
    })
  } catch (error) {
    next(error)
  }
})

export default router
