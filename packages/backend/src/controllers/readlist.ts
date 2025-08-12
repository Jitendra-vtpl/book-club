import { Request, Response, NextFunction } from 'express'
import { findBook } from '../repository/book'
import { NotFoundError } from '../errors/http'
import {
  addToReadList as addToReadListRepo,
  removeFromReadList as removeFromReadListRepo,
  findReadList as findReadListRepo,
} from '../repository/readlist'
import { renderObject } from '../helpers/renderer'
import IBook from '../interfaces/models/book'

export const addToReadList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book_id } = req.params
    const book = await findBook({ where: { _id: book_id } })
    if (!book) throw new NotFoundError('Book not found')

    const readlist = await addToReadListRepo({
      book_id,
      userId: req?.user?.userId as string,
    })
    return renderObject(res, readlist, { status: 201 })
  } catch (err: unknown) {
    return next(err)
  }
}

export const getReadList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readlist = await findReadListRepo({ userId: req?.user?.userId as string })
    return renderObject(res, readlist)
  } catch (err: unknown) {
    return next(err)
  }
}

export const removeFromReadList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book_id } = req.params
    const book = await findBook({ where: { _id: book_id } }) as IBook
    if (!book) throw new NotFoundError('Book not found')

    const readlist = await removeFromReadListRepo({
      book_id: book_id,
      userId: req?.user?.userId as string,
    })
    return renderObject(res, readlist)
  } catch (err: unknown) {
    return next(err)
  }
}

export const getReadListBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const readlist = await findReadListRepo({ userId: req?.user?.userId as string })
    const books = await findBook({
      where: { _id: { $in: readlist } },
      select: {
        _id: 1,
        title: 1,
        cover_url: 1,
      },
      many: true,
    })
    return renderObject(res, books)
  } catch (err: unknown) {
    return next(err)
  }
}