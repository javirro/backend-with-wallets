import { Router } from 'express'
import { testController, createUserController, loginUserController, executeController } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/authMiddleware'
import { limitIPRequestMiddleware } from '../middlewares/limitIPRequestMiddleware'

const router = Router()

// Test endpoint
router.get('/test', testController)

// Project routes (protected with auth and rate limiting)
router.post('/register', limitIPRequestMiddleware, createUserController)

router.post('/login', limitIPRequestMiddleware, loginUserController)

router.post('/execute', authMiddleware, executeController)

export default router
