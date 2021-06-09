import express from 'express'
const router = express.Router()
import tokenFilter from '../../filters/token'
import { Code, createResult } from '../../db/common-model/result'
import { User, UserModel } from '../../db/user'
import { blankStringValidator, chineseLetterNumberValidator, megeValidator, phoneValidator } from '../../utils/validator'

/**
 * @api {Post} /user/updateUser updateUser 修改用户信息
 * @apiGroup user 用户
 *
 * @apiUse Authorization
 *
 * @apiUse UserParam
 *
 * @apiUse Result
 */
router.post('/', tokenFilter, async(req, res, next) => {
  const result = createResult()

  const body = req.body
  const username = body.username as string
  const phone = body.phone as string
  const gender = Number(body.gender as number)
  const avatar = body.avatar as string

  let errMsg = ''

  // 条件对象
  const filter: UserModel = {
    _id: body._id,
  }

  if (!filter._id) {
    errMsg = '请输入用户id'
  }

  // 更新对象
  const update: UserModel = {}

  // 检查允许更新的字段
  if (username && username.trim()) {
    errMsg = megeValidator([{
      handler: blankStringValidator(username),
      errorMsg: '请输入用户名',
    }, {
      handler: !chineseLetterNumberValidator(username),
      errorMsg: '用户名只能为中文、字母或数字',
    }])
    !errMsg && (update.username = username)
  }
  if (phone && phone.trim()) {
    errMsg = megeValidator([{
      handler: !phoneValidator(phone),
      errorMsg: '请输入正确的电话号码',
    }])
    !errMsg && (update.phone = phone)
  }
  if (typeof gender === 'number') {
    update.gender = gender
  }
  if (avatar && avatar.trim()) {
    update.avatar = avatar
  }

  // 字段有错误
  if (errMsg) {
    result.code = Code.DataError
    result.msg = errMsg
  } else {
    try {
      await User.updateOneUser(filter, update)
      result.code = Code.Success
      result.msg = '修改成功'
    } catch (error) {
      result.code = Code.DataError
      result.msg = error
      next(error)
    }
  }

  res.send(result)
})

export default router
