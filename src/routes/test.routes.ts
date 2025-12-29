import { Router } from 'express'
import {
  testController,
  createProjectController,
  getProjectController,
  getAllProjectsController,
  updateProjectController,
  deleteProjectController
} from '../controllers/test.controller'
import { authMiddleware } from '../middlewares/authMiddleware'
import { limitIPRequestMiddleware } from '../middlewares/limitIPRequestMiddleware'
import { createProjectSchema, getProjectSchema, updateProjectSchema } from '../validators/project.validators'

const router = Router()

// Test endpoint
router.get('/test', testController)

// Project routes (protected with auth and rate limiting)
router.post('/projects', authMiddleware, limitIPRequestMiddleware,  createProjectController)

router.get('/projects', authMiddleware, getAllProjectsController)

router.get('/projects/:id', authMiddleware,  getProjectController)

router.patch('/projects/:id', authMiddleware, limitIPRequestMiddleware, updateProjectController)

router.delete('/projects/:id', authMiddleware, limitIPRequestMiddleware, deleteProjectController)

export default router