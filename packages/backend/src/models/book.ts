import { Schema, model } from 'mongoose'
import { softDeletePlugin } from '../config/mongoose-plugins'
import IBook from '../interfaces/models/book'
import CategoryModel from './category'

const schema = new Schema(
  {
    isbn: { type: String, maxlength: 13, unique: true },
    title: { type: String, maxlength: 200 },
    summary: { type: String, maxlength: 500 },
    author: { type: String },
    description: { type: String },
    cover_url: { type: String, maxlength: 200 },
    category_id: { type: Schema.Types.ObjectId, ref: CategoryModel.modelName },
    slug: { type: String },
    is_active: { type: Boolean, default: true },
    language: { type: String, enum: ['English', 'Hindi'] },
    published_at: { type: Date },
  },
  { 
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

schema.index({ title: 1 })
schema.index({ slug: 1 })
schema.index({ is_active: 1 })
schema.index({ title: 'text', author: 'text' })

schema.plugin(softDeletePlugin)

const BookModel = model<IBook>('Book', schema)

export default BookModel