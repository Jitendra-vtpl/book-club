import { Schema, model } from 'mongoose'
import { softDeletePlugin } from '../config/mongoose-plugins'
import ICategory from '../interfaces/models/category'

const schema = new Schema<ICategory>(
  {
    name: { type: String, maxlength: 200 },
    display_name: { type: String, maxlength: 200 },
    slug: { type: String },
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
schema.index({ slug: 1 })
schema.index({ is_active: 1 })

schema.plugin(softDeletePlugin)

const CategoryModel = model<ICategory>('Category', schema)

export default CategoryModel