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
