import { Request, Response, NextFunction } from 'express'
import { verifyJWTToken } from './jwtToken/jwt'
import { UnauthorizedError } from '../types/errors'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      throw new UnauthorizedError('No authorization token provided')
    }

    // Support both "Bearer token" and "token" formats
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader

    if (!token) {
      throw new UnauthorizedError('Invalid authorization header format')
    }

    const tokenInfo = verifyJWTToken(token)
    req.user = { userId: tokenInfo.userId, admin: tokenInfo.admin }
    next()
  } catch (error) {
    next(error)
  }
}
