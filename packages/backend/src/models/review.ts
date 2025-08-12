import { Schema, model } from 'mongoose'
import { softDeletePlugin } from '../config/mongoose-plugins'
import type IReview from '../interfaces/models/review'
import BookModel from './book'
import UserModel from './user'

const schema = new Schema(
  {
    book_id: { type: Schema.Types.ObjectId, ref: BookModel.modelName },
    user_id: { type: Schema.Types.ObjectId, ref: UserModel.modelName },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
  },
  { 
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

schema.index({ book_id: 1 })
schema.index({ user_id: 1 })
schema.index({ rating: 1 })

schema.plugin(softDeletePlugin)

const ReviewModel = model<IReview>('Review', schema)

export default ReviewModel