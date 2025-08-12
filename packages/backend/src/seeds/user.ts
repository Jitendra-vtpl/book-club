import UserModel from '../models/user'
import RoleModel from '../models/role'
import { hashPassword } from '../helpers/password'

export default async function seedUsers() {
  const adminRole = await RoleModel.findOne({ name: 'admin' })

  await UserModel.findOneAndUpdate(
    { email: 'gravity@bookclub.com' },
    {
      $setOnInsert: {
        name: 'Gravity',
        email: 'gravity@bookclub.com',
        password: hashPassword('gravity@123'),
        role_id: adminRole?._id,
        is_active: true,
      },
    },
    { upsert: true, new: true },
  )
} 