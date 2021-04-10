## 2021年学习 Nodejs 笔记

### 1 起步

[安装Nodejs](http://nodejs.cn/download/)

### 2 使用

## 2.1 http 模块和 url 模块

1. 新建 app.js

```js
const http = require('http')
const url = require('url')

http.createServer(function (request, response) {
  if (request.url !== '/favicon.ico') {
    // 第一个参数：url
    // 第二个参数：是否解析 query 字符串
    const query = url.parse(request.url, true).query

    console.log(`姓名：${query.name}`)
  }

  /**
   * text/plain ：纯文本格式
   * text/html ： HTML格式
   * application/json： JSON数据格式
   *
   * Content-Type 需要设置成 text/html，下面的html标签才会识别渲染
   * 如果设置成 text/plain，全部输出成纯文本
  */
  response.writeHead(200, { 'Content-Type': 'text/html;charset="UTF-8"' })

  response.write('我是fanzhiliang<br>')

  response.write('你好啊~')

  response.end()
}).listen(3000)

console.log('Server running at http://127.0.0.1:3000/')
```

2. cmd 运行

```
node app.js
```

3. url.parse 可能会被 eslint 提示接口也废弃，可以关闭规则：

```js
'node/no-deprecated-api': 'off'
```

## 2.2 supervisor 监听修改自启动，修改后无需再重启

```
npm install supervisor -g

supervisor app.js
```

## 2.3 fs 模块

1. stat: 检查是文件还是目录
2. mkdir: 创建目录
3. writeFile: 创建写入文件、覆盖修改文件
4. appendFile: 插入内容
5. readFile: 读取内容
6. rename: 重命名文件、移动文件
7. unlink: 删除文件
8. rmdir: 删除目录
9. readdir: 读取目录下全部文件
9. createReadStream: 以流的方式来读取数据
9. createWriteStream: 以流的方式来写入数据
10. readStream.pipe: 以管道流的方式来复制文件

## 2.3 创建一个静态服务器

```js
// server.js
const http = require('http')
const routes = require('./routes')

const port = 3031
const publishPath = './publish'

http.createServer(async function (request, response) {
  routes.static(request, response, publishPath)
}).listen(port)

console.log(`Server running at http://127.0.0.1:${port}/`)
```

```js
// routes.js
const url = require('url')
const fs = require('fs')
const path = require('path')
const { getMime } = require('./utils')

const charset = 'UTF-8'

/**
 * 静态服务器
 * @param {object} request
 * @param {object} response
 * @param {string} publishPath
 * @return {undefined}
 */
exports.static = async (request, response, publishPath) => {
  // 地址
  let pathname = request.url === '/' ? '/index.html' : request.url
  pathname = url.parse(pathname).pathname
  // 拓展名
  const extname = path.extname(pathname)
  // mime
  const mime = await getMime(extname)

  fs.readFile(publishPath + pathname, (err, data) => {
    if (err) {
      response.writeHead(404, { 'Content-Type': `text/html;charset="${charset}"` })
      response.end('找不到该页面')
    } else {
      response.writeHead(200, { 'Content-Type': `${mime};charset="${charset}"` })
      response.end(data)
    }
  })
}
```

```js
// utils/index.js
// 保存 mime-type json 对象
let mimeJson = null
/**
 * 获取 mime-type json 对象
*/
const getMimeJson = () => new Promise((resolve, reject) => {
  if (mimeJson) {
    resolve(mimeJson)
  } else {
    fs.readFile(path.resolve(__dirname, 'mime.json'), (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        mimeJson = JSON.parse(data.toString())
        resolve(mimeJson)
      }
    })
  }
})

/**
 * 根据拓展名获取 mime
 * @param {string} extname
 * @returns {string | null}
 */
