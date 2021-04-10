interface Result {
  /**
   * 错误代码
   * 0：无错误
   * 1：数据错误
   * 2：没有权限
  */
  code: 0 | 1 | 2
  /**
   * 响应数据
  */
  data: any
  /**
   * 错误信息
  */
  msg: string
}

export default Result
