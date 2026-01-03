import { Router } from 'express'
import { testController, createUserController, loginUserController, executeController, createUserSCAController, executeSCAController, loginUserSCAController } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/authMiddleware'
import { limitIPRequestMiddleware } from '../middlewares/limitIPRequestMiddleware'

const router = Router()

// Test endpoint
router.get('/test', testController)

// Project routes (protected with auth and rate limiting)
router.post('/register', limitIPRequestMiddleware, createUserController)

router.post('/login', limitIPRequestMiddleware, loginUserController)

router.post('/execute', authMiddleware, executeController)

// SCA routes
router.post('/register-sca', limitIPRequestMiddleware, createUserSCAController)
router.post('/login-sca', limitIPRequestMiddleware, loginUserSCAController)
router.post('/execute-sca', authMiddleware, executeSCAController)

export default router
