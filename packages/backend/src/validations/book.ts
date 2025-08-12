import Joi from 'joi'

export const getBookSchema = {
  params: Joi.object({
    id: Joi.string().required().min(3).max(255).trim(),
  }),
}

export const getBookBySlugSchema = {
  params: Joi.object({
    slug: Joi.string().required().min(3).max(255).trim(),
  }),
}

export const getBooksSchema = {
  query: Joi.object({
    page: Joi.number().min(1).max(100).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    search: Joi.string().optional().trim().allow(''),
  }),
}

export const deleteBookSchema = {
  params: Joi.object({
    id: Joi.string().required().min(3).max(255).trim(),
  }),
}

export const addBookSchema = {
  body: Joi.object({
    title: Joi.string().required().min(3).max(255).trim(),
    author: Joi.string().required().min(3).max(255).trim(),
    summary: Joi.string().optional().min(3).max(255).trim(),
    description: Joi.string().required().min(3).max(255).trim(),
    cover_url: Joi.string().optional().min(3).max(255).trim(),
    category_id: Joi.string().required().min(3).max(255).trim(),
    language: Joi.string().required().min(3).max(255).trim().valid('English', 'Hindi'),
    published_at: Joi.date().optional(),
  }),
}

export const updateBookSchema = {
  params: Joi.object({
    id: Joi.string().required().min(3).max(255).trim(),
  }),
  body: Joi.object({
    title: Joi.string().required().min(3).max(255).trim(),
    author: Joi.string().required().min(3).max(255).trim(),
    description: Joi.string().required().min(3).max(255).trim(),
    cover_url: Joi.string().optional().min(3).max(255).trim(),
    category_id: Joi.string().required().min(3).max(255).trim(),
    language: Joi.string().required().min(3).max(255).trim().valid('English', 'Hindi'),
  }),
}