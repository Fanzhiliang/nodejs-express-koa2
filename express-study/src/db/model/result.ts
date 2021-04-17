/**
 * @apiDefine Result
 *
 * @apiSuccess {Number} code 状态码 (200：无错误  1：数据错误  2：没有权限  404：没用相关路由或者页面)
 * @apiSuccess {String} msg 响应信息
 */

export interface Result {
  /**
   * 错误代码
   * 200：无错误
   * 1：数据错误
   * 2：没有权限
   * 404：没用相关路由或者页面
  */
  code: 200 | 1 | 2 | 404
  /**
   * 响应数据
  */
  data: any
  /**
   * 响应信息
  */
  msg: string
}

export default Result

export const createResult = (): Result => ({
  code: 200,
  data: {},
  msg: '',
})
