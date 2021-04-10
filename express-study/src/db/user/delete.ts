import { User, UserModel } from './index'

export default (user: UserModel): Promise<any> => (User.deleteMany(user) as any)
