import type { Request, Response, NextFunction } from 'express'
import { HttpError } from '../errors/http'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found' })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ code: err.code, message: err.message, details: err.details })
  }
  const e = err as Error
  return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: e?.message ?? 'Internal Server Error' })
}