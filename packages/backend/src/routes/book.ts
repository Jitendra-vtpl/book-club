import { Router } from 'express'
import {
  addBook, getBook, getBooks, updateBook, deleteBook,
  getBookBySlug,
} from '../controllers/book'
import { validate } from '../middleware/validate'
import {
  addBookSchema, getBookSchema, getBooksSchema,
  updateBookSchema, deleteBookSchema, getBookBySlugSchema,
} from '../validations/book'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.post('/', authenticateToken, validate(addBookSchema), addBook)
router.get('/', validate(getBooksSchema), getBooks)
router.get('/:id', validate(getBookSchema), getBook)
router.get('/slug/:slug', validate(getBookBySlugSchema), getBookBySlug)
router.put('/:id', authenticateToken, validate(updateBookSchema), updateBook)
router.delete('/:id', authenticateToken, validate(deleteBookSchema), deleteBook)

export default router