import dotenv from 'dotenv'
import z from 'zod'
dotenv.config()

export const envSchema = {
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  UI_URL: z.string().startsWith('http').default('*'),
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(10, 'ACCESS_TOKEN_SECRET must be at least 10 characters')
    .default('default_secret'),
  LIMITER_TIME: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().int().positive())
    .default(15 * 60 * 1000), // 15 minutes
  LIMITER_MAX_REQUESTS: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().int().positive())
    .default(50),
  ENCRYPT_MASTER_KEY: z
    .string()
    .min(10, 'ENCRYPT_MASTER_KEY must be at least 10 characters')
    .default('master_key_12345'),
  MASTER_PRIVATE_KEY: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, 'MASTER_PRIVATE_KEY must be a valid 66-character hex string starting with 0x')
}

export const envs = z
  .object(envSchema)
  .parse({
    NODE_ENV: process.env.NODE_ENV,
    UI_URL: process.env.UI_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    LIMITER_TIME: process.env.LIMITER_TIME,
    LIMITER_MAX_REQUESTS: process.env.LIMITER_MAX_REQUESTS,
    ENCRYPT_MASTER_KEY: process.env.ENCRYPT_MASTER_KEY,
    MASTER_PRIVATE_KEY: process.env.MASTER_PRIVATE_KEY
  })

export const UI_URL = envs.UI_URL
