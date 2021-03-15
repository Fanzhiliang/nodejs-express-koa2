const express = require('express')
const router = express.Router()

// ejs 模板路由
router.get('/news', (req, res) => {
  res.render('news', {})
})

router.get('/', (req, res) => {
  res.render('index', {
    title: '这个是 ejs 模板文件',
    userInfo: {
      name: 'fzl',
      age: 24
    },
    tag: '<p>我是一个p标签</p>',
    hobby: ['吃饭', '睡觉', '打豆豆']
  })
})

module.exports = router