exports.getMime = async function getMime (extname) {
  const mimeJson = await getMimeJson()
  return mimeJson[extname] ? mimeJson[extname] : 'text/html'
}
```

## 2.4 mongodb 数据库

1. 安装

[菜鸟教程](https://www.runoob.com/mongodb/mongodb-window-install.html)

[下载](https://www.mongodb.com/try/download/community)

配置环境变量(根据安装目录改变)：E:\MongoDB\Server\4.2\bin

2. 操作数据库

2.1 show dbs: 展示全部数据库

2.2 数据库

```
// 创建或者切换到 test 数据库
use test

// 删除 test 数据库
db.dropDatabase()
```

2.3 集合（相当于数据表）

```
// 创建或者切换到 test 数据库
use test

// 新建一个 user 集合
db.createCollection("user")

// 展示数据库下的全部集合
show collections
```

2.4 文档（相当于数据行）

```
// 创建或者切换到 test 数据库
use test

// 插入文档（集合不存在会自动改创建集合）
db.user.insert({ "name": "fzl" })

// 查询文档
db.user.find()

// 更新文档
// 将 name 为 fzl 的数据，name 改成 fanzhiliang，age 加 50
db.user.update({ "name": "fzl" }, {
  $set: { "name": "fanzhiliang" },
  $inc: { "age": 50 }
}, {
  // 如果需要更新的文档不存在，是否创建新的文档
  upsert: false,
  // 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新
  multi: false
})

// 删除文档
db.user.remove({ "name": "fanzhiliang" }, {
  // 如果设为 true 或 1，则只删除一个文档，如果不设置该参数，或使用默认值 false，则删除所有匹配条件的文档
  justOne: true
})
```

2.5 批量添加文档

```
for (var i = 0; i < 100; i++) {
  db.user.insert({ "name": "用户" + (i + 1), "age": i + 1 })
}
```

2.6 查询文档

```
// 查询全部
db.user.find()

// 总数量
db.user.find().count()

// 查询10条数据
db.user.find().limit(10)

// 查询10条数据，跳过前10条数据（就是每页10条数据，查询第2页）
db.user.find().limit(10).skip(10)

// 要统计限制后的数量 count 需要传 true
db.user.find().limit(10).skip(10).count(true)

// 条件查询
db.user.find({ "name": "用户3" })

// $or
db.user.find({
  $or: [
    { "name": "用户3" },
    { "age": 6 }
  ]
})

// $and
db.user.find({
  $and: [
    { "name": "用户3" },
    { "age": 3 }
  ]
})

// 查询第一条
db.user.findOne({
  $or: [
    { "name": "用户3" },
    { "age": 6 }
  ]
})

/**
* 条件查询
* $gt: 大于
* $lt: 小于
* $gte: 大于等于
* $lte: 小于等于
*/
db.user.find({
  "age": {
    $gte: 80,
    $lte: 85
  }
})

/**
* 排序
* 1: 升序
* -1: 降序
*/
db.user.find().sort({ "age": -1 })

```

2.7 索引

```
// 插入大量数据
for (var i = 0; i < 600000; i++) {
  db.user.insert({ "username": "用户" + (i + 1), "phone":  (13128000000 + i + 1) + "", "status": 1, "hobby": [] })
}

// explain 获取语句执行时间
db.user.find({ "username": "用户777" }).explain("executionStats")
db.user.find({ "phone": 13128000777 }).explain("executionStats")

// 上面两个语句都需要 500ms 左右的执行时间，现在开始设置索引
db.user.createIndex({ "username": 1 })

// 再执行上面 username 的查询语句将会变得很快，而执行 phone 的查询语句还是一样慢

// 删除索引
db.user.dropIndex({ "username": 1 })

// 复合索引：如果 username 和 phone 一起查询会命中索引，只用 username 查询也会命中索引，但只用 phone 查询则不会命中索引
db.user.createIndex({ "username": 1, "phone": 1 })

// 唯一索引
db.user.createIndex({ "username": 1 }, { "unique": true })
```

2.8 数据库管理员

```
// 记得切换数据库再添加用户
use admin
// 添加用户
db.createUser({
  user: "admin",
  pwd: "123456",
  roles: [
    { role: "root", db: "admin" }
  ]
})

