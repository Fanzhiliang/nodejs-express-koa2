import { QueryOptions } from 'mongoose'
import { User, UserModel } from './index'
import { ListParams, ListResult, createQueryOptions } from '../model/list'

// 查找
export const find = (
  user: UserModel,
  projection?: any | null,
  options?: QueryOptions | null,
) => User.find(user, projection, options)

// 列表
export const list = async(
  user: UserModel,
  params: ListParams,
): Promise<ListResult<UserModel>> => {
  return Promise.all([
    User.find(
      {
        // $regex 模糊查询
        username: { $regex: user.username || '' },
        phone: { $regex: user.phone || '' },
      },
      // 不显示 _id 和 密码
      {
        _id: 0,
        password: 0,
      },
      createQueryOptions(params, User.schema),
    ),
    User.count(),
  ]).then(([list, total]) => {
    return Promise.resolve({
      list, total,
    })
  })
}

// 根据用户名和密码查询用户信息
export const getUserByUsernameAndPassword = (user: UserModel) => User.findOne(
  {
    username: user.username,
    phone: user.password,
  },
).lean()

