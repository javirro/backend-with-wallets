import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { UI_URL } from './constants'
import testRoutes from './routes/test.routes'
import { errorHandler } from './middlewares/errorHandler'
import dbClient from './db/connectionDB'

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin: UI_URL,
    credentials: true
  })
)

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Body parsing
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// API routes
app.use('/api/v1', testRoutes)

// Health check with database connection test
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Test database connection
    await dbClient.query('SELECT 1')

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    })
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    })
  }
})

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the API' })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

export default app
