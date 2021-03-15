const fs = require('fs')

// 检查是文件还是目录

const stat = () => new Promise((resolve, reject) => {
  fs.stat('./publish/index.html', (err, data) => {
    if (err) {
      switch (err.code) {
        case 'ENOENT':
          console.log('目标文件或者目录不存在')
          break
      }
      reject(err)
      return
    }

    console.log('是文件' + data.isFile())
    console.log('是目录' + data.isDirectory())

    resolve(data)
  })
})

// 创建目录
const mkdir = () => new Promise((resolve, reject) => {
  fs.mkdir('./publish/static', (err) => {
    if (err) {
      switch (err.code) {
        case 'EEXIST':
          console.log('目录已存在')
          resolve(false)
          break
      }
      reject(err)
      return
    }

    console.log('创建目录成功')

    resolve(true)
  })
})

// 创建写入文件、覆盖修改文件
const writeFile = () => new Promise((resolve, reject) => {
  fs.writeFile(
    './publish/static/main.css',
    'html, body {font-size: 14px;}\n',
    {
      encoding: 'utf-8'
    },
    (err) => {
      if (err) {
        switch (err.code) {
          case 'ENOENT':
            console.log('创建写入目录不存在')
            break
        }
        reject(err)
        return
      }
      console.log('创建写入成功')

      resolve()
    }
  )
})

// 插入内容
const appendFile = () => new Promise((resolve, reject) => {
  fs.appendFile(
    './publish/static/main.css',
    'html, body {margin: 0;padding: 0;}\n',
    {
      encoding: 'utf-8'
    },
    (err) => {
      if (err) {
        switch (err.code) {
          case 'ENOENT':
            console.log('插入内容的文件不存在')
            break
        }
        reject(err)
        return
      }
      console.log('插入内容成功')

      resolve()
    }
  )
})

// 读取内容
const readFile = () => new Promise((resolve, reject) => {
  fs.readFile(
    './publish/static/main.css',
    {
      encoding: 'utf-8'
    },
    (err, data) => {
      if (err) {
        switch (err.code) {
          case 'ENOENT':
            console.log('读取的文件不存在')
            break
        }
        reject(err)
        return
      }

      console.log('读取内容成功：')
      console.log(data.toString())

      resolve(data)
    }
  )
})

// 重命名文件、移动文件
const rename = () => new Promise((resolve, reject) => {
  fs.rename('./publish/about.html', './publish/home.html', (err) => {
    if (err) {
      switch (err.code) {
        case 'ENOENT':
          console.log('重命名的文件不存在')
          break
      }
      reject(err)
      return
    }

    console.log('重命名文件成功')

    resolve()
  })
})

// 删除文件
const unlink = () => new Promise((resolve, reject) => {
  fs.unlink('./publish/static/main.css', (err) => {
    if (err) {
      switch (err.code) {
        case 'ENOENT':
          console.log('删除的文件不存在')
          break
      }
      reject(err)
      return
    }

    console.log('删除文件成功')

    resolve()
  })
})

// 删除目录
const rmdir = (path = '') => new Promise((resolve, reject) => {
  fs.stat(path, (err, data) => {
    if (err) return reject(err)

    if (data.isFile()) {
      resolve(fs.unlinkSync(path))
    } else if (data.isDirectory()) {
      new Promise((resolve) => {
        fs.readdir(path, (err, data) => {
          if (err) return reject(err)

          if (data.length) {
            // 删除目录下的全部文件
            const promiseArray = []

            data.forEach(fileName => {
              const filePath = path + '/' + fileName
              promiseArray.push(rmdir(filePath))
            })

            Promise.all(promiseArray).then(resolve).catch(reject)
          } else {
            resolve()
          }
        })
      }).then(() => {
        fs.rmdirSync(path)
        resolve()
      })
    }
  })
})

// stat()

// mkdir().then((res) => {
//   if (res) {
//     return writeFile()
//   } else {
//     return appendFile()
//   }
// })

// rename()

// unlink()

// rmdir('./publish/static')

// 以流的方式来读取数据
const handleReadStream = () => {
  const readStream = fs.createReadStream('./publish/input-big-data.txt', {
    encoding: 'utf-8'
  })

  let count = 0
  let readData = ''

  readStream.on('data', (data) => {
    readData += data
    count++
  })

  readStream.on('end', () => {
    console.log(readData)
    console.log(`读取了${count}次`)
  })

  readStream.on('error', (err) => {
    console.log(err)
  })
}

// handleReadStream()

// 以流的方式来写入数据
const handleWriteStream = () => {
  let data = ''
  for (let i = 0; i < 500; i++) {
    data += `${i + 1}我是写入的大量数据~\n`
  }

  const writeStream = fs.createWriteStream('./publish/output-big-data.txt', {
    encoding: 'utf-8'
  })

  writeStream.write(data, (err) => {
    if (err) {
      console.log(err)
      return
    }
    writeStream.end()
  })

  writeStream.on('finish', () => {
    console.log('写入完成')
  })
}

// handleWriteStream()

// 以管道流的方式来复制文件
const pipe = () => {
  const readStream = fs.createReadStream('./publish/img.jpg')

  const writeStream = fs.createWriteStream('./publish//data/img.jpg')

  readStream.pipe(writeStream)

  readStream.on('end', () => {
    console.log('复制完成')
  })
}

// pipe()
