import { QueryOptions } from 'mongoose'

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

// 分页结果
export interface ListResult<T> {
  list: T[]
  total: number
}

// 获取查询参数
export const getQueryOptions = (_params: ListParams): QueryOptions => {
  const params = Object.assign({}, DefaultParams, _params)
  const current = params.current || DefaultParams.current as number
  const size = params.size || DefaultParams.size as number
  const sort = params.sort || DefaultParams.sort as string
  const order = params.order || DefaultParams.order as string
  return {
    skip: size * (current - 1),
    limit: size,
    sort: {
      [sort]: order === 'asc' ? 1 : -1,
    },
  }
}

