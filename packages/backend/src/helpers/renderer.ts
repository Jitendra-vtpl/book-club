import { Response } from 'express'

const isPaginated = (object: any) =>
  object?.pageInfo &&
  object?.totalCount !== undefined &&
  Array.isArray(object?.records)

const isArray = (object: any) =>
  Array.isArray(object) || Array.isArray(object?.records)

const totalCount = (object: any) =>
  isPaginated(object) ? object.totalCount : isArray(object) ? object.length : 1

export const renderObject = (res: Response, object: any, options: {
  status?: number, message?: string
} = {}) => {
  const data = isPaginated(object) ? object.records : object

  const type = isPaginated(object)
    ? object.records[0]?.constructor?.name || 'Object'
    : Array.isArray(object)
      ? object?.[0]?.constructor?.name || 'Object'
      : object.constructor.name

  const computedPayload = {    
    ...(options?.message && { message: options.message }),
    data,
    ...(isPaginated(object) && {
      meta: {
        type,
        count: totalCount(object),
        isArray: isArray(object),
        currentPage: isPaginated(object) ? object.pageInfo.currentPage : null,
        totalPages: isPaginated(object) ? object.pageInfo.totalPages : null,
      },
    }),
  }

  const status = options?.status || 200

  return res.status(status).json(computedPayload)
}
