import { User, UserModel } from './index'

export default (userList: UserModel[]) => User.insertMany(userList)
