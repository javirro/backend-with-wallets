import { z } from 'zod'

// Example validation schema for test endpoint
export const createProjectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true)
})

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number)
  }),
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional()
  })
})

export const getProjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number)
  })
})

// Add more schemas as needed for your endpoints
