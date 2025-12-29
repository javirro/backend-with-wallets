import { Response } from 'express'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
}

export class ResponseHandler {
  static success<T>(res: Response, data?: T, message?: string, statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true
    }

    if (message) response.message = message
    if (data !== undefined) response.data = data

    return res.status(statusCode).json(response)
  }

  static created<T>(res: Response, data?: T, message: string = 'Resource created successfully') {
    return this.success(res, data, message, 201)
  }

  static error(res: Response, message: string, statusCode: number = 500, errors?: any[]) {
    const response: ApiResponse = {
      success: false,
      message
    }

    if (errors) response.errors = errors

    return res.status(statusCode).json(response)
  }
}
