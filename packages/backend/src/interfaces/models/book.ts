export default interface IBook {
  _id?: string
  isbn?: string
  title?: string
  summary?: string
  author?: string
  description?: string
  cover_url?: string
  slug?: string
  is_active?: boolean
  language?: string
  published_at?: Date
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
  category_id?: string
}