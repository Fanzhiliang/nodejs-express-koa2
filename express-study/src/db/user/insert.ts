import { User, UserModel } from './index'

export const insertManyUser = function(this: typeof User, userList: UserModel[]) {
  return this.insertMany(userList)
}
