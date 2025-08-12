import Joi from 'joi'

export const addReviewSchema = {
  body: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  }),
  params: Joi.object({
    book_id: Joi.string().required(),
  }),
}

export const getReviewsSchema = {
  params: Joi.object({
    book_id: Joi.string().required(),
  }),
}

export const removeReviewSchema = {
  params: Joi.object({
    review_id: Joi.string().required(),
  }),
}