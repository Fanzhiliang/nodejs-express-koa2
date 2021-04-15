import fs from 'fs'
import express from 'express'
const router = express.Router()

type Router = typeof router

const autoRequireRoutes = (router: Router, currentPath = '', routePath = '') => {
  if (!router || !currentPath) return

  fs.readdirSync(currentPath).forEach(async directoryName => {
    // 文件路径
    const directoryPath = currentPath + '/' + directoryName
    const dotIndex = directoryName.indexOf('.')
    const _routePath = routePath + '/' + directoryName.substring(0, dotIndex !== -1 ? dotIndex : directoryName.length)

    try {
      // 尝试导入
      const directoryRoute = (await import(directoryPath)).default

      // 不用导入 index.ts，在上层文件夹时已经导入了
      if (directoryName !== 'index.ts') {
        router.use(_routePath, directoryRoute)
      }
    } catch (err) {
      // 打印导入报错信息
      // console.error(err)
    }

    // 如果是一个文件夹，递归函数，尝试导入文件夹下的路由
    if (fs.statSync(directoryPath).isDirectory()) {
      autoRequireRoutes(router, directoryPath, _routePath)
    }
  })
}

autoRequireRoutes(router, __dirname)

export default router
