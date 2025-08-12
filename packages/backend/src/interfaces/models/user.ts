import type { Types } from 'mongoose'

export default interface IUser{
  // _id?: Types.ObjectId
  _id?: string
  name?: string
  email?: string
  password?: string
  role_id?: Types.ObjectId | string
  is_active?: boolean
  login_at?: Date
  tokenVersion?: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
  readlist?: string[]
}