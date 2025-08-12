export default interface IReview {
  _id?: string
  book_id?: string
  user_id?: string
  rating?: number
  comment?: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}