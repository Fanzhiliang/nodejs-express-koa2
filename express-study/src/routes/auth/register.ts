import express from 'express'
const router = express.Router()
import { createResult } from '../../db/model/result'
import User from '../../db/user'
import { megeValidator, blankStringValidator, chineseLetterNumberValidator, phoneValidator } from '../../utils/validator'
import { md5 } from '../../utils'

router.post('/', async(req, res, next) => {
  const result = createResult()

  const body = req.body
  const username = body.username as string
  const password = body.password as string
  const phone = body.phone as string
  const gender = body.gender as number
  const avatar = body.avatar as string

  // 验证
  const errMsg = megeValidator([{
    handler: blankStringValidator(username),
    errorMsg: '请输入用户名',
  }, {
    handler: !chineseLetterNumberValidator(username),
    errorMsg: '用户名只能为中文、字母或数字',
  }, {
    handler: blankStringValidator(password),
    errorMsg: '请输入密码',
  }, {
    handler: !phoneValidator(phone),
    errorMsg: '请输入正确的电话号码',
  }])

  if (errMsg) {
    result.code = 1
    result.msg = errMsg
    res.send(result)
  } else {
    try {
      await User.insertManyUser([{
        username,
        password: md5(password),
        phone,
        gender,
        avatar,
      }])
      result.msg = '注册成功'
    } catch (error) {
      result.msg = error.message
      result.code = 1
      next(error)
    }

    res.send(result)
  }
})

export default router
