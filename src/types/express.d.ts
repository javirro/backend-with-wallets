import { Request } from 'express'

export interface AuthUser {
  userId: number
  admin: boolean
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}
