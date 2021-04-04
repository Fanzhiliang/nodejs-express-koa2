/**
 * 全局变量
*/
import * as config from './src/config'

type Config = typeof config

declare global {
  namespace NodeJS {
    interface Global {
      Config: Config
    }
  }
}

/**
 * express request.session
*/
import '@types/express-serve-static-core'

declare module '@types/express-serve-static-core' {
  interface Request {
    session: { [key:string]: any }
  }
}

/**
 * ejs.__express
*/
import 'ejs'
declare module 'ejs' {
  export const __express: any
}
