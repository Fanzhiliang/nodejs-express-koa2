import { Express, Request, Response, NextFunction } from 'express'
import { writeAppendFile, parseTime } from '../utils'

const log = (app: Express) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // 当前时间
    const now = Date.now()
    // 错误信息
    const errLog = `
${now}
---------------------------------------------------------------
  错误时间: ${parseTime(now)}\n
  错误名称: ${err.name}\n
  错误信息: ${err.message}\n
  错误堆栈: ${err.stack}
----------------------------------------------------------------
`
    // 写入文件
    writeAppendFile(global.Config.ERROR_LOG_PATH, global.Config.ERROR_LOG_FILENAME, errLog)
  })
}

export default log
