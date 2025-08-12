import type { ProjectionType, HydratedDocument } from 'mongoose'
import UserModel from '../models/user'
import type IUser from '../interfaces/models/user'

export type UserDoc = HydratedDocument<IUser>

export const findUser = async (opts?: {
  where?: Partial<IUser>
  select?: ProjectionType<IUser>
  orderBy?: Record<string, 1 | -1>
  many?: boolean
}): Promise<UserDoc | UserDoc[] | null> => {
  const { where = {}, select, orderBy, many = false } = opts ?? {}
  const q = many ? UserModel.find(where) : UserModel.findOne(where)

  if (select) q.select(select)
  if (many && orderBy) q.sort(orderBy)

  return q.exec() as Promise<UserDoc | UserDoc[] | null>
}

export const createUser = async (user: IUser): Promise<UserDoc> => {
  const newUser = await UserModel.create(user)
  return newUser
}

export const updateUser = async (id: string, user: IUser): Promise<UserDoc> => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true })
  if (!updatedUser) throw new Error('User not found')
  return updatedUser
}

export const deleteUser = async (id: string): Promise<UserDoc> => {
  const deletedUser = await UserModel.findByIdAndUpdate(id, {
    deleted_at: new Date(),
  }, { new: true })
  if (!deletedUser) throw new Error('User not found')
  return deletedUser
}