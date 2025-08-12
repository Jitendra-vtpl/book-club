import RoleModel from '../models/role'

export default async function seedRoles() {
  const roles = [
    { name: 'admin', display_name: 'Admin' },
    { name: 'member', display_name: 'Member' },
  ]

  await Promise.all(
    roles.map(role =>
      RoleModel.findOneAndUpdate(
        { name: role.name },
        { $setOnInsert: role },
        { upsert: true, new: true },
      ),
    ),
  )
} 