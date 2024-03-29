import mongoose from 'mongoose'
import { MONGO_URL, MONGO_DB } from '../config'

mongoose.connect(MONGO_URL, {
  dbName: MONGO_DB,
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

mongoose.connection.on('connected', () => {
  console.log('数据库连接成功')
})

mongoose.connection.on('disconnected', () => {
  console.log('数据库断开')
})

mongoose.connection.on('error', error => {
  console.log('数据库连接异常：')
  console.log(error)
})

export default mongoose
