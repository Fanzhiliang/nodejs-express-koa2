import express from 'express'
const router = express.Router()
import { createResult } from '../../db/model/result'
import User, { UserModel } from '../../db/user'
import { megeValidator, blankStringValidator, chineseLetterNumberValidator, phoneValidator } from '../../utils/validator'
import { md5 } from '../../utils'
import { createToken } from '../../utils/token'

/**
 * @api {Post} /auth/register register 注册
 * @apiGroup auth
 *
 * @apiUse UserParam
 *
 * @apiUse Result
 * @apiSuccess {String} data 返回的token
 */
router.post('/', async(req, res, next) => {
  const result = createResult()

  const body = req.body
  const username = body.username as string
  const password = body.password as string
  const phone = body.phone as string
  const gender = body.gender as number
  const avatar = body.avatar as string
  const md5Password = md5(password)

  // 验证
  const errMsg = megeValidator([{
    handler: blankStringValidator(username),
    errorMsg: '请输入用户名',
  }, {
    handler: !chineseLetterNumberValidator(username),
    errorMsg: '用户名只能为中文、字母或数字',
  }, {
    handler: blankStringValidator(md5Password),
    errorMsg: '请输入密码',
  }, {
    handler: !phoneValidator(phone),
    errorMsg: '请输入正确的电话号码',
  }])

  if (errMsg) {
    result.code = 1
    result.msg = errMsg
  } else {
    try {
      const [data] = await User.insertManyUser([{
        username,
        password: md5Password,
        phone,
        gender,
        avatar,
      }])
      const user = data as UserModel
      result.data = await createToken({
        userId: user?._id,
        username,
        password: md5Password,
      })
      result.msg = '注册成功'
    } catch (error) {
      result.msg = error.message
      result.code = 1
      next(error)
    }
  }
  res.send(result)
})

export default router
