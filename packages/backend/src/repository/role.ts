import type { ProjectionType, HydratedDocument } from 'mongoose'
import RoleModel from '../models/role'
import IRole from '../interfaces/models/role'

export type RoleDoc = HydratedDocument<IRole>

export const findAdminRole = async (): Promise<RoleDoc | null> => {
  const adminRole = await RoleModel.findOne({ name: 'admin' })
  if (!adminRole) throw new Error('Admin role not found')
  return adminRole
}

export const findRole = async (opts?: {
  where?: Partial<IRole>
  select?: ProjectionType<IRole>
  orderBy?: Record<string, 1 | -1>
  many?: boolean
}): Promise<RoleDoc | RoleDoc[] | null> => {
  const { where = {}, select, orderBy, many = false } = opts ?? {}
  const q = many ? RoleModel.find(where) : RoleModel.findOne(where)

  if (select) q.select(select)
  if (many && orderBy) q.sort(orderBy)

  return q.exec() as Promise<RoleDoc | RoleDoc[] | null>
}

export const createRole = async (role: IRole): Promise<RoleDoc> => {
  const newRole = await RoleModel.create(role)
  return newRole
}

export const updateRole = async (id: string, role: IRole): Promise<RoleDoc> => {
  const updatedRole = await RoleModel.findByIdAndUpdate(id, role, { new: true })
  if (!updatedRole) throw new Error('Role not found')
  return updatedRole
}

export const deleteRole = async (id: string): Promise<RoleDoc> => {
  const deletedRole = await RoleModel.findByIdAndUpdate(id, {
    deleted_at: new Date(),
  }, { new: true })
  if (!deletedRole) throw new Error('Role not found')
  return deletedRole
}