import express from 'express'
const router = express.Router()
import tokenFilters from '../filters/token'

router.use(tokenFilters)

router.post('/add', (request, response) => {
  console.log(request.body)
  response.send('添加用户')
})

// 动态路由
router.delete('/delete/:id', (request, response) => {
  console.log(request.params)
  response.send('删除用户')
})

// 路由级中间件
router.get('/:id', (req, res, next) => {
  console.log('获取单个用户信息，参数：' + req.params.id)
  next()
})

router.get('/friendList', (req, res) => {
  console.log('获取用户好友列表')
  res.send('获取用户好友列表')
})

export default router

