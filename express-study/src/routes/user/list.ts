import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import { list } from '../../db/user/find'

import Result from '../../db/model/result'
const result: Result = {
  code: 0,
  data: {},
  msg: '',
}

router.use(tokenFilters)

router.get('/test', (req, res) => {
  res.send('测试')
})

router.get('/', (req, res) => {
  const query = req.query
  list({
    username: query.username as string,
    phone: query.phone as string,
  }, {
    current: Number(query.current),
    size: Number(query.size),
    sort: query.sort as string,
    order: query.order as string,
  }).then(data => {
    // 查询成功
    result.code = 0
    result.data = data
  }).catch(err => {
    // 报错
    result.code = 1
    result.msg = err
  }).finally(() => {
    // 响应
    res.send(JSON.stringify(result))
  })
})

export default router
