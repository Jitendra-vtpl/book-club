import { Router } from 'express'
import { validate } from '../middleware/validate'
import { authenticateToken } from '../middleware/auth'
import { addReview, getReviews, removeReview } from '../controllers/review'
import { addReviewSchema, getReviewsSchema, removeReviewSchema } from '../validations/review'

const router = Router()

router.post('/:book_id', authenticateToken, validate(addReviewSchema), addReview)
router.get('/:book_id', validate(getReviewsSchema), getReviews)
router.delete('/:review_id', authenticateToken, validate(removeReviewSchema), removeReview)

export default router