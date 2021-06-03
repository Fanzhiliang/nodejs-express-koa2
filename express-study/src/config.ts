import path from 'path'

process.env.NODE_ENV = process.env.NODE_ENV?.toString().trim()

// 运行端口
export const PORT = process.env.NODE_ENV === 'development' ? 3000 : 3001

// token 名称
export const TOKEN_KEY = 'authorization'

// session 签名
export const SESSION_SECRET = 'fanzhiliang'

// session 对应的 cookie 名
export const SESSION_NAME = 'express_test_session'

// 本地服务器地址
export const HOST = 'localhost'
// 远程服务器地址
// export const HOST = '120.78.128.4'

// 数据库用户名
export const USERNAME = 'admin'

// 数据库密码
export const PASSWORD = '123456'

// 数据库连接地址
export const MONGO_URL = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:27017/`

// 连接的数据库
export const MONGO_DB = 'test'

// jwt token 密钥
export const TOKEN_SECRET = `${(process.env.NODE_ENV as string).toLocaleUpperCase}_TOKEN_SECRET`

// jwt token 过期时间（毫秒）
export const TOKEN_EXP = 1000 * 60 * 60 * 24 * 366
// export const TOKEN_EXP = 1000 * 30

// 上传资源目录
export const UPLOAD_PATH = path.resolve(__dirname, './resources/upload/') + '/'

// 上传资源前缀
export const UPLOAD_PREFIX = process.env.NODE_ENV === 'development' ? `${HOST}:${PORT}/resources/upload/` : `${HOST}:${PORT}/resources/upload/`

// 错误日志目录
export const ERROR_LOG_PATH = path.resolve(__dirname, './log/') + '/'

// 错误日志文件名
export const ERROR_LOG_FILENAME = 'error-log.log'

// 自己导入自己
import * as Config from './config'

global.Config = Config

