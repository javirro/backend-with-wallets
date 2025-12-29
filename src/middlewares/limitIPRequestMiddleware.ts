import { envs } from '../constants'
import rateLimit from 'express-rate-limit'


export const limitIPRequestMiddleware = rateLimit({
  windowMs: envs.LIMITER_TIME,
  max: envs.LIMITER_MAX_REQUESTS,
  message: 'Too many request on this endpoint, please try again later.',
  headers: true
})
