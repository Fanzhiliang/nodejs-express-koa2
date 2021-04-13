import express from 'express'
const router = express.Router()
import path from 'path'
import tokenFilters from '../../filters/token'
// 上传文件设置
const ResourcesPath = global.Config.UPLOAD_PATH
import multer from 'multer'
import fs from 'fs'
import { parseTime, getSuffix, mkdirCheckExists } from '../../utils'
import { createResult } from '../../db/model/result'

router.use(tokenFilters)

// 先创建上传文件夹
mkdirCheckExists(ResourcesPath)

const uploadAbleSendParam = multer({
  storage: multer.memoryStorage(),
})
// 上传并且可以获取参数
router.post('/', uploadAbleSendParam.single('file'), (req, res) => {
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
      result.code = 1
      result.msg = error.message
    } else {
      result.data = path.posix.join(global.Config.UPLOAD_PREFIX, directoryPath, fileName)
    }
    res.send(result)
  })
})

export default router
