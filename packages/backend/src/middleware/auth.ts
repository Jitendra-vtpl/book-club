import { Request, Response, NextFunction } from 'express'
import { InvalidTokenError } from '../errors/http'
import { verifyAccessToken } from '../helpers/jwt'
import { findUser } from '../repository/user'

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      throw new InvalidTokenError('Access token missing')
    }

    const decoded = verifyAccessToken(token)
    
    // Verify user still exists and is active
    const userExists = await findUser({ where: { _id: decoded.userId, is_active: true } })
    if (!userExists) {
      throw new InvalidTokenError('User not exists or inactive')
    }

    req.user = decoded
    next()
  } catch {
    return next(new InvalidTokenError('Invalid token'))
  }
}
