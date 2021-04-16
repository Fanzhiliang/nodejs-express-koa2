import express from 'express'
const router = express.Router()
import { createResult } from '../../db/model/result'
import { createToken } from '../../utils/token'
import User from '../../db/user'
import { md5 } from '../../utils'

router.get('/', (req, res, next) => {
  const result = createResult()

  const query = req.query
  const username = query.username as string
  const password = query.password as string
  const md5Password = md5(password)

  if (username && md5Password) {
    try {
      User.getUserByUsernameAndPassword({
        username,
        password: md5Password,
      }).then((data) => {
        const isValidate = data?.username === username && data?.password === md5Password

        if (isValidate) {
          result.code = 200
          result.data = createToken({
            userId: data?._id,
            username,
            password: md5Password,
          })
        } else {
          result.code = 1
          result.msg = '用户名或密码错误'
        }
      }).finally(() => {
        res.send(result)
      })
    } catch (error) {
      next(error)
    }
  } else {
    result.code = 1
    result.msg = '请输入用户名和密码'
    res.send(result)
  }
})

export default router
