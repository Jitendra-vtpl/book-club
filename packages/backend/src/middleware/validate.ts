import type { Request, Response, NextFunction } from 'express'
import Joi, { ObjectSchema } from 'joi'
import { UnprocessableEntityError } from '../errors/http'

export type ValidationSchemas = Partial<{
  body: ObjectSchema
  params: ObjectSchema
  query: ObjectSchema
}>

export function validate(schemas: ValidationSchemas) {
  const opts = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true,
    convert: true,
  }

  return (req: Request, _res: Response, next: NextFunction) => {
    try {      
      if (schemas.params) {
        const { value, error } = schemas.params.validate(req.params, opts)
        if (error) throw ValidationError(error)
        req.params = value
      }
      if (schemas.query) {
        const { value, error } = schemas.query.validate(req.query, opts)
        if (error) throw ValidationError(error)
        Object.assign(req.query, value)
      }
      if (schemas.body) {
        const { value, error } = schemas.body.validate(req.body, opts)
        if (error) throw ValidationError(error)
        req.body = value
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}

function ValidationError(error: Joi.ValidationError) {
  const details = error.details.map((d: Joi.ValidationErrorItem) => ({
    message: d.message,
    path: d.path.join('.'),
    // type: d.type,
    // context: d.context,
    key: d.context?.key,
  }))
  return new UnprocessableEntityError('Validation failed', details)
} 