const path = require('path')
const express = require('express')
const router = express.Router()
const tokenFilters = require(path.resolve(__dirname, '../../../filters/token'))

router.use(tokenFilters)

router.get('/', (req, res, next) => {
  const id = parseInt(req.query.id)
  res.send('获取学生父母信息：' + id)
})

module.exports = router
