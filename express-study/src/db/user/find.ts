import { User, UserModel } from './index'
import { ListParams, ListResult, createQueryOptions } from '../model/list'

// 列表
export const getUserList = async function(
  this: typeof User,
  user: UserModel,
  params: ListParams,
): Promise<ListResult<UserModel>> {
  return Promise.all([
    this.find(
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
    this.count(),
  ]).then(([list, total]) => {
    return Promise.resolve({
      list, total,
    })
  })
}

// 根据用户名和密码查询用户信息
export const getUserByUsernameAndPassword = function(this: typeof User, user: UserModel) {
  return this.findOne(
    {
      username: user.username,
      phone: user.password,
    },
  ).lean()
}

