"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_DB = exports.MONGO_URL = exports.PASSWORD = exports.USERNAME = exports.HOST = exports.SESSION_NAME = exports.SESSION_SECRET = exports.TOKEN_KEY = exports.PORT = void 0;
// 运行端口
exports.PORT = 3001;
// token 名称
exports.TOKEN_KEY = 'express_test_token_key';
// session 签名
exports.SESSION_SECRET = 'fanzhiliang';
// session 对应的 cookie 名
exports.SESSION_NAME = 'express_test_session';
// 服务器地址
exports.HOST = 'localhost';
// 数据库用户名
exports.USERNAME = 'admin';
// 数据库密码
exports.PASSWORD = '123456';
// 数据库连接地址
exports.MONGO_URL = "mongodb://" + exports.USERNAME + ":" + exports.PASSWORD + "@" + exports.HOST + ":27017/";
// 连接的数据库
exports.MONGO_DB = 'test';
