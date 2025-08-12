import { Request, Response, NextFunction } from 'express'
import {
  findBook, updateBook as updateBookToDB, deleteBook as deleteBookToDB,
  paginateBook,
  countBook,
} from '../repository/book'
import { renderObject } from '../helpers/renderer'
import { ConflictError, NotFoundError } from '../errors/http'
import { generateISBN, slugifyString } from '../helpers/common'
import { findCategory } from '../repository/category'
import { createBook } from '../repository/book'
import IBook from '../interfaces/models/book'

export const addBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as {
      title: string
      author: string
      description?: string
      cover_url?: string
      category_id: string
      language: string
      published_at?: Date
    }

    const titleExists = await findBook({ where: { title: payload.title } })
    if (titleExists) throw new ConflictError('Title already exists', {
      key: 'title', message: 'Title already exists',
    })
    
    const categoryExists = await findCategory({ where: { _id: payload.category_id } })
    if (!categoryExists) throw new NotFoundError('Category not found')
    
    const slug = slugifyString(`${payload.title} ${payload.author}`)

    const book = await createBook({
      ...payload,
      slug,
      isbn: generateISBN(),
      published_at: payload.published_at ?? new Date(),
    }) as IBook
    return renderObject(res, {
      _id: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      cover_url: book.cover_url,
      category_id: book.category_id,
      slug: book.slug,
      language: book.language,
      published_at: book.published_at,
    }, { status: 201, message: 'Book created successfully' })
  } catch (err: unknown) {
    return next(err)
  }
}

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const book = await findBook({
      where: { _id: id, is_active: true },
      select: {
        _id: 1,
        isbn: 1,
        title: 1,
        summary: 1,
        author: 1,
        description: 1,
        cover_url: 1,
        language: 1,
        slug: 1,
        published_at: 1,
        category_id: 1,
      },
    })
    return renderObject(res, book)
  } catch (err: unknown) {
    return next(err)
  }
}

export const getBookBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const book = await findBook({
      where: { slug, is_active: true },
      select: {
        _id: 1,
        isbn: 1,
        title: 1,
        summary: 1,
        author: 1,
        description: 1,
        cover_url: 1,
        language: 1,
        slug: 1,
        published_at: 1,
        category_id: 1,
      },
    })
    return renderObject(res, book)
  } catch (err: unknown) {
    return next(err)
  }
}

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search } = req.query

    const _where = {
      is_active: true,
    }
    const [books, totalCount] = await Promise.all([
      paginateBook({
        where: _where,
        select: {
          _id: 1,
          isbn: 1,
          title: 1,
          summary: 1,
          author: 1,
          cover_url: 1,
          language: 1,
          slug: 1,
          published_at: 1,
        },
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        populate: { path: 'category_id', select: { _id: 1, display_name: 1 } },
      }),
      countBook({ where: _where, search: search as string }),
    ])
    const result = {
      records: books,
      totalCount,
      pageInfo: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    }
    return renderObject(res, result)
  } catch (err: unknown) {
    return next(err)
  }
}

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const payload = req.body as {
      title: string
      author: string
      description?: string
      cover_url?: string
      category_id: string
      language: string
      published_at?: Date
    }

    const bookExists = await findBook({ where: { _id: id } })
    if (!bookExists) throw new NotFoundError('Book not found')

    const titleExists = await findBook({ where: { title: payload.title, _id: { $ne: id } } })
    if (titleExists) throw new ConflictError('Title already exists', {
      key: 'title', message: 'Title already exists',
    })
    const categoryExists = await findCategory({ where: { _id: payload.category_id } })
    if (!categoryExists) throw new NotFoundError('Category not found')
    
    const book = await updateBookToDB(id, {
      ...payload,
      slug: slugifyString(`${payload.title} ${payload.author}`),
    }) as IBook
    return renderObject(res, {
      _id: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      cover_url: book.cover_url,
      category_id: book.category_id,
      language: book.language,
      slug: book.slug,
      published_at: book.published_at,
    }, { message: 'Book updated successfully' })
  } catch (err: unknown) {
    return next(err)
  }
}

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const book = await deleteBookToDB(id)
    return renderObject(res, book, { message: 'Book deleted successfully' })
  } catch (err: unknown) {
    return next(err)
  }
}
