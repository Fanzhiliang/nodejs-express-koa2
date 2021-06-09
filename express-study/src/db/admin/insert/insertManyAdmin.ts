import { Admin, AdminModel } from '../index'

export const insertManyAdmin = function(
  this: typeof Admin,
  adminList: AdminModel[],
) {
  return this.insertMany(adminList)
}
