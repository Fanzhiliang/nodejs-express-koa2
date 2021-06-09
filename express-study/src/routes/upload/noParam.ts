import express from 'express'
const router = express.Router()
import path from 'path'
import tokenFilters from '../../filters/token'
// 上传文件设置
const ResourcesPath = global.Config.UPLOAD_PATH
import multer from 'multer'
import { parseTime, getSuffix, mkdirCheckExists } from '../../utils'
import { createResult } from '../../db/common-model/result'

router.use(tokenFilters)

// 先创建上传文件夹
mkdirCheckExists(ResourcesPath)

const SaveFileNames: string[] = []
let SaveDir = ''
const uploadNoParam = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      SaveDir = parseTime(Date.now(), '{y}{m}{d}') + '/'
      const buildDir = ResourcesPath + SaveDir
      mkdirCheckExists(buildDir)
      cb(null, buildDir)
    },
    filename: function(req, file, cb) {
      const suffix = getSuffix(file.originalname)
      const saveFileName = Date.now() + '_' + file.fieldname + '.' + suffix
      SaveFileNames.push(saveFileName)
      cb(null, saveFileName)
    },
  }),
})

// 清空保存数据
const clearSaveData = express.Router()
clearSaveData.use((req, res, next) => {
  SaveFileNames.splice(0)
  SaveDir = ''
  next()
})

/**
 * @api {Post} /upload/noParam/single single 上传单个文件
 * @apiGroup upload 上传
 *
 * @apiUse Authorization
 *
 * @apiParam {File} file 文件
 *
 * @apiUse Result
 * @apiSuccess {String} data 地址
 */
router.post('/single', clearSaveData, uploadNoParam.single('file'), (req, res, next) => {
  try {
    const result = createResult()
    result.data = path.posix.join(global.Config.UPLOAD_PREFIX, SaveDir, SaveFileNames[0])
    res.send(result)
  } catch (error) {
    next(error)
  }
})

/**
 * @api {Post} /upload/noParam/fields fields 上传多个文件
 * @apiGroup upload 上传
 *
 * @apiUse Authorization
 *
 * @apiParam {File} file 单个文件
 * @apiParam {File} list 多个文件 (最多9个文件)
 *
 * @apiUse Result
 * @apiSuccess {String[]} data 地址数组
 */
// 多文件多字段上传
router.post('/fields', clearSaveData, uploadNoParam.fields([
  { name: 'file', maxCount: 1 },
  { name: 'list', maxCount: 9 },
]), (req, res, next) => {
  try {
    const result = createResult()
    result.data = SaveFileNames.map(name => path.posix.join(global.Config.UPLOAD_PREFIX, SaveDir, name))
    res.send(result)
  } catch (error) {
    next(error)
  }
})

export default router
