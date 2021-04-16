import { User, UserModel } from '../index'

/**
 * 用户名和密码获取用户信息
*/
export const getUserByUsernameAndPassword = function(
  this: typeof User,
  user: UserModel,
) {
  return this.findOne(
    {
      username: user.username,
      password: user.password,
    },
  ).lean()
}

