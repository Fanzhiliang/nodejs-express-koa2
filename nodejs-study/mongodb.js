const MongoClient = require('mongodb').MongoClient
const assert = require('assert').strict

// 账号
const username = 'admin'

// 密码
const password = '123456'

// 连接地址
const url = `mongodb://${username}:${password}@127.0.0.1:27017`

// 连接的数据库名
const dbName = 'test'

MongoClient.connect(url, {
  useUnifiedTopology: true
}, (err, client) => {
  assert.equal(null, err)

  const db = client.db(dbName)

  // // 获取 user 集合
  // const user = db.collection('user')

  // // 查询全部
  // user.find({
  //   phone: {
  //     $gt: 13128000006
  //   }
  // }).limit(10).skip(10).toArray((err, docs) => {
  //   assert.equal(null, err)
  //   console.log(docs)
  //   client.close()
  // })

  // 创建 student 集合
  new Promise((resolve, reject) => {
    db.createCollection('student', (err, student) => {
      if (err.codeName === 'NamespaceExists') {
        // 集合已经存在
        resolve(db.collection('student'))
      } else if (!err) {
        // 创建集合成功
        resolve(student)
      } else {
        // 其它错误
        reject(err)
      }
    })
  }).then((student) => {
    // 插入学生数据
    return student.insertOne({
      name: 'fanzhiliang',
      no: '0115040356',
      score: 59,
      address: '广东省广州市'
    })
  }).then(() => {
    console.log('插入学生数据成功')
  }).catch(err => {
    assert.equal(null, err)
  }).finally(() => {
    client.close()
  })
})
