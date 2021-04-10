import { User, UserModel } from './index'

export default (userList: UserModel[]): Promise<Array<UserModel>> => User.insertMany(userList)
