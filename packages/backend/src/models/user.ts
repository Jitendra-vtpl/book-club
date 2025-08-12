import { Schema, model } from 'mongoose'
import { softDeletePlugin } from '../config/mongoose-plugins'
import IUser from '../interfaces/models/user'
import RoleModel from './role'
import BookModel from './book'

const schema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role_id: { type: Schema.Types.ObjectId, ref: RoleModel.modelName },
    is_active: { type: Boolean, default: true },
    login_at: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
    readlist: { type: [Schema.Types.ObjectId], ref: BookModel.modelName },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

schema.index({ email: 1 })
schema.index({ is_active: 1 })
schema.index({ role_id: 1 })

schema.plugin(softDeletePlugin)

const UserModel = model<IUser>('User', schema)

export default UserModel