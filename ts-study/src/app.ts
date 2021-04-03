import express from 'express'
import { PORT, HOST } from './config'
import { parseTime } from './utils'

const app = express()

app.get('/test', (req, res) => {
  res.send(parseTime(new Date()) + '当前环境：' + process.env.NODE_ENV)
})

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`)
})
