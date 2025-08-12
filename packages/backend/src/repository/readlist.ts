import UserModel from '../models/user'
import { NotFoundError } from '../errors/http'

export const addToReadList = async (opts: {
  book_id: string
  userId: string
}): Promise<string[] | null> => {
  const { book_id, userId } = opts ?? {}
  const user = await UserModel.findById(userId)
  if (!user) throw new NotFoundError('User not found')

  if (!user.readlist?.includes(book_id)) {
    user.readlist?.push(book_id)
  }
  await user.save()
  return user?.readlist ?? []
}

export const findReadList = async (opts: {
  userId: string
}): Promise<string[] | null> => {
  const { userId } = opts
  const user = await UserModel.findById(userId)
  if (!user) throw new NotFoundError('User not found')
  return user.readlist ?? []
}

export const removeFromReadList = async (opts: {
  book_id: string
  userId: string
}): Promise<string[] | null> => {
  const { book_id, userId } = opts
  const user = await UserModel.findById(userId)
  if (!user) throw new NotFoundError('User not found')  
  if (user.readlist?.includes(book_id)) {
    user.readlist = user.readlist?.filter((id: string) => id.toString() !== book_id)
  }
  await user.save()
  return user.readlist ?? []
}