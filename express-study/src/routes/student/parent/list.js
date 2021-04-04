const path = require('path')
const express = require('express')
const router = express.Router()
const tokenFilters = require(path.resolve(__dirname, '../../../filters/token'))

router.use(tokenFilters)

router.get('/', (req, res) => {
  res.send('获取学生父母信息列表')
})

module.exports = router
