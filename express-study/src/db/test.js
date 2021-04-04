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
  username: String,
  phone: Number,
  hobby: Array,
  status: {
    type: Number,
    default: 1
  }
})

const User = mongoose.model('User', UserSchema, 'user')

// 增
User.insertMany([
  {
    username: 'alcyh',
    phone: 13128269543,
    // status: 2,
    hobby: ['吃饭', '睡觉', '打豆豆']
  }
]).then(res => {
  console.log(res)
}).catch(error => {
  console.log(error)
})

// 删
// User.deleteMany({
//   username: 'fanzhiliang'
// }).then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log(error)
// })

// 改
// User.updateOne({
//   username: 'alcyh'
// }, {
//   phone: 13128269546
// }).then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log(error)
// })

// 查
// User.find({
//   username: 'alcyh'
// }).then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log(error)
// })
