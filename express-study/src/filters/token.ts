import path from 'path'
import express from 'express'
const router = express.Router()

const { TOKEN_KEY, SESSION_NAME } = require(path.resolve(__dirname, '../config'))

router.use((req, res, next) => {
  console.log('获取cookie：' + req.cookies[TOKEN_KEY])
  console.log('获取session：' + req.session[SESSION_NAME])
  console.log('获取Authorization：' + req.headers.authorization)
  next()
})

export default router