// 开启权限
打开 E:\MongoDB\Server\4.2\bin\mongod.cfg
添加修改：
security:
  authorization: enabled

// 重启服务，打开输入账户和密码
mongo admin -u admin -p 123456

// 展示全部用户
show users

// 添加只能操作某个数据库的用户
db.createUser({
  user: "testAdmin",
  pwd: "123456",
  roles: [
    { role: "dbOwner", db: "test" }
  ]
})

// 连接后只能看到 test 数据库
mongo -u testAdmin -p 123456
show dbs

// 删除管理员
db.dropUser("testAdmin")

// 更新管理员
db.updateUser("admin", { pwd: "12345678" })
```

```
数据库用户角色
read: 只读数据权限
readWrite:读写数据权限
数据库管理角色
dbAdmin: 在当前db中执行管理操作的权限
dbOwner: 在当前db中执行任意操作
userADmin: 在当前db中管理user的权限
备份和还原角色
backup
restore
夸库角色
readAnyDatabase: 在所有数据库上都有读取数据的权限
readWriteAnyDatabase: 在所有数据库上都有读写数据的权限
userAdminAnyDatabase: 在所有数据库上都有管理user的权限
dbAdminAnyDatabase: 管理所有数据库的权限
集群管理
clusterAdmin: 管理机器的最高权限
clusterManager: 管理和监控集群的权限
clusterMonitor: 监控集群的权限
hostManager: 管理Server
超级权限
root: 超级用户
```

2.9 聚合

```
// 插入数据
db.order.insert({
  order_id: 8,
  customer_id: 'customer1',
  amount: 666,
  status: 1
})

/**
* $match: 匹配
* $project: 修改输入文档的结构
* $group: 分组
*/
// { $project: { _id: 0, status: 0 } },
db.order.aggregate([
  { $match: { status: 1 } },
  { $group: {
    _id: "$customer_id",
    total: { $sum: "$amount" },
    avg: { $avg: "$amount" },
    min: { $min: "$amount" },
    max: { $max: "$amount" },
    orderIds: { $push: "$order_id" },
    customerIds: { $addToSet: "$customer_id" },
    firstCustomerId: { $first: "$customer_id" },
    lastCustomerId: { $last: "$customer_id" },
  }},
  { $sort: { total: -1 } }
])
```

2.10 数据库导出和备份

```
// 导出
mongodump -h 127.0.0.1 -d test -o E:\MongoDB -u admin -p 123456 --authenticationDatabase admin

// 导入
mongorestore -h 127.0.0.1 -d test E:\MongoDB\test -u admin -p 123456 --authenticationDatabase admin
```

## 2.5 nodejs mongodb 驱动操作数据库

```
// 命令行
npm install mongodb --save
```

```js
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

  // 获取 user 集合
  const user = db.collection('user')

  // 查询全部
  user.find({
    phone: {
      $gt: 13128000006
    }
  }).limit(10).skip(10).toArray((err, docs) => {
    assert.equal(null, err)
    console.log(docs)
    client.close()
  })

  // // 创建 student 集合
  // new Promise((resolve, reject) => {
  //   db.createCollection('student', (err, student) => {
  //     if (err.codeName === 'NamespaceExists') {
  //       // 集合已经存在
  //       resolve(db.collection('student'))
  //     } else if (!err) {
  //       // 创建集合成功
  //       resolve(student)
  //     } else {
  //       // 其它错误
  //       reject(err)
  //     }
  //   })
  // }).then((student) => {
  //   // 插入学生数据
  //   return student.insertOne({
  //     name: 'fanzhiliang',
  //     no: '0115040356',
  //     score: 59,
  //     address: '广东省广州市'
  //   })
  // }).then(() => {
  //   console.log('插入学生数据成功')
  // }).catch(err => {
  //   assert.equal(null, err)
  // }).finally(() => {
  //   client.close()
  // })
})

```

