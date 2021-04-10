import { User, UserModel } from './index'

export default (user: UserModel, newUser: UserModel): Promise<any> => (User.updateOne(user, newUser) as any)
