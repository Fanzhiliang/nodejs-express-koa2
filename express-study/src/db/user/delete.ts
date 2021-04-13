import { User, UserModel } from './index'

export default (user: UserModel) => User.deleteMany(user)
