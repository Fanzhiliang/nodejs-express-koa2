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
1. mkdir: 创建目录
1. writeFile: 创建写入文件、覆盖修改文件
1. appendFile: 插入内容
1. readFile: 读取内容
1. rename: 重命名文件、移动文件
1. unlink: 删除文件
1. rmdir: 删除目录
1. readdir: 读取目录下全部文件