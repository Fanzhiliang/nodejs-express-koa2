import { User, UserModel } from '../index'

export const deleteManyUser = function(
  this: typeof User,
  user: UserModel,
) {
  return this.deleteMany(user)
}
