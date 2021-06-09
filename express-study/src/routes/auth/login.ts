import express from 'express'
const router = express.Router()
import { Code, createResult } from '../../db/common-model/result'
import { createToken } from '../../utils/token'
import User from '../../db/user'
import { md5 } from '../../utils'

/**
 * @api {Get} /auth/login login 登录
 * @apiGroup auth 权限
 *
 * @apiParam {String} username=fanzhiliang 用户名
 * @apiParam {String} password=123456 密码
 *
 * @apiUse Result
 * @apiSuccess {String} data 返回的token
 */
router.get('/', async(req, res, next) => {
  const result = createResult()

  const query = req.query
  const username = query.username as string
  const password = query.password as string
  const md5Password = md5(password)

  if (username && md5Password) {
    try {
      const user = await User.getUserByUsernameAndPassword({
        username,
        password: md5Password,
      })

      const isValidate = user?.username === username && user?.password === md5Password

      if (isValidate) {
        result.code = Code.Success
        result.data = await createToken({
          userId: user?._id,
          username,
          password: md5Password,
        })
      } else {
        result.code = Code.DataError
        result.msg = '用户名或密码错误'
      }
    } catch (error) {
      next(error)
    }
  } else {
    result.code = Code.DataError
    result.msg = '请输入用户名和密码'
  }

  res.send(result)
})

export default router
