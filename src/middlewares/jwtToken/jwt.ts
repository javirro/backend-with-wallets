import { envs } from '../../constants'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'

export interface VerifyJWTRes {
  userId: number
  admin: boolean
  iat: number
  exp: number
}

export const generateJWTAccessToken = (userId: number, admin: boolean, is30days: boolean = false): string => {
  const validTime: string | number = is30days ? 24 * 30 * 60 * 60 : 60 * 60
  const options: SignOptions = { expiresIn: validTime }
  const secret = envs.ACCESS_TOKEN_SECRET as Secret
  const jwtToken: string = jwt.sign({ userId, admin }, secret, options)
  return jwtToken
}

export const verifyJWTToken = (token: string): VerifyJWTRes => {
  const secret = envs.ACCESS_TOKEN_SECRET as Secret
  const res: VerifyJWTRes = jwt.verify(token, secret) as VerifyJWTRes
  return res
}
