const fs = require('fs')
const express = require('express')
const router = express.Router()

const autoRequireRoutes = (router, currentPath = '', routePath = '') => {
  if (!router || !currentPath) return

  fs.readdirSync(currentPath).forEach(directoryName => {
    // 文件路径
    const directoryPath = currentPath + '/' + directoryName
    const dotIndex = directoryName.indexOf('.')
    const _routePath = routePath + '/' + directoryName.substring(0, dotIndex !== -1 ? dotIndex : directoryName.length)

    try {
      // 尝试导入
      const directoryRoute = require(directoryPath)

      // 不用导入 index.js，在上层文件夹时已经导入了
      if (directoryName !== 'index.js') {
        router.use(_routePath, directoryRoute)
      }
    } catch (error) {
      // 打印导入报错信息
      // console.error(error)
    }

    // 如果是一个文件夹，递归函数，尝试导入文件夹下的路由
    if (fs.statSync(directoryPath).isDirectory()) {
      autoRequireRoutes(router, directoryPath, _routePath)
    }
  })
}

autoRequireRoutes(router, __dirname)

module.exports = router
