import { Request, Response, NextFunction } from 'express'
import { ConflictError, UnauthorizedError } from '../errors/http'
import { createUser, findUser, updateUser } from '../repository/user'
import { findRole } from '../repository/role'
import { hashPassword, verifyPassword } from '../helpers/password'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../helpers/jwt'
import { renderObject } from '../helpers/renderer'
import IRole from '../interfaces/models/role'
import IUser from '../interfaces/models/user'
import appConfig from '../config/app'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body

    const emailExists = await findUser({ where: { email } })
    if (emailExists) throw new ConflictError('Email exists', [{ path: 'email', message: 'Email already exists' }])

    const memberRole = await findRole({ where: { name: 'member' }, select: '_id' }) as IRole
    const hashedPassword = hashPassword(password)
    
    await createUser({
      name,
      email,
      password: hashedPassword,
      role_id: memberRole?._id,
    })

    res.status(201).json({ message: 'Registered successfully' })
  } catch (err: unknown) {    
    return next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await findUser({ where: { email, is_active: true } }) as IUser
    if (!user) throw new UnauthorizedError('Invalid email or password')

    const isVerifiedPassword = verifyPassword(password, user.password as string)
    if (!isVerifiedPassword) throw new UnauthorizedError('Invalid email or password')
    
    // Get user role name
    const userRole = await findRole({ where: { _id: user.role_id as string }, select: 'name' }) as IRole
    const roleName = userRole?.name || 'member'
    
    const accessToken = generateAccessToken({
      userId: user._id?.toString() as string,
      email: user.email as string,
      role: roleName,
    })
    
    const tokenVersion = (user.tokenVersion || 0) + 1
    const refreshToken = generateRefreshToken({
      userId: user._id?.toString() as string,
      email: user.email as string,
      role: roleName,
      tokenVersion,
    })
    
    // Update last login and token version
    await updateUser(
      user._id as string,
      { 
        login_at: new Date(),
        tokenVersion,
      },
    )
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: appConfig.isProd,
      sameSite: 'strict',
      maxAge: appConfig.jwt.refreshTokenExpiryInMinutes * 60 * 1000, // 7 days in milliseconds
    })
    
    return renderObject(res, {     
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: roleName,
      },
    }, { message: 'Login successful' })
    
  } catch (err: unknown) {
    return next(err)
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies
    
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token missing')
    }
    
    const decoded = verifyRefreshToken(refreshToken)
    
    const user = await findUser({ where: { _id: decoded.userId, is_active: true } }) as IUser
    if (!user) throw new UnauthorizedError('User not exists')    
    
    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new UnauthorizedError('Token has been expired')
    }
    
    const userRole = await findRole({ where: { _id: user.role_id as string }, select: 'name' }) as IRole
    const roleName = userRole?.name || 'member'
    
    const newAccessToken = generateAccessToken({
      userId: user._id?.toString() as string,
      email: user.email as string,
      role: roleName,
    })
    
    return renderObject(res, {
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
    })
    
  } catch (err: unknown) {
    return next(err)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken')
    
    return renderObject(res, {}, { message: 'Logout successful' })
    
  } catch (err: unknown) {
    return next(err)
  }
}