import { Request, Response, NextFunction } from 'express'
import { findBook } from '../repository/book'
import { ForbiddenError, NotFoundError } from '../errors/http'
import { renderObject } from '../helpers/renderer'
import { createReview, deleteReview, findReview } from '../repository/review'
import IReview from '../interfaces/models/review'
import { socketService } from '../server'

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body
    const { book_id } = req.params
    const book = await findBook({ where: { _id: book_id } })
    if (!book) throw new NotFoundError('Book not found')
    
    const newReview = await createReview({
      book_id: book_id,
      user_id: req?.user?.userId as string,
      rating,
      comment,
    })

    const review = await findReview({
      where: {
        _id: newReview._id,
      },
      select: {
        _id: 1,
        rating: 1,
        comment: 1,
        created_at: 1,
        updated_at: 1,
      },
      populate: {
        path: 'user_id',
        select: { _id: 1, name: 1 },
      },
    })

    // Send socket notification for new comment
    socketService.notifyBookReview(book_id, {
      type: 'NEW_REVIEW',
      data: review,
    })

    return renderObject(res, review, { status: 201 })
  } catch (err: unknown) {
    return next(err)
  }
}

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book_id } = req.params
    const book = await findBook({ where: { _id: book_id } })
    if (!book) throw new NotFoundError('Book not found')
    
    const reviews = await findReview({
      where: {
        book_id: book_id,
      },
      many: true,
      select: {
        _id: 1,
        rating: 1,
        comment: 1,
        created_at: 1,
        updated_at: 1,
      },
      populate: {
        path: 'user_id',
        select: {
          _id: 1,
          name: 1,
        },
      },
      orderBy: {
        created_at: -1,
      },
    })
    return renderObject(res, reviews)
  } catch (err: unknown) {
    return next(err)
  }
}

export const removeReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { review_id } = req.params
    const review = await findReview({ where: { _id: review_id } }) as IReview
    if (!review) throw new NotFoundError('Review not found')
    if (review.user_id?.toString() !== req?.user?.userId) {
      throw new ForbiddenError('You are not allowed to delete this review')
    }

    const deletedReview = await deleteReview(review?._id as string)

    // Send socket notification for deleted review
    socketService.notifyBookReview(review?.book_id as string, {
      type: 'DELETE_REVIEW',
      data: deletedReview,
    })

    return renderObject(res, deletedReview)
  } catch (err: unknown) {
    return next(err)
  }
}
