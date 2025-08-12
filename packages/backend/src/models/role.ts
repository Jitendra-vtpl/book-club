import { Schema, model } from 'mongoose'
import IRole from '../interfaces/models/role'
import { softDeletePlugin } from '../config/mongoose-plugins'

const schema = new Schema<IRole>(
  {
    name: { type: String },
    display_name: { type: String },
    is_active: { type: Boolean, default: true },
  },  
  { 
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

schema.index({ name: 1 })

schema.plugin(softDeletePlugin)

const RoleModel = model<IRole>('Role', schema)

export default RoleModel