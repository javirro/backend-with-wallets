import { Pool, PoolConfig } from 'pg'
import * as dotenv from 'dotenv'
import z from 'zod'
dotenv.config()

const postgresSchema = z.object({
  host: z.string(),
  user: z.string(),
  port: z.string().transform((val) => Number(val)),
  password: z.string(),
  database: z.string()
})

const databaseUrlSchema = z.string({
  message: 'DATABASE_URL must be a valid URL'
})
let config: PoolConfig = {}
try {
  const safeDatabaseURL = databaseUrlSchema.parse(process.env.DATABASE_URL)
  const params = new URL(safeDatabaseURL)
  config = {
    host: params.hostname,
    user: params.username,
    port: Number(params.port),
    password: params.password,
    database: params.pathname.split('/')[1]
  }
} catch (error) {
  console.error(error)
  const safePostgresConfig = postgresSchema.parse({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  })
  config = {
    host: safePostgresConfig.host,
    user: safePostgresConfig.user,
    port: safePostgresConfig.port,
    password: safePostgresConfig.password,
    database: safePostgresConfig.database
  }
}

const dbClient = new Pool(config)

export default dbClient

export const ALREADY_EXIST_CODE = '23505'
