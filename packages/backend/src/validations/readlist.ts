import Joi from 'joi'

export const addToReadListSchema = {
  params: Joi.object({
    book_id: Joi.string().required(),
  }),
}

export const removeFromReadListSchema = {
  params: Joi.object({
    book_id: Joi.string().required(),
  }),
}