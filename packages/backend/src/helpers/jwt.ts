import jwt, { SignOptions } from 'jsonwebtoken'
import appConfig from '../config/app'

interface TokenPayload {
  userId: string
  email: string
  role: string
}

interface RefreshTokenPayload extends TokenPayload {
  tokenVersion: number
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = appConfig.jwt.accessTokenSecret
  return jwt.sign(payload, secret, { expiresIn: appConfig?.jwt.accessTokenExpiry } as SignOptions)
}

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  const secret = appConfig.jwt.refreshTokenSecret
  return jwt.sign(payload, secret, { expiresIn: appConfig?.jwt.refreshTokenExpiry } as SignOptions)
}

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = appConfig.jwt.accessTokenSecret
  try {
    return jwt.verify(token, secret) as TokenPayload
  } catch {
    throw new Error('Invalid access token')
  }
}

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const secret = appConfig.jwt.refreshTokenSecret
  try {
    return jwt.verify(token, secret) as RefreshTokenPayload
  } catch {
    throw new Error('Invalid refresh token')
  }
}

export const decodeToken = (token: string): unknown => {
  try {
    return jwt.decode(token)
  } catch {
    return null
  }
} 