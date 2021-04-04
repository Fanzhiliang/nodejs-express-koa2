import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'

router.use(tokenFilters)

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    next()
  } else {
    res.send('获取学生信息：' + id)
  }
})

export default router
