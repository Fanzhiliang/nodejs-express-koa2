const mongoose = require('mongoose')
// const path = require('path')
const { MONGO_URL, MONGO_DB } = require('../config')

mongoose.connect(MONGO_URL, {
  dbName: MONGO_DB,
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log('连接成功')
}).catch(() => {
  console.log('连接失败')
})

const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  hobby: Array,
  gender: Number
})

const User = mongoose.model('User', UserSchema, 'user')

// 增加
// User.insertMany([
//   {
//     name: 'fanzhiliang',
//     age: 24,
//     hobby: ['吃饭', '睡觉', '打豆豆'],
//     gender: 1
//   }
// ])

// User.find({
//   name: 'fanzhiliang'
// }).then(res => {
//   console.log(res)
// })

// User.deleteMany({
//   name: 'fanzhiliang'
// })
