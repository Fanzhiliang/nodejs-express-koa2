import express from 'express'
const router = express.Router()
import path from 'path'
import tokenFilter from '../../filters/token'
// 上传文件设置
const ResourcesPath = global.Config.UPLOAD_PATH
import multer from 'multer'
import fs from 'fs'
import { parseTime, getSuffix, mkdirCheckExists } from '../../utils'
import { Code, createResult } from '../../db/common-model/result'

router.use(tokenFilter)

// 先创建上传文件夹
mkdirCheckExists(ResourcesPath)

const uploadAbleSendParam = multer({
  storage: multer.memoryStorage(),
})

/**
 * @api {Post} /upload upload 上传单个文件(可获取参数)
 * @apiGroup upload 上传
 *
 * @apiUse Authorization
 *
 * @apiParam {File} file 文件
 * @apiParam {String} desc 文件描述
 *
 * @apiUse Result
 * @apiSuccess {String} data 地址
 */

router.post('/', uploadAbleSendParam.single('file'), (req, res, next) => {
  try {
    const body = req.body
    const suffix = getSuffix(req.file.originalname)
    const now = Date.now()
    const fileName = now + '_' + (body.desc || 'file') + '.' + suffix
    const directoryPath = parseTime(now, '{y}{m}{d}') + '/'
    const dir = ResourcesPath + directoryPath
    mkdirCheckExists(dir)

    fs.writeFile(dir + fileName, Buffer.from(req.file.buffer), error => {
      const result = createResult()
      if (error) {
        result.code = Code.DataError
        result.msg = error.message
      } else {
        result.data = path.posix.join(global.Config.UPLOAD_PREFIX, directoryPath, fileName)
      }
      res.send(result)
    })
  } catch (error) {
    next(error)
  }
})

export default router
