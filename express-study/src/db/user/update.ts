import { User, UserModel } from './index'

export default (user: UserModel, newUser: UserModel) => User.updateOne(user, newUser)
