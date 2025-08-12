import type { ProjectionType, HydratedDocument, PopulateOptions } from 'mongoose'
import ReviewModel from '../models/review'
import type IReview from '../interfaces/models/review'

export type ReviewDoc = HydratedDocument<IReview>

export const findReview = async (opts?: {
  // where?: Partial<IReview>
  where?: any
  select?: ProjectionType<IReview>
  orderBy?: Record<string, 1 | -1>
  many?: boolean
  populate?: PopulateOptions
}): Promise<ReviewDoc | ReviewDoc[] | null> => {
  const { where = {}, select, orderBy, many = false, populate } = opts ?? {}
  const q = many ? ReviewModel.find(where) : ReviewModel.findOne(where)

  if (select) q.select(select)
  if (many && orderBy) q.sort(orderBy)
  if (populate) q.populate(populate)
  
  return q.exec() as Promise<ReviewDoc | ReviewDoc[] | null>
}

export const paginateReview = async (opts?: {
  where?: Partial<IReview>
  select?: ProjectionType<IReview>
  orderBy?: Record<string, 1 | -1>
  page?: number
  limit?: number
  search?: string
  populate?: PopulateOptions
}): Promise<ReviewDoc[] | []> => {
  const { where = {}, select, orderBy, page = 1, limit = 10, search, populate } = opts ?? {}
  const q = ReviewModel.find(where)
  if (select) q.select(select)
  if (orderBy) q.sort(orderBy)
  if (search) q.find({ $text: { $search: search } })
  if (populate) q.populate(populate)
  if (page && limit) q.skip((page - 1) * limit).limit(limit)

  return q.exec() as Promise<ReviewDoc[] | []>
}

export const countReview = async (opts?: {
  where?: Partial<IReview>
  search?: string
}): Promise<number> => {
  const { where = {}, search } = opts ?? {}
  const q = ReviewModel.countDocuments(where)
  if (search) q.find({ $text: { $search: search } })
  return q.exec() as Promise<number>
}

export const createReview = async (review: IReview): Promise<ReviewDoc> => {
  const newReview = await ReviewModel.create(review)
  return newReview
}

export const updateReview = async (id: string, review: IReview): Promise<ReviewDoc> => {
  const updatedReview = await ReviewModel.findByIdAndUpdate(id, review, { new: true })
  if (!updatedReview) throw new Error('Review not found')
  return updatedReview
}

export const deleteReview = async (id: string): Promise<ReviewDoc> => {
  const deletedReview = await ReviewModel.findByIdAndUpdate(id, {
    deleted_at: new Date(),
  }, { new: true })
  if (!deletedReview) throw new Error('Review not found')
  return deletedReview
}