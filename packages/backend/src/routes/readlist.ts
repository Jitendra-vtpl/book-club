import { Router } from 'express'
import { addToReadList, removeFromReadList, getReadList, getReadListBooks } from '../controllers/readlist'
import { validate } from '../middleware/validate'
import { addToReadListSchema, removeFromReadListSchema } from '../validations/readlist'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.post('/:book_id', authenticateToken, validate(addToReadListSchema), addToReadList)
router.delete('/:book_id', authenticateToken, validate(removeFromReadListSchema), removeFromReadList)
router.get('/', authenticateToken, getReadList)
router.get('/books', authenticateToken, getReadListBooks)

export default router