import express from 'express'
const router = express.Router()
import path from 'path'
// 上传文件设置
const ResourcesPath = path.resolve(__dirname, '../../resources/upload/') + '/'
import multer from 'multer'
import fs from 'fs'
import { parseTime } from '../../utils'

// 获取文件后缀
const getSuffix = (fileName = '') => {
  return fileName.includes('.') ? fileName.substr(fileName.lastIndexOf('.') + 1) : ''
}

// 创建文件夹
const mkdir = (path = '') => {
  if (!path) return

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

// 先创建上传文件夹
mkdir(ResourcesPath)

let _saveFileName = ''
let _saveDir = ''
const uploadNoParam = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      _saveDir = ResourcesPath + parseTime(Date.now(), '{y}{m}{d}') + '/'
      mkdir(_saveDir)
      cb(null, _saveDir)
    },
    filename: function(req, file, cb) {
      const suffix = getSuffix(file.originalname)
      _saveFileName = Date.now() + '_' + file.fieldname + '.' + suffix
      cb(null, _saveFileName)
    },
  }),
})
// 上传文件不获取参数
router.post('/noParam', uploadNoParam.single('file'), (req, res) => {
  res.send(path.join(_saveDir, _saveFileName))
})

// 多文件多字段上传
router.post('/noParamArray', uploadNoParam.fields([
  { name: 'file', maxCount: 1 },
  { name: 'list', maxCount: 3 },
]), (req, res) => {
  res.send(req.body)
})

const uploadAbleSendParam = multer({
  storage: multer.memoryStorage(),
})
// 上传并且可以获取参数
router.post('/ableSendParam', uploadAbleSendParam.single('file'), (req, res) => {
  const suffix = getSuffix(req.file.originalname)
  const now = Date.now()
  const fileName = now + '_' + (req.body.desc || 'file') + '.' + suffix
  const dir = ResourcesPath + parseTime(now, '{y}{m}{d}') + '/'
  mkdir(dir)

  fs.writeFile(dir + fileName, Buffer.from(req.file.buffer), error => {
    if (error) {
      res.status(500).send(JSON.stringify(error))
    } else {
      res.send(path.join(dir, fileName))
    }
  })
})

export default router