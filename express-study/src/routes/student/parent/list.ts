import express from 'express'
const router = express.Router()
import tokenFilters from '../../../filters/token'

router.use(tokenFilters)

router.get('/', (req, res) => {
  res.send('获取学生父母信息列表')
})

export default router
