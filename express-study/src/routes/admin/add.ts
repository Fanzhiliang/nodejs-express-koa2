import express from 'express'
const router = express.Router()
import Admin from '../../db/admin'
import { Code, createResult } from '../../db/common-model/result'
import tokenFilter from '../../filters/token'
import { md5 } from '../../utils'
import { blankStringValidator, chineseLetterNumberValidator, megeValidator } from '../../utils/validator'

router.use(tokenFilter)

/**
 * @api {Post} /admin/add add 添加管理员
 * @apiGroup admin 管理员
 *
 * @apiUse Authorization
 *
 * @apiUse AdminParam
 *
 * @apiUse Result
 */
router.post('/', async(req, res, next) => {
  const result = createResult()

  const body = req.body
  const username = body.username as string
  const password = body.password as string
  const avatar = body.avatar as string
  const status = Number(body.status)
  const md5Password = md5(password)

  // 验证
  const errMsg = megeValidator([{
    handler: blankStringValidator(username),
    errorMsg: '请输入管理员名称',
  }, {
    handler: !chineseLetterNumberValidator(username),
    errorMsg: '管理员名称只能为中文、字母或数字',
  }, {
    handler: blankStringValidator(md5Password),
    errorMsg: '请输入密码',
  }])

  if (errMsg) {
    result.code = Code.DataError
    result.msg = errMsg
  } else {
    try {
      await Admin.insertManyAdmin([{
        username,
        password: md5Password,
        avatar,
        status,
      }])
      result.code = Code.Success
      result.msg = '添加管理员成功'
    } catch (error) {
      result.code = Code.DataError
      result.msg = error
      next(error)
    }
  }

  res.send(result)
})

export default router
