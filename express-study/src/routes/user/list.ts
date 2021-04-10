import express from 'express'
const router = express.Router()
import tokenFilters from '../../filters/token'
import { list } from '../../db/user/find'
import { createResult } from '../../db/model/result'
const result = createResult()

router.use(tokenFilters)

/**
 * @api {get} /user/list 获取用户列表
 * @apiName list
 * @apiGroup user
 *
 * @apiHeader {String} authorization token
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} phone 电话
 * @apiParam {number} current 当前页
 * @apiParam {number} size 当前页数量
 * @apiParam {String} sort 排序字段; 默认 _id
 * @apiParam {String} order 排序顺序; asc：升序、desc：降序; 默认 asc
 *
 * @apiSuccess {Number} code 错误代码
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {String} msg 响应信息
*/
router.get('/', (req, res) => {
  const query = req.query
  list({
    username: query.username as string,
    phone: query.phone as string,
  }, {
    current: Number(query.current),
    size: Number(query.size),
    sort: query.sort as string,
    order: query.order as string,
  }).then(data => {
    // 查询成功
    result.code = 0
    result.data = data
  }).catch(err => {
    // 报错
    result.code = 1
    result.msg = err
  }).finally(() => {
    // 响应
    res.send(result)
  })
})

export default router
