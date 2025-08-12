import { Router } from 'express'
import authRoutes from './auth'
import bookRoutes from './book'
import readlistRoutes from './readlist'
import reviewRoutes from './review'

const router = Router()

router.use('/auth', authRoutes)
router.use('/books', bookRoutes)
router.use('/readlist', readlistRoutes)
router.use('/reviews', reviewRoutes)

export default router