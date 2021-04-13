import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import { createResult } from '../../db/model/result'
import { User, UserModel } from '../../db/user'

router.get('/updateUser', tokenFilters, (req, res) => {
  const result = createResult()

  const query = req.query
  const user = query.user as UserModel

  console.log(user)

  User

  res.send(result)
})

export default router
