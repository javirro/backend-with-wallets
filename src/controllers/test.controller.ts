import { Request, Response, NextFunction } from 'express'
import { ResponseHandler } from '../utils/response'
import { asyncHandler } from '../middlewares/errorHandler'
import { projectService } from '../services/project.service'
import { NotFoundError } from '../types/errors'

export const testController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  ResponseHandler.success(res, { message: 'Test endpoint working' })
})

export const createProjectController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await projectService.createProject(req.body)
    ResponseHandler.created(res, project, 'Project created successfully')
  }
)

export const getProjectController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const project = await projectService.getProjectById(Number(req.params.id))

  if (!project) {
    throw new NotFoundError('Project not found')
  }

  ResponseHandler.success(res, project)
})

export const getAllProjectsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const projects = await projectService.getAllProjects()
    ResponseHandler.success(res, projects)
  }
)

export const updateProjectController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await projectService.updateProject(Number(req.params.id), req.body)

    if (!project) {
      throw new NotFoundError('Project not found')
    }

    ResponseHandler.success(res, project, 'Project updated successfully')
  }
)

export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await projectService.deleteProject(Number(req.params.id))

    if (!project) {
      throw new NotFoundError('Project not found')
    }

    ResponseHandler.success(res, null, 'Project deleted successfully')
  }
)

