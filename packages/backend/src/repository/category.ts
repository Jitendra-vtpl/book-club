import type { ProjectionType, HydratedDocument } from 'mongoose'
import CategoryModel from '../models/category'
import type ICategory from '../interfaces/models/category'

export type CategoryDoc = HydratedDocument<ICategory>

export const findCategory = async (opts?: {
  where?: Partial<ICategory>
  select?: ProjectionType<ICategory>
  orderBy?: Record<string, 1 | -1>
  many?: boolean
}): Promise<CategoryDoc | CategoryDoc[] | null> => {
  const { where = {}, select, orderBy, many = false } = opts ?? {}
  const q = many ? CategoryModel.find(where) : CategoryModel.findOne(where)

  if (select) q.select(select)
  if (many && orderBy) q.sort(orderBy)

  return q.exec() as Promise<CategoryDoc | CategoryDoc[] | null>
}

export const createCategory = async (category: ICategory): Promise<CategoryDoc> => {
  const newCategory = await CategoryModel.create(category)
  return newCategory
}

export const updateCategory = async (id: string, category: ICategory): Promise<CategoryDoc> => {
  const updatedCategory = await CategoryModel.findByIdAndUpdate(id, category, { new: true })
  if (!updatedCategory) throw new Error('Category not found')
  return updatedCategory
}

export const deleteCategory = async (id: string): Promise<CategoryDoc> => {
  const deletedCategory = await CategoryModel.findByIdAndUpdate(id, {
    deleted_at: new Date(),
  }, { new: true })
  if (!deletedCategory) throw new Error('Category not found')
  return deletedCategory
}