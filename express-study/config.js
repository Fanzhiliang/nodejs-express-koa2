// 运行端口
const PORT = 3000

// token 名称
const TOKEN_KEY = 'express_test_token_key'

// session 签名
const SESSION_SECRET = 'fanzhiliang'

// session 对应的 cookie 名
const SESSION_NAME = 'express_test_session'

// 服务器地址
const HOST = 'localhost'

// 数据库用户名
const USERNAME = 'admin'

// 数据库密码
const PASSWORD = '123456'

// 数据库连接地址
const MONGO_URL = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:27017/`

// 连接的数据库
const MONGO_DB = 'test'

module.exports = {
  PORT,
  TOKEN_KEY,
  SESSION_SECRET,
  SESSION_NAME,
  HOST,
  USERNAME,
  PASSWORD,
  MONGO_URL,
  MONGO_DB
}
