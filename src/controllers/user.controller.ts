import { Request, Response, NextFunction } from 'express'
import { ResponseHandler } from '../utils/response'
import { asyncHandler } from '../middlewares/errorHandler'
import { userService } from '../services/user.service'
import { NotFoundError } from '../types/errors'
import { createUserSchema } from '../validators/project.validators'
import { generateJWTAccessToken } from '../middlewares/jwtToken/jwt'

export const testController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  ResponseHandler.success(res, { message: 'Test endpoint working' })
})

export const createUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const safeBody = createUserSchema.parse(req.body)
  const user = await userService.createUser(safeBody.email, safeBody.password)
  const jwt = generateJWTAccessToken(user.id, false)
  const accessToken = { token: jwt }
  ResponseHandler.created(res, accessToken, 'User created successfully')
})

export const loginUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const safeBody = createUserSchema.parse(req.body)
  const user = await userService.loginUser(safeBody.email, safeBody.password)
  const jwt = generateJWTAccessToken(user.id, false)
  const accessToken = { token: jwt }
  ResponseHandler.success(res, accessToken, 'Login successful')
})

export const executeController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  if (!user) {
    throw new NotFoundError('User not found')
  }
  const txHash = await userService.sendTransaction(user.userId)
  ResponseHandler.success(res, { txHash }, 'Transaction executed successfully')
})
