const path = require('path')
const express = require('express')
const router = express.Router()
const tokenFilters = require(path.resolve(__dirname, '../../filters/token'))

router.use(tokenFilters)

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    next()
  } else {
    res.send('获取学生信息：' + id)
  }
})

module.exports = router
