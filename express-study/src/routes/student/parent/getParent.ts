import express from 'express'
const router = express.Router()
import tokenFilters from '../../../filters/token'

router.use(tokenFilters)

router.get('/', (req, res) => {
  const id = parseInt(req.query.id + '')
  res.send('获取学生父母信息：' + id)
})

export default router
