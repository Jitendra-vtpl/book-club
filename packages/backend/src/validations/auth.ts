import Joi from 'joi'

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().required().min(3).max(255).trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().min(5).max(255).trim(),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .messages({
        'any.only': 'Confirm password must match password',
      }),
  }),
}

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().min(5).max(255).trim(),
  }),
}