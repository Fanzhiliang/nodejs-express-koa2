import { QueryOptions, Schema } from 'mongoose'

/**
 * @apiDefine ListParams
 *
 * @apiParam {Number} current 第几页
 * @apiParam {Number} size 页面大小
 * @apiParam {String} sort 排序字段
 * @apiParam {String} order 排序顺序 (asc：升序  desc：降序)
 */
// 分页参数
export interface ListParams {
  // 第几页
  current: number
  // 页面大小
  size: number
  /**
   * 排序字段
  */
  sort?: string
  /**
   * 排序顺序
   * asc：升序
   * desc：降序
  */
  order?: string
}

// 默认值
export const DefaultParams: ListParams = {
  // 默认第 1 页
  current: 1,
  // 默认页面大小 10
  size: 10,
  // 默认按 _id 排序
  sort: '_id',
  // 默认升序
  order: 'asc',
}

/**
 * @apiDefine ListResult
 *
 * @apiSuccess {Object} data 响应数据
 * @apiSuccess {Number} data.total 总数
 */

// 分页结果
export interface ListResult<T> {
  list: T[]
  total: number
}

// 获取查询参数
export const createQueryOptions = (_params: ListParams, schema: Schema): QueryOptions => {
  // 获取 schema 下的字段名
  const keys = Object.keys(schema.tree)
  const params = Object.assign({}, DefaultParams, _params)
  const current = params.current || DefaultParams.current as number
  const size = params.size || DefaultParams.size as number
  // 判断是否有该字段
  const sort = params.sort && keys.includes(params.sort) ? params.sort : DefaultParams.sort as string
  const order = params.order || DefaultParams.order as string
  return {
    skip: size * (current - 1),
    limit: size,
    sort: {
      [sort]: order === 'asc' ? 1 : -1,
    },
  }
}

