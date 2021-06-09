import express from 'express'
import { Code, createResult } from '../../db/common-model/result'
import User, { UserModel } from '../../db/user'
import tokenFilter from '../../filters/token'
import { md5 } from '../../utils'
const router = express.Router()

router.use(tokenFilter)

/**
 * @api {Post} /user/updatePassword updatePassword 修改用户密码
 * @apiGroup user 用户
 *
 * @apiUse Authorization
 *
 * @apiParam {String} password 旧密码
 * @apiParam {String} newPassword 新密码
 *
 * @apiUse Result
 */
router.post('/', async(req, res, next) => {
  const result = createResult()

  const query = req.query
  const body = req.body

  // 接口调用者
  const authUser = query.user as UserModel

  const password = body.password as string
  const md5Password = md5(password)
  const newPassword = body.newPassword as string

  let errMsg = ''

  if (!password || !password.trim()) {
    errMsg = '请输入旧密码'
  } else if (!newPassword || !newPassword.trim()) {
    errMsg = '请输入新密码'
  } else if (password === newPassword) {
    errMsg = '新密码与旧密码不能相同'
  }

  if (errMsg) {
    result.code = Code.DataError
    result.msg = errMsg
  } else {
    try {
      const user = await User.getUserByUsernameAndPassword({
        username: authUser.username,
        password: md5Password,
      })

      const isValidate = user?.username === authUser.username && user?.password === md5Password

      if (isValidate) {
        await User.updateOneUser({
          _id: authUser._id,
        }, {
          password: md5(newPassword),
        })
        result.code = Code.Success
        result.msg = '修改成功'
      } else {
        result.code = Code.DataError
        result.msg = '旧密码错误'
      }
    } catch (error) {
      result.code = Code.DataError
      result.msg = error
      next(error)
    }
  }

  res.send(result)
})

export default router
