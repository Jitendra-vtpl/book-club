export class HttpError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.code = code ?? this.constructor.name
    this.details = details
    Error.captureStackTrace?.(this, this.constructor)
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, message, 'BAD_REQUEST', details)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(401, message, 'UNAUTHORIZED', details)
  }
}

export class InvalidTokenError extends HttpError {
  constructor(message = 'Invalid Token', details?: unknown) {
    super(401, message, 'INVALID_TOKEN', details)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', details?: unknown) {
    super(403, message, 'FORBIDDEN', details)
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found', details?: unknown) {
    super(404, message, 'NOT_FOUND', details)
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', details?: unknown) {
    super(409, message, 'CONFLICT', details)
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = 'Unprocessable Entity', details?: unknown) {
    super(422, message, 'UNPROCESSABLE_ENTITY', details)
  }
}
