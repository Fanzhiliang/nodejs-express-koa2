import { QueryOptions } from 'mongoose'
import { User, UserModel } from './index'
import { ListParams, ListResult, getQueryOptions } from '../model/list-params'

export const find = (
  user: UserModel,
  projection?: any | null,
  options?: QueryOptions | null,
): Promise<UserModel[]> => (
  User.find(user, projection, options) as any
)

export const list = async(
  user: UserModel,
  params: ListParams,
): Promise<ListResult<UserModel>> => {
  return Promise.all([
    User.find(
      {
        $or: [
          // $regex 模糊查询
          { username: { $regex: user.username || '' }},
          { phone: { $regex: user.phone || '' }},
        ],
      },
      // 不显示 _id
      {
        _id: 0,
      },
      getQueryOptions(params),
    ),
    User.count(),
  ]).then(([list, total]) => {
    return Promise.resolve({
      list, total,
    })
  })
}

