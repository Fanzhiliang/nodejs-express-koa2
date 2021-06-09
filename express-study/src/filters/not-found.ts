import express from 'express'
const router = express.Router()
import { Code, createResult } from '../db/common-model/result'

router.use((req, res) => {
  const result = createResult()
  result.code = Code.NotFound
  result.msg = '404 not found'
  res.send(result)
})

export default router
