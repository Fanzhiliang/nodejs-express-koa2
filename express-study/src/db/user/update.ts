import { User, UserModel } from './index'

export const updateOneUser = function(this: typeof User, user: UserModel, newUser: UserModel) {
  return this.updateOne(user, newUser)
}
