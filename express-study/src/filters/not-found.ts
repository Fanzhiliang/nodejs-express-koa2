import express from 'express'
const router = express.Router()
import { createResult } from '../db/model/result'

router.use((req, res) => {
  const result = createResult()
  result.code = 404
  result.msg = '404 not found'
  res.send(result)
})

export default router