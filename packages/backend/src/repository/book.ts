import type { ProjectionType, HydratedDocument, PopulateOptions } from 'mongoose'
import BookModel from '../models/book'
import type IBook from '../interfaces/models/book'

export type BookDoc = HydratedDocument<IBook>

export const findBook = async (opts?: {
  // where?: Partial<IBook>
  where?: any
  select?: ProjectionType<IBook>
  orderBy?: Record<string, 1 | -1>
  many?: boolean
}): Promise<BookDoc | BookDoc[] | null> => {
  const { where = {}, select, orderBy, many = false } = opts ?? {}
  const q = many ? BookModel.find(where) : BookModel.findOne(where)

  if (select) q.select(select)
  if (many && orderBy) q.sort(orderBy)

  return q.exec() as Promise<BookDoc | BookDoc[] | null>
}

export const paginateBook = async (opts?: {
  where?: Partial<IBook>
  select?: ProjectionType<IBook>
  orderBy?: Record<string, 1 | -1>
  page?: number
  limit?: number
  search?: string
  populate?: PopulateOptions
}): Promise<BookDoc[] | []> => {
  const { where = {}, select, orderBy, page = 1, limit = 10, search, populate } = opts ?? {}
  const q = BookModel.find(where)
  if (select) q.select(select)
  if (orderBy) q.sort(orderBy)
  if (search) q.find({ $text: { $search: search } })
  if (populate) q.populate(populate)
  if (page && limit) q.skip((page - 1) * limit).limit(limit)

  return q.exec() as Promise<BookDoc[] | []>
}

export const countBook = async (opts?: {
  where?: Partial<IBook>
  search?: string
}): Promise<number> => {
  const { where = {}, search } = opts ?? {}
  const q = BookModel.countDocuments(where)
  if (search) q.find({ $text: { $search: search } })
  return q.exec() as Promise<number>
}

export const createBook = async (book: IBook): Promise<BookDoc> => {
  const newBook = await BookModel.create(book)
  return newBook
}

export const updateBook = async (id: string, book: IBook): Promise<BookDoc> => {
  const updatedBook = await BookModel.findByIdAndUpdate(id, book, { new: true })
  if (!updatedBook) throw new Error('Book not found')
  return updatedBook
}

export const deleteBook = async (id: string): Promise<BookDoc> => {
  const deletedBook = await BookModel.findByIdAndUpdate(id, {
    deleted_at: new Date(),
  }, { new: true })
  if (!deletedBook) throw new Error('Book not found')
  return deletedBook
}